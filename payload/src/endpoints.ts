import payload from "payload";
import type { Endpoint } from "payload/config";

export const endpoints: Endpoint[] = [
  {
    path: "/my-downloads",
    method: "post",
    handler: async (req, res, next) => {
      const body = req.body;
      const { access_token, patreon_id, is_pledged, pledge_amount } = body;

      try {
        const pledgeRes = await fetch(
          "https://www.patreon.com/api/oauth2/api/current_user",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          },
        );
        const pledges: IsPlegdedProps = await pledgeRes.json();
        const isPledged = pledges.included.find((e) => {
          if (e.attributes) {
            if (e.attributes.url) {
              return e.attributes.url?.includes(process.env.PATREON_NAME);
            }
          }
          return false;
        });

        const checkPatreonId = patreon_id === pledges.data.id;
        const checkPledgeAmount =
          Number(pledge_amount) === isPledged.attributes.amount;

        if (checkPatreonId && checkPledgeAmount) {
          if (isPledged && isPledged.attributes.amount) {
            let amount = isPledged.attributes.amount;
            amount = Number((amount / 100).toFixed(0));

            const tier = await payload.find({
              collection: "tiers",
              where: {
                price: {
                  equals: amount,
                },
              },
            });
            const tierDetails = tier.docs[0];

            const packs = await payload.find({
              collection: "packs",
              where: {
                tiers: {
                  equals: tierDetails.id,
                },
              },
            });
            const packList = packs.docs.map((pack) => {
              const { id, title } = pack;
              return { id, title };
            });

            const downloads = await payload.find({
              collection: "downloads",
              where: {
                and: [
                  {
                    tiers: {
                      equals: tierDetails.id,
                    },
                  },
                ],
              },
            });
            const downloadList = downloads.docs.map((download) => {
              const { id, release, resolution, pack } = download;
              // @ts-ignore
              const { title } = pack;
              return {
                id,
                release,
                resolution,
                name: `${title} ${release}`,
              };
            });

            res.status(200).json({
              tier: tierDetails,
              packs: packList,
              downloads: downloadList,
            });
            return;
          }

          res.status(402).json({
            message: "Invalid access",
          });
          return;
        }
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: JSON.stringify(err) });
        return;
      }

      res.status(402).json({
        message: "Invalid access",
      });
      return;
    },
  },

  {
    path: "/verify-user",
    method: "post",
    handler: async (req, res, next) => {
      const body = req.body;
      const {
        access_token,
        patreon_id,
        pledge_amount,
        pack_id,
        download_id,
        code,
      } = body;

      try {
        const pledgeRes = await fetch(
          "https://www.patreon.com/api/oauth2/api/current_user",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          },
        );
        const pledges: IsPlegdedProps = await pledgeRes.json();
        const isPledged =
          pledges && pledges.included
            ? pledges.included.find((e) => {
                if (e.attributes) {
                  if (e.attributes.url) {
                    return e.attributes.url?.includes(process.env.PATREON_NAME);
                  }
                }
                return false;
              })
            : false;

        const checkPatreonId = patreon_id === pledges.data.id;
        const checkPledgeAmount =
          isPledged && isPledged.attributes
            ? Number(pledge_amount) === isPledged.attributes.amount
            : false;

        if (
          (code && code.length > 8) ||
          (checkPatreonId && checkPledgeAmount && isPledged)
        ) {
          const downloadDoc = await payload.findByID({
            collection: "downloads",
            id: download_id,
            depth: 0,
          });

          if (!code && isPledged && downloadDoc.pack === pack_id) {
            const amount = isPledged.attributes
              ? Math.round(isPledged.attributes.amount / 100)
              : 0;
            const tierDoc = await payload.find({
              collection: "tiers",
              where: {
                price: {
                  equals: amount,
                },
              },
            });

            if (!code || tierDoc.totalDocs === 0) {
              throw new Error("Unauth");
            }

            const tierId = tierDoc.docs[0].id;

            if (!code || !downloadDoc.tiers.includes(tierId)) {
              throw new Error("Unauth");
            }

            res.status(200).json({
              verified: true,
              email: pledges.data.attributes.email,
              discord_id: pledges.data.attributes.discord_id,
              patreon_user_id: pledges.data.id,
            });
            return;
          }

          const codeDocs = await payload.find({
            collection: "codes",
            where: {
              code: {
                equals: code,
              },
            },
          });
          if (code && codeDocs.totalDocs < 1) {
            throw new Error("Fraudulent");
          }
          const codeDoc = codeDocs.docs[0];
          await payload.update({
            collection: "codes",
            where: {
              code: {
                equals: codeDoc.code,
              },
            },
            data: {
              code: codeDoc.code,
              uses_remaining: codeDoc.uses_remaining - 1,
              is_used: codeDoc.uses_remaining - 1 < 1,
            },
          });

          res.status(402).json({
            message: "Invalid access",
            error: true,
            email: pledges.data.attributes.email,
            discord_id: pledges.data.attributes.discord_id,
            patreon_user_id: pledges.data.id,
          });
          return;
        } else {
          const codeDocs = await payload.find({
            collection: "codes",
            where: {
              code: {
                equals: code,
              },
            },
          });
          if (code && codeDocs.totalDocs < 1) {
            throw new Error("Fraudulent");
          }
          const codeDoc = codeDocs.docs[0];
          await payload.update({
            collection: "codes",
            where: {
              code: {
                equals: codeDoc.code,
              },
            },
            data: {
              code: codeDoc.code,
              uses_remaining: codeDoc.uses_remaining - 1,
              is_used: codeDoc.uses_remaining - 1 < 1,
            },
          });
          res.status(403).json({
            error: true,
            email: pledges.data.attributes.email,
            discord_id: pledges.data.attributes.discord_id,
            patreon_user_id: pledges.data.id,
          });
          return;
        }
      } catch (err) {
        console.error(err);
        res.status(403).json({ error: true });
        return;
      }
    },
  },

  {
    path: "/check-code",
    method: "post",
    handler: async (req, res, next) => {
      try {
        const {
          access_token,
          code,
        }: {
          access_token: string;
          code: string;
        } = req.body;

        if (!access_token || !code) {
          res.status(403).json({
            message: "Failed to fetch data",
          });
          return;
        }

        const codeDocs = await payload.find({
          collection: "codes",
          where: {
            code: {
              equals: code,
            },
          },
          depth: 1,
        });

        if (!codeDocs.totalDocs) {
          res.status(404).json({
            message: "Entered code doesn't exist.",
          });
          return;
        }

        const codeDoc = codeDocs.docs[0];
        const { tier, uses_remaining, is_used, expiry } = codeDoc;

        const today = new Date();
        const expiryDate = new Date(expiry);
        if (
          today > expiryDate ||
          !uses_remaining ||
          is_used ||
          typeof tier === "string"
        ) {
          res.status(403).json({
            message: "Entered code has expired.",
          });
          return;
        }

        const packs = await payload.find({
          collection: "packs",
          where: {
            tiers: {
              equals: tier.id,
            },
          },
        });
        const packList = packs.docs.map((pack) => {
          const { id, title } = pack;
          return { id, title };
        });

        const downloads = await payload.find({
          collection: "downloads",
          where: {
            and: [
              {
                tiers: {
                  equals: tier.id,
                },
              },
            ],
          },
        });
        const downloadList = downloads.docs.map((download) => {
          const { id, release, resolution, pack } = download;
          // @ts-ignore
          const { title } = pack;
          return {
            id,
            release,
            resolution,
            name: `${title} ${release}`,
          };
        });

        res.status(200).json({
          code: {
            code: codeDoc.code,
            uses_remaining,
            expiry,
          },
          tier: tier,
          packs: packList,
          downloads: downloadList,
        });
      } catch (err) {
        console.error(err);
        res.status(500).json({
          error: true,
        });
      }
    },
  },
];

interface IsPlegdedProps {
  data: {
    id: string;
    attributes: {
      email: string;
      discord_id: string;
    };
  };
  included: Included[];
}

interface Included {
  attributes: Attributes;
}

interface Attributes {
  url?: string;
  amount_cents?: number;
  amount?: number;
}

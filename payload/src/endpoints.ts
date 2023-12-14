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
        const isPledged = pledges.included.find(
          (e) => e.attributes.url?.includes(process.env.PATREON_NAME),
        );

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
];

interface IsPlegdedProps {
  data: {
    id: string;
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

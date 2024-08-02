import payload from "payload";
import type { Endpoint } from "payload/config";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import AdmZip from "adm-zip";
import { Code, Tier } from "payload/generated-types";

const cId = process.env.PATREON_CID;

async function getUser(accessToken: string) {
  const res = await fetch(
    "https://www.patreon.com/api/oauth2/v2/identity?include=memberships,memberships.currently_entitled_tiers,memberships.campaign&fields%5Bmember%5D=currently_entitled_amount_cents,patron_status",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  const data: PatreonUserProps = await res.json();
  const pledges = data.included;
  return pledges.filter(
    (p) =>
      p &&
      p.attributes &&
      p.attributes.currently_entitled_amount_cents > 10 &&
      p.attributes.patron_status === "active_patron" &&
      p.relationships.campaign.data.id === cId,
  );
}

export const endpoints: Endpoint[] = [
  {
    path: "/my-downloads",
    method: "post",
    handler: async (req, res, next) => {
      const { access_token, is_pledged, pledge_amount } = req.body;

      try {
        const pledges = await getUser(access_token);

        if (pledges.length && is_pledged && pledge_amount > 200) {
          const userDetails = pledges[0];
          const pledgeAmount =
            userDetails.attributes.currently_entitled_amount_cents;
          const checkPledgeAmount = pledge_amount === pledgeAmount;

          if (checkPledgeAmount) {
            if (userDetails.attributes.currently_entitled_amount_cents) {
              let amount = Number((pledgeAmount / 100).toFixed(0));

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
                  pack: title,
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
    path: "/get-download/:id",
    method: "post",
    handler: async (req, res, next) => {
      try {
        const { id: download_id } = req.params;
        const { access_token, patreon_id, pledge_amount, code } = req.body;

        const pledges = await getUser(access_token);

        if (code || (pledges.length && pledge_amount > 200)) {
          let codeDocs: { docs: Code[]; totalDocs: number };
          if (code) {
            codeDocs = await payload.find({
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
          }

          // @ts-ignore
          const codeDoc: Code = code
            ? codeDocs.docs[0]
            : {
                code: null,
                is_used: true,
                uses_remaining: 0,
              };

          const userDetails = pledges[0];
          const pledgeAmount = !codeDoc.code
            ? userDetails.attributes.currently_entitled_amount_cents
            : 0;
          const checkPledgeAmount = pledge_amount === pledgeAmount;

          if ((codeDoc.code && codeDoc.code.length > 6) || checkPledgeAmount) {
            if (
              codeDoc.code ||
              userDetails.attributes.currently_entitled_amount_cents
            ) {
              const downloadDoc = await payload.findByID({
                collection: "downloads",
                id: download_id,
                depth: 0,
              });

              let amount = Number((pledgeAmount / 100).toFixed(0));

              const tierDoc = await payload.find({
                collection: "tiers",
                where: {
                  price: {
                    equals: !codeDoc.code
                      ? amount
                      : (codeDoc.tier as Tier).price,
                  },
                },
              });

              if (!tierDoc.totalDocs) {
                throw new Error("Unauthorised");
              }
              const tierId = tierDoc.docs[0].id;
              if (!downloadDoc.tiers.includes(tierId)) {
                throw new Error("Unauthorised");
              }

              const fileDoc = await payload.findByID({
                collection: "files",
                id: downloadDoc.file as string,
              });

              const fileLocation = path.resolve(__dirname, "./" + fileDoc.url);
              const newFileName = `${
                fileDoc.filename.split(".")[0]
              }-${patreon_id}-${uuidv4()}.zip`;
              const newFilePath = path.resolve(
                __dirname,
                "./files/" + newFileName,
              );

              const originalZip = new AdmZip(fileLocation);
              const packMcmetaEntry = originalZip.getEntry("pack.mcmeta");

              if (packMcmetaEntry) {
                const packMcmetaContent = packMcmetaEntry.getData().toString();
                const modifiedPackMcmetaContent = `${packMcmetaContent}\n// ${patreon_id}${
                  codeDoc.code ? `\n// ${codeDoc.code}` : ""
                }`;

                const newZip = new AdmZip();
                originalZip.getEntries().forEach((entry) => {
                  if (entry.entryName === "pack.mcmeta") {
                    newZip.addFile(
                      entry.entryName,
                      Buffer.from(modifiedPackMcmetaContent, "utf8"),
                    );
                  } else {
                    newZip.addFile(entry.entryName, entry.getData());
                  }
                });
                await newZip.writeZipPromise(newFilePath);

                const pack = await payload.findByID({
                  collection: "packs",
                  id: downloadDoc.pack as string,
                });
                const tokenDownload = await payload.create({
                  collection: "logs",
                  data: {
                    file_path: newFilePath,
                    filename: `${pack.title}-${downloadDoc.release}-${downloadDoc.resolution}x.zip`,
                    code: code,
                    expires: String(
                      new Date(new Date().getTime() + 7.5 * 1000 * 60),
                    ),
                  },
                });

                fs.access(newFilePath, fs.constants.R_OK, (err) => {
                  if (err) {
                    console.error(err);
                    res.status(404).send("File not found");
                    return;
                  }

                  res.status(200).json({
                    token: tokenDownload.token,
                  });
                  res.on("finish", async () => {
                    if (code) {
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
                    }

                    setTimeout(
                      () => {
                        fs.unlink(newFilePath, (err) => {
                          if (err) {
                            console.error("Error deleting file:", err);
                          } else {
                            console.log(`File ${newFileName} has been deleted`);
                          }
                        });
                      },
                      7.5 * 1000 * 60,
                    );
                  });
                });

                return;
              }

              res.status(402).json({
                message: "Invalid access",
              });
              return;
            }

            res.status(402).json({
              message: "Invalid access",
            });
            return;
          }

          res.status(200).json({ success: true });
          return;
        }

        res.status(200).json({ success: true });
        return;
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: JSON.stringify(err) });
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

  {
    path: "/download",
    method: "get",
    handler: async (req, res, next) => {
      try {
        const { token } = req.query;

        if (!token) {
          throw new Error("Expired token");
        }

        const tokenDocs = await payload.find({
          collection: "logs",
          where: {
            token: {
              equals: token,
            },
          },
        });

        if (!tokenDocs.totalDocs) {
          throw new Error("Invalid token");
        }

        const tokenDoc = tokenDocs.docs[0];
        const now = new Date();

        if (now > new Date(tokenDoc.expires)) {
          throw new Error("Expired token");
        }
        if (tokenDoc.expired) {
          throw new Error("Expired token");
        }
        if (!fs.existsSync(tokenDoc.file_path)) {
          throw new Error("File not found");
        }

        const fileStream = fs.createReadStream(tokenDoc.file_path);
        res.setHeader("Content-Type", "application/zip");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="${tokenDoc.filename}"`,
        );
        fileStream.pipe(res);
        res.on("finish", async () => {
          fs.unlinkSync(tokenDoc.file_path);
          await payload.update({
            collection: "logs",
            id: tokenDoc.id,
            data: {
              expired: true,
            },
          });
        });
      } catch (err) {
        console.error(err);
        res.status(500).json({
          error: String(err),
        });
      }
    },
  },
];

export interface PatreonUserProps {
  included: {
    attributes: {
      currently_entitled_amount_cents: number;
      patron_status: string | null;
    };
    relationships: {
      campaign: {
        data: {
          id: string;
        };
      };
    };
  }[];
}

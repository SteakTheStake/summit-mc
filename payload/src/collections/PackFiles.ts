import type { CollectionConfig } from "payload/types";

const PackFiles: CollectionConfig = {
  slug: "files",
  access: {
    read: ({ req: { user } }) => Boolean(user),
  },
  upload: {
    staticURL: "/files",
    staticDir: "files",
    // mimeTypes: ["application/zip"],
  },
  fields: [],
  hooks: {
    afterChange: [
      async ({ doc: { url } }) => {
        const fileLocation = "src/" + url;
        const filesFolder = "src/files/unzipped";
      },
    ],
  },
};

export default PackFiles;

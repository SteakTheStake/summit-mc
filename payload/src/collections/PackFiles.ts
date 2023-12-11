import type { CollectionConfig } from "payload/types";

const PackFiles: CollectionConfig = {
  slug: "files",
  upload: {
    staticURL: "/files",
    staticDir: "files",
    mimeTypes: ["application/zip"],
  },
  fields: [],
};

export default PackFiles;

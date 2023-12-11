import type { CollectionConfig } from "payload/types";

const Downloads: CollectionConfig = {
  slug: "downloads",
  admin: {
    useAsTitle: "release",
  },
  fields: [
    {
      name: "release",
      type: "text",
      required: true,
    },
    {
      name: "resolution",
      type: "number",
      required: true,
    },
    {
      name: "pack",
      type: "relationship",
      relationTo: "packs",
      required: true,
    },
    {
      name: "tiers",
      type: "relationship",
      relationTo: "tiers",
      hasMany: true,
      required: true,
    },
    {
      name: "file",
      type: "relationship",
      relationTo: "files",
      required: true,
    },
  ],
};

export default Downloads;

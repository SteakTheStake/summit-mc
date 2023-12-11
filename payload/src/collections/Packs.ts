import type { CollectionConfig } from "payload/types";

const Packs: CollectionConfig = {
  slug: "packs",
  admin: {
    useAsTitle: "title",
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "tiers",
      type: "relationship",
      relationTo: "tiers",
      hasMany: true,
      required: true,
    },
  ],
};

export default Packs;

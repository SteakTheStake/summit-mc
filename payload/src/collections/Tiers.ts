import { CollectionConfig } from "payload/types";

const Tiers: CollectionConfig = {
  slug: "tiers",
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: "name",
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "price",
      type: "number",
      required: true,
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "join_link",
      label: "Join Link",
      type: "text",
      required: true,
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "is_free",
      label: "Is Free?",
      type: "checkbox",
      unique: true,
    },
    {
      name: "included",
      type: "array",
      minRows: 1,
      fields: [{ name: "item", type: "text", required: true }],
    },
  ],
};

export default Tiers;

import type { CollectionConfig } from "payload/types";
import { generateCode } from "../lib/format";

const Codes: CollectionConfig = {
  slug: "codes",
  fields: [
    {
      type: "row",
      fields: [
        {
          name: "code",
          type: "text",
          hooks: {
            beforeValidate: [generateCode("code")],
          },
          admin: {
            width: "50%",
          },
        },
        {
          name: "discord_id",
          label: "Discord ID",
          type: "number",
          admin: {
            width: "50%",
          },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "uses_remaining",
          label: "Remaining Uses",
          type: "number",
          required: true,
          admin: {
            width: "33%",
          },
        },
        {
          name: "expiry",
          type: "date",
          required: true,
          admin: {
            width: "33%",
          },
        },
        {
          name: "is_used",
          label: "Is Used?",
          type: "checkbox",
          admin: {
            width: "33%",
          },
        },
      ],
      admin: {
        style: {
          alignItems: "center",
        },
      },
    },
    {
      name: "tiers",
      type: "relationship",
      relationTo: "tiers",
      hasMany: true,
      required: true,
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc }) => {
        const {} = doc;
        console.log(doc);

        return doc;
      },
    ],
  },
};

export default Codes;

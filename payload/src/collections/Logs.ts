import { CollectionConfig } from "payload/types";
import { v4 } from "uuid";

const Logs: CollectionConfig = {
  slug: "logs",
  admin: {
    useAsTitle: "customer",
    group: "Users",
  },
  fields: [
    {
      name: "filename",
      type: "text",
      required: true,
    },
    {
      type: "row",
      fields: [
        {
          name: "token",
          type: "text",
          defaultValue: v4(),
          admin: {
            width: "50%",
          },
        },
        {
          name: "file_path",
          type: "text",
          required: true,
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
          name: "expires",
          type: "date",
          admin: {
            date: {
              pickerAppearance: "timeOnly",
            },
            width: "33%",
          },
        },
        {
          name: "expired",
          type: "checkbox",
          admin: {
            width: "33%",
          },
        },
      ],
    },
    {
      name: "code",
      type: "text",
    },
  ],
};

export default Logs;

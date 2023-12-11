import { CollectionConfig } from "payload/types";

const Media: CollectionConfig = {
  slug: "media",
  access: { read: () => true },
  upload: {
    adminThumbnail: "card",
    imageSizes: [
      {
        name: "card",
        width: 640,
        height: 480,
      },
      {
        name: "feature",
        width: 1024,
        height: 576,
      },
    ],
  },
  fields: [
    {
      name: "alt",
      label: "Alt Text",
      type: "text",
      required: true,
    },
  ],
};

export default Media;

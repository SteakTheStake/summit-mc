import { Block } from "payload/types";

export const ImageSlider: Block = {
  slug: "compare",
  labels: {
    singular: "Compare Image",
    plural: "Compare Images",
  },
  fields: [
    {
      name: "one",
      label: "Image Before",
      type: "upload",
      relationTo: "media",
      required: true,
    },

    {
      name: "two",
      label: "Image After",
      type: "upload",
      relationTo: "media",
      required: true,
    },
  ],
};

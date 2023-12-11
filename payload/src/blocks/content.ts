import { slateEditor } from "@payloadcms/richtext-slate";
import { Block } from "payload/types";

export const Content: Block = {
  slug: "content",
  labels: {
    singular: "Content",
    plural: "Content Blocks",
  },
  fields: [
    {
      name: "content",
      type: "richText",
      editor: slateEditor({
        admin: {
          elements: [
            "h2",
            "h3",
            "h4",
            "textAlign",
            "upload",
            "ol",
            "ul",
            "link",
            "relationship",
            "blockquote",
            "indent",
          ],
          link: {
            fields: [
              {
                name: "rel",
                label: "Rel Attribute",
                type: "select",
                hasMany: true,
                options: ["noopener", "noreferrer", "nofollow"],
              },
              {
                name: "target",
                label: "Target",
                type: "checkbox",
                defaultValue: false,
              },
            ],
          },
        },
      }),
    },
  ],
};

import type { CollectionConfig } from "payload/types";
import { formatSlug } from "../lib/format";
import { Content } from "../blocks/content";
import { ImageSlider } from "../blocks/image-slider";

const Posts: CollectionConfig = {
  access: { read: () => true },
  slug: "posts",
  admin: {
    useAsTitle: "title",
  },
  fields: [
    {
      name: "title",
      label: "Title",
      type: "text",
      required: true,
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "subtitle",
      label: "Subtitle",
      type: "text",
      required: true,
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "meta_img",
      label: "Cover Image",
      type: "relationship",
      relationTo: "media",
      required: true,
      admin: {
        position: "sidebar",
      },
    },

    {
      name: "layout",
      label: "Content",
      type: "blocks",
      minRows: 1,
      blocks: [Content, ImageSlider],
    },

    {
      name: "slug",
      label: "Post Slug",
      type: "text",
      admin: {
        position: "sidebar",
      },
      hooks: {
        beforeValidate: [formatSlug("title")],
      },
    },
    {
      name: "is_draft",
      label: "Draft",
      type: "checkbox",
      defaultValue: true,
      admin: {
        position: "sidebar",
      },
    },
  ],
};

export default Posts;

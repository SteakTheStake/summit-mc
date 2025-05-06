import { CollectionConfig } from "payload/types";

const Screenshots: CollectionConfig = {
  slug: "screenshots",
  admin: {
    useAsTitle: "title",
  },
  access: {
    read: () => true,
    create: () => true,
  },
  fields: [
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      required: true,
      filterOptions: {
        mimeType: {
          contains: "image",
        },
      },
    },
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "description",
      type: "textarea",
    },
    {
      name: "hashtags",
      type: "array",
      label: "Hashtags",
      fields: [
        {
          name: "tag",
          type: "text",
          required: true,
        },
      ],
    },
    {
      name: "resources",
      type: "array",
      label: "Linked Resources",
      fields: [
        {
          name: "platform",
          type: "select",
          options: [
            { label: "Modrinth", value: "Modrinth" },
            { label: "CurseForge", value: "CurseForge" },
          ],
          required: true,
        },
        {
          name: "resourceId",
          type: "text",
          required: true,
        },
        {
          name: "resourceName",
          type: "text",
          required: true,
        },
      ],
    },
    {
      name: "author",
      type: "relationship",
      relationTo: "users",
      required: true,
    },
    {
      name: "likes",
      type: "array",
      fields: [
        {
          name: "userId",
          type: "relationship",
          relationTo: "users",
          required: true,
        },
      ],
    },
    {
      name: "comments",
      type: "array",
      fields: [
        {
          name: "user",
          type: "relationship",
          relationTo: "users",
          required: true,
        },
        {
          name: "content",
          type: "textarea",
          required: true,
        },
        {
          name: "createdAt",
          type: "date",
          admin: {
            readOnly: true,
          },
          defaultValue: () => new Date(),
        },
      ],
    },
  ],
};

export default Screenshots;

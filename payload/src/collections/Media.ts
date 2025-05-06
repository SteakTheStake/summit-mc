import { CollectionConfig } from "payload/types";

const Media: CollectionConfig = {
  slug: "screenshots", // Changed from "media" to "screenshots" to match API path
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
  },
  upload: {
    staticURL: '/screenshots',  // Changed from '/media' to '/screenshots'
    staticDir: 'screenshots',   // Changed directory name to match the URL
    adminThumbnail: "thumbnail",
    disableLocalStorage: false,
    mimeTypes: ["image/*"],
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
    ],
    uploadPath: ({ doc, req }) => {
      const username = req.user?.username || 'anonymous';
      return `${username}/img`; // This creates the path pattern: screenshots/{USERNAME}/img
    },
  },
  fields: [
    {
      name: "alt",
      type: "text",
      label: "Alt Text",
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
      type: "text",
      label: "Hashtags (comma separated)",
    },
    {
      name: "user",
      type: "relationship",
      relationTo: "users", // Assuming you have a users collection
      hasMany: false,
      admin: {
        position: "sidebar",
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ req, data }) => {
        // Set the user automatically on upload
        if (req.user) {
          return {
            ...data,
            user: req.user.id,
          };
        }
        return data;
      }
    ]
  }
};

export default Media;
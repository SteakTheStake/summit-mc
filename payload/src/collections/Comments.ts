
import { CollectionConfig } from 'payload/types';

const Comments: CollectionConfig = {
  slug: 'comments',
  admin: {
    useAsTitle: 'content',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
    {
      name: 'screenshot',
      type: 'relationship',
      relationTo: 'screenshots',
      required: true,
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'parentComment',
      type: 'relationship',
      relationTo: 'comments',
    },
    {
      name: 'likes',
      type: 'array',
      fields: [
        {
          name: 'userId',
          type: 'relationship',
          relationTo: 'users',
        }
      ]
    },
    {
      name: 'mentions',
      type: 'array',
      fields: [
        {
          name: 'userId',
          type: 'relationship',
          relationTo: 'users',
        }
      ]
    }
  ]
};

export default Comments;

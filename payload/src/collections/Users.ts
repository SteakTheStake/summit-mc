
import { CollectionConfig } from 'payload/types';

const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
  },
  access: {
    read: () => true,
    update: ({ req: { user }, id }) => {
      // Allow users to update their own profile
      if (user && user.id === id) return true;
      
      // Allow admins to update any profile
      if (user && user.role === 'admin') return true;
      
      return false;
    },
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
    },
    {
      name: 'password',
      type: 'text',
      required: true,
      hidden: true,
    },
    {
      name: 'patreonId',
      type: 'text',
      admin: {
        description: 'Linked Patreon account ID'
      }
    },
    {
      name: 'role',
      type: 'select',
      defaultValue: 'user',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Moderator', value: 'moderator' },
        { label: 'User', value: 'user' },
      ],
    },
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'bio',
      type: 'richText',
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'discordId',
      type: 'text',
    },
    {
      name: 'warningCount',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'isBanned',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'hashtags',
      type: 'array',
      fields: [
        {
          name: 'tag',
          type: 'text',
        }
      ]
    },
    {
      name: 'resources',
      type: 'array',
      fields: [
        {
          name: 'platform',
          type: 'select',
          options: ['Modrinth', 'CurseForge'],
        },
        {
          name: 'resourceId',
          type: 'text',
        },
        {
          name: 'resourceName', 
          type: 'text',
        }
      ]
    }
  ],
};

export default Users;

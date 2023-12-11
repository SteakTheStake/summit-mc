import { CollectionConfig } from 'payload/types'

const Tiers: CollectionConfig = {
  slug: "tiers",
  admin: {
    useAsTitle: "name"
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true
    },
    {
      name: "price",
      type: "number",
      required: true
    }
  ]
};

export default Tiers
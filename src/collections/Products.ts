import { CollectionConfig } from 'payload';

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'priceLkr', 'preOrderBatchCap'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'category',
      type: 'select',
      options: ['Specialty Denim', 'Denim Outerwear', 'Basics'],
      defaultValue: 'Specialty Denim',
    },
    {
      name: 'priceLkr',
      type: 'number',
      required: true,
      label: 'Price (LKR)',
    },
    {
      name: 'preOrderBatchCap',
      type: 'number',
      label: 'Batch Limit (Cap)',
      defaultValue: 100,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'fabric',
      type: 'text',
    },
    {
      name: 'variants',
      type: 'array',
      fields: [
        {
          name: 'size',
          type: 'select',
          options: ['26', '27', '28', '29', '30', '32'],
          required: true,
        },
        {
          name: 'sku',
          type: 'text',
          required: true,
        },
        {
          name: 'stockCap',
          type: 'number',
          required: true,
          defaultValue: 20,
        },
        {
          name: 'sold',
          type: 'number',
          defaultValue: 0,
        },
      ],
    },
  ],
};

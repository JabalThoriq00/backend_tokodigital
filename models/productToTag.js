// File: models/productToTag.js (opsional)
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const ProductToTag = sequelize.define(
    'ProductToTag',
    {
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      tag_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
    },
    {
      tableName: 'product_to_tag',
      timestamps: false,
    }
  );

  return ProductToTag;
};

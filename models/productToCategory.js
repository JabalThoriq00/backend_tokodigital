// File: models/productToCategory.js (opsional)
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const ProductToCategory = sequelize.define(
    'ProductToCategory',
    {
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
    },
    {
      tableName: 'product_to_category',
      timestamps: false,
    }
  );

  return ProductToCategory;
};

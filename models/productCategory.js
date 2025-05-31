// File: models/productCategory.js (opsional)
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const ProductCategory = sequelize.define(
    'ProductCategory',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: 'product_categories',
      timestamps: false,
    }
  );

  return ProductCategory;
};

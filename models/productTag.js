// File: models/productTag.js (opsional)
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const ProductTag = sequelize.define(
    'ProductTag',
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
    },
    {
      tableName: 'product_tags',
      timestamps: false,
    }
  );

  return ProductTag;
};

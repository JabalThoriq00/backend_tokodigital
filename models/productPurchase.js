// File: models/productPurchase.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const ProductPurchase = sequelize.define(
    'ProductPurchase',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      buyer_user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      buyer_email: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      purchase_price: {
        type: DataTypes.NUMERIC(10, 2),
        allowNull: false,
      },
      purchase_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      download_url: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'completed',
      },
    },
    {
      tableName: 'product_purchases',
      timestamps: false,
    }
  );

  return ProductPurchase;
};

// File: models/affiliateProduct.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const AffiliateProduct = sequelize.define(
    'AffiliateProduct',
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
      affiliate_user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      commission_rate: {
        type: DataTypes.NUMERIC(5, 2),
        allowNull: false,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'affiliate_products',
      timestamps: false,
    }
  );

  return AffiliateProduct;
};

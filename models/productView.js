// File: models/productView.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const ProductView = sequelize.define(
    'ProductView',
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
      viewed_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      viewer_ip: {
        type: DataTypes.INET,
        allowNull: true,
      },
      user_agent: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: 'product_views',
      timestamps: false,
    }
  );

  return ProductView;
};

// File: models/productClick.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const ProductClick = sequelize.define(
    'ProductClick',
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
      clicked_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      source_page: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      visitor_ip: {
        type: DataTypes.INET,
        allowNull: true,
      },
      user_agent: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: 'product_clicks',
      timestamps: false,
    }
  );

  return ProductClick;
};

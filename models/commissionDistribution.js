// File: models/commissionDistribution.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const CommissionDistribution = sequelize.define(
    'CommissionDistribution',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      affiliate_product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      purchase_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      commission_amount: {
        type: DataTypes.NUMERIC(15, 2),
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'commission_distributions',
      timestamps: false,
    }
  );

  return CommissionDistribution;
};

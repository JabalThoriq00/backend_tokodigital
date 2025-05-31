// File: models/wallet.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Wallet = sequelize.define(
    'Wallet',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      balance: {
        type: DataTypes.NUMERIC(15, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'wallets',
      timestamps: false,
    }
  );

  return Wallet;
};

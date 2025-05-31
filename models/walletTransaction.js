// File: models/walletTransaction.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const WalletTransaction = sequelize.define(
    'WalletTransaction',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      wallet_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      amount: {
        type: DataTypes.NUMERIC(15, 2),
        allowNull: false, // >0 = kredit, <0 = debit
      },
      transaction_type: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      reference_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'wallet_transactions',
      timestamps: false,
    }
  );

  return WalletTransaction;
};

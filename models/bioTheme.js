// File: models/bioTheme.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const BioTheme = sequelize.define(
    'BioTheme',
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
      theme_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      config_json: {
        type: DataTypes.JSONB,
        allowNull: true,
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
      tableName: 'bio_themes',
      timestamps: false,
    }
  );

  return BioTheme;
};

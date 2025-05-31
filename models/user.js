// File: models/user.js
import { DataTypes } from 'sequelize';
import bcrypt from 'bcryptjs';

export default (sequelize) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        type: DataTypes.STRING(50),
        unique: true,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(255),
        unique: true,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      password_hash: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      full_name: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      avatar_url: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      bio: {
        type: DataTypes.TEXT,
        allowNull: true,
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
      tableName: 'users',
      timestamps: false,
    }
  );

  // Hook to hash password before creating
  User.beforeCreate(async (user) => {
    if (user.password_hash) {
      const salt = await bcrypt.genSalt(10);
      user.password_hash = await bcrypt.hash(user.password_hash, salt);
    }
  });

  // Hook to hash password before updating (if password field changed)
  User.beforeUpdate(async (user) => {
    if (user.changed('password_hash')) {
      const salt = await bcrypt.genSalt(10);
      user.password_hash = await bcrypt.hash(user.password_hash, salt);
    }
  });

  return User;
};

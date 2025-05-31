// File: models/index.js
import { Sequelize, DataTypes } from 'sequelize';
import 'dotenv/config';

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    port: process.env.DB_PORT || 5432,
    logging: false,
    define: { timestamps: false }
  }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import all models
db.User = (await import('./user.js')).default(sequelize);
db.BioTheme = (await import('./bioTheme.js')).default(sequelize);
db.BioLink = (await import('./bioLink.js')).default(sequelize);
db.Product = (await import('./product.js')).default(sequelize);
db.ProductView = (await import('./productView.js')).default(sequelize);
db.ProductClick = (await import('./productClick.js')).default(sequelize);
db.ProductPurchase = (await import('./productPurchase.js')).default(sequelize);
db.Wallet = (await import('./wallet.js')).default(sequelize);
db.WalletTransaction = (await import('./walletTransaction.js')).default(sequelize);
db.AffiliateProduct = (await import('./affiliateProduct.js')).default(sequelize);
db.CommissionDistribution = (await import('./commissionDistribution.js')).default(sequelize);

// Optional category/tag models
db.ProductCategory = (await import('./productCategory.js')).default(sequelize);
db.ProductToCategory = (await import('./productToCategory.js')).default(sequelize);
db.ProductTag = (await import('./productTag.js')).default(sequelize);
db.ProductToTag = (await import('./productToTag.js')).default(sequelize);

/*
  Define associations:
*/

// 1. User ↔ BioTheme (1:N)
db.User.hasMany(db.BioTheme, { foreignKey: 'user_id', as: 'themes' });
db.BioTheme.belongsTo(db.User, { foreignKey: 'user_id', as: 'user' });

// 2. User ↔ BioLink (1:N)
db.User.hasMany(db.BioLink, { foreignKey: 'user_id', as: 'links' });
db.BioLink.belongsTo(db.User, { foreignKey: 'user_id', as: 'user' });

// 3. User ↔ Product (1:N)
db.User.hasMany(db.Product, { foreignKey: 'user_id', as: 'products' });
db.Product.belongsTo(db.User, { foreignKey: 'user_id', as: 'seller' });

// 4. Product ↔ ProductView (1:N)
db.Product.hasMany(db.ProductView, { foreignKey: 'product_id', as: 'views' });
db.ProductView.belongsTo(db.Product, { foreignKey: 'product_id', as: 'product' });

// 5. Product ↔ ProductClick (1:N)
db.Product.hasMany(db.ProductClick, { foreignKey: 'product_id', as: 'clicks' });
db.ProductClick.belongsTo(db.Product, { foreignKey: 'product_id', as: 'product' });

// 6. Product ↔ ProductPurchase (1:N)
db.Product.hasMany(db.ProductPurchase, { foreignKey: 'product_id', as: 'purchases' });
db.ProductPurchase.belongsTo(db.Product, { foreignKey: 'product_id', as: 'product' });

// 7. User ↔ Wallet (1:1)
db.User.hasOne(db.Wallet, { foreignKey: 'user_id', as: 'wallet' });
db.Wallet.belongsTo(db.User, { foreignKey: 'user_id', as: 'user' });

// 8. Wallet ↔ WalletTransaction (1:N)
db.Wallet.hasMany(db.WalletTransaction, { foreignKey: 'wallet_id', as: 'transactions' });
db.WalletTransaction.belongsTo(db.Wallet, { foreignKey: 'wallet_id', as: 'wallet' });

// 9. Product ↔ AffiliateProduct (1:N)
db.Product.hasMany(db.AffiliateProduct, { foreignKey: 'product_id', as: 'affiliateLinks' });
db.AffiliateProduct.belongsTo(db.Product, { foreignKey: 'product_id', as: 'product' });

// 10. User ↔ AffiliateProduct (1:N) for affiliate_user_id
db.User.hasMany(db.AffiliateProduct, { foreignKey: 'affiliate_user_id', as: 'affiliateProducts' });
db.AffiliateProduct.belongsTo(db.User, { foreignKey: 'affiliate_user_id', as: 'affiliateUser' });

// 11. AffiliateProduct ↔ CommissionDistribution (1:N)
db.AffiliateProduct.hasMany(db.CommissionDistribution, { foreignKey: 'affiliate_product_id', as: 'commissions' });
db.CommissionDistribution.belongsTo(db.AffiliateProduct, { foreignKey: 'affiliate_product_id', as: 'affiliateProduct' });

// 12. ProductPurchase ↔ CommissionDistribution (1:N)
db.ProductPurchase.hasMany(db.CommissionDistribution, { foreignKey: 'purchase_id', as: 'commissionRecords' });
db.CommissionDistribution.belongsTo(db.ProductPurchase, { foreignKey: 'purchase_id', as: 'purchase' });

// 13. Optional: Product ↔ ProductCategory (M:N through ProductToCategory)
db.Product.belongsToMany(db.ProductCategory, {
  through: db.ProductToCategory,
  foreignKey: 'product_id',
  otherKey: 'category_id',
  as: 'categories'
});
db.ProductCategory.belongsToMany(db.Product, {
  through: db.ProductToCategory,
  foreignKey: 'category_id',
  otherKey: 'product_id',
  as: 'products'
});

// 14. Optional: Product ↔ ProductTag (M:N through ProductToTag)
db.Product.belongsToMany(db.ProductTag, {
  through: db.ProductToTag,
  foreignKey: 'product_id',
  otherKey: 'tag_id',
  as: 'tags'
});
db.ProductTag.belongsToMany(db.Product, {
  through: db.ProductToTag,
  foreignKey: 'tag_id',
  otherKey: 'product_id',
  as: 'products'
});

export default db;

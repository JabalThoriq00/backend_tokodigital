import db from '../models/index.js';
import { authenticate } from '../middleware/auth.js';

/**
 * @swagger
 * /api/products?action=my:
 *   get:
 *     summary: Mendapatkan daftar produk milik user yang terautentikasi lengkap dengan metrik
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar produk ditemukan
 */

/**
 * @swagger
 * /api/products?action=list:
 *   get:
 *     summary: Mendapatkan katalog produk publik (maksimal 50)
 *     tags:
 *       - Products
 *     responses:
 *       200:
 *         description: Daftar produk publik ditemukan
 */

/**
 * @swagger
 * /api/products?action=detail&id={id}:
 *   get:
 *     summary: Mendapatkan detail produk publik berdasarkan ID
 *     tags:
 *       - Products
 *     parameters:
 *       - name: id
 *         in: query
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detail produk ditemukan
 *       404:
 *         description: Produk tidak ditemukan
 */

/**
 * @swagger
 * /api/products?action=view:
 *   post:
 *     summary: Mencatat kunjungan produk
 *     tags:
 *       - Products
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - product_id
 *               - viewer_ip
 *               - user_agent
 *             properties:
 *               product_id:
 *                 type: integer
 *               viewer_ip:
 *                 type: string
 *               user_agent:
 *                 type: string
 *     responses:
 *       201:
 *         description: Kunjungan tercatat
 */

/**
 * @swagger
 * /api/products?action=click:
 *   post:
 *     summary: Mencatat klik produk
 *     tags:
 *       - Products
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - product_id
 *               - source_page
 *               - visitor_ip
 *               - user_agent
 *             properties:
 *               product_id:
 *                 type: integer
 *               source_page:
 *                 type: string
 *               visitor_ip:
 *                 type: string
 *               user_agent:
 *                 type: string
 *     responses:
 *       201:
 *         description: Klik tercatat
 */

/**
 * @swagger
 * /api/products?action=purchase:
 *   post:
 *     summary: Mencatat pembelian produk
 *     tags:
 *       - Products
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - product_id
 *               - buyer_user_id
 *               - buyer_email
 *               - purchase_price
 *               - download_url
 *             properties:
 *               product_id:
 *                 type: integer
 *               buyer_user_id:
 *                 type: integer
 *               buyer_email:
 *                 type: string
 *               purchase_price:
 *                 type: number
 *               download_url:
 *                 type: string
 *     responses:
 *       201:
 *         description: Pembelian berhasil dicatat
 */

/**
 * @swagger
 * /api/products?action=my-purchases:
 *   get:
 *     summary: Mendapatkan daftar pembelian produk oleh user
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar pembelian ditemukan
 */


export default async function handler(req, res) {
  const { method } = req;
  const action = req.query.action; // 'list', 'detail', 'view', 'click', 'purchase', 'my', 'my-purchases'

  try {
    if (action === 'my') {
      // Produk milik user + metrik
      authenticate(req, res, async () => {
        const products = await db.Product.findAll({
          where: { user_id: req.user.id, is_active: true },
          include: [
            { model: db.ProductView, as: 'views', attributes: [] },
            { model: db.ProductClick, as: 'clicks', attributes: [] },
            {
              model: db.ProductPurchase,
              as: 'purchases',
              where: { status: 'completed' },
              required: false,
              attributes: []
            }
          ],
          attributes: [
            'id',
            'title',
            'description',
            'price',
            'file_url',
            'thumbnail_url',
            'is_active',
            'created_at',
            [db.Sequelize.fn('COUNT', db.Sequelize.col('views.id')), 'total_views'],
            [db.Sequelize.fn('COUNT', db.Sequelize.col('clicks.id')), 'total_clicks'],
            [
              db.Sequelize.fn('COUNT', db.Sequelize.col('purchases.id')),
              'total_purchases'
            ]
          ],
          group: ['Product.id'],
          order: [['created_at', 'DESC']]
        });
        return res.status(200).json({ data: products });
      });

    } else if (action === 'list') {
      // Katalog publik (limit 50)
      const products = await db.Product.findAll({
        where: { is_active: true },
        include: [
          { model: db.User, as: 'seller', attributes: ['username', 'avatar_url'] }
        ],
        order: [['created_at', 'DESC']],
        limit: 50
      });
      return res.status(200).json({ data: products });

    } else if (action === 'detail') {
      // GET /api/products?action=detail&id=123
      const { id } = req.query;
      const product = await db.Product.findOne({
        where: { id },
        include: [
          { model: db.User, as: 'seller', attributes: ['username', 'avatar_url'] },
          { model: db.ProductView, as: 'views', attributes: [] },
          { model: db.ProductClick, as: 'clicks', attributes: [] },
          {
            model: db.ProductPurchase,
            as: 'purchases',
            where: { status: 'completed' },
            required: false,
            attributes: []
          }
        ],
        attributes: [
          'id',
          'title',
          'description',
          'price',
          'file_url',
          'thumbnail_url',
          'is_active',
          'created_at',
          [db.Sequelize.fn('COUNT', db.Sequelize.col('views.id')), 'total_views'],
          [db.Sequelize.fn('COUNT', db.Sequelize.col('clicks.id')), 'total_clicks'],
          [
            db.Sequelize.fn('COUNT', db.Sequelize.col('purchases.id')),
            'total_purchases'
          ]
        ],
        group: ['Product.id', 'seller.id']
      });
      if (!product) {
        return res.status(404).json({ message: 'Produk tidak ditemukan' });
      }
      return res.status(200).json({ data: product });

    } else if (action === 'view') {
      // POST /api/products?action=view  { product_id, viewer_ip, user_agent }
      const { product_id, viewer_ip, user_agent } = req.body;
      await db.ProductView.create({ product_id, viewer_ip, user_agent });
      return res.status(201).json({ message: 'Product view tercatat' });

    } else if (action === 'click') {
      // POST /api/products?action=click  { product_id, source_page, visitor_ip, user_agent }
      const { product_id, source_page, visitor_ip, user_agent } = req.body;
      await db.ProductClick.create({ product_id, source_page, visitor_ip, user_agent });
      return res.status(201).json({ message: 'Product click tercatat' });

    } else if (action === 'purchase') {
      // POST /api/products?action=purchase  { product_id, buyer_user_id, buyer_email, purchase_price, download_url }
      const { product_id, buyer_user_id, buyer_email, purchase_price, download_url } = req.body;
      const purchase = await db.ProductPurchase.create({
        product_id,
        buyer_user_id,
        buyer_email,
        purchase_price,
        download_url,
        status: 'completed'
      });

      // Credit seller wallet + bagi komisi affiliate
      const product = await db.Product.findByPk(product_id);

      // Update wallet penjual
      const sellerWallet = await db.Wallet.findOne({ where: { user_id: product.user_id } });
      await db.WalletTransaction.create({
        wallet_id: sellerWallet.id,
        amount: parseFloat(purchase_price),
        transaction_type: 'purchase_income',
        reference_id: purchase.id,
        description: `Income from product ${product_id}`
      });
      await sellerWallet.increment('balance', { by: parseFloat(purchase_price) });

      // Proses affiliate
      const affiliates = await db.AffiliateProduct.findAll({
        where: { product_id, is_active: true }
      });
      for (const ap of affiliates) {
        const commission = parseFloat(purchase_price) * parseFloat(ap.commission_rate) / 100;
        const commissionRecord = await db.CommissionDistribution.create({
          affiliate_product_id: ap.id,
          purchase_id: purchase.id,
          commission_amount: commission
        });
        const affWallet = await db.Wallet.findOne({
          where: { user_id: ap.affiliate_user_id }
        });
        await db.WalletTransaction.create({
          wallet_id: affWallet.id,
          amount: commission,
          transaction_type: 'affiliate_commission',
          reference_id: commissionRecord.id,
          description: `Commission for purchase ${purchase.id}`
        });
        await affWallet.increment('balance', { by: commission });
      }

      return res.status(201).json({ message: 'Pembelian tercatat', data: purchase });

    } else if (action === 'my-purchases') {
      // GET /api/products?action=my-purchases untuk pembeli terdaftar
      authenticate(req, res, async () => {
        const purchases = await db.ProductPurchase.findAll({
          where: { buyer_user_id: req.user.id }
        });
        return res.status(200).json({ data: purchases });
      });

    } else {
      return res.status(400).json({ message: 'Action produk tidak valid' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

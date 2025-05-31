import db from '../models/index.js';
import { authenticate } from '../middleware/auth.js';

/**
 * @swagger
 * /api/affiliate?action=my:
 *   get:
 *     summary: Mendapatkan daftar produk affiliate milik user
 *     tags:
 *       - Affiliate
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar affiliate product user
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/affiliate?action=toggle:
 *   post:
 *     summary: Tambah atau update affiliate product milik user
 *     tags:
 *       - Affiliate
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - product_id
 *               - commission_rate
 *             properties:
 *               product_id:
 *                 type: integer
 *               commission_rate:
 *                 type: number
 *               is_active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Affiliate product diupdate
 *       201:
 *         description: Affiliate product dibuat
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/affiliate?action=list:
 *   get:
 *     summary: Mendapatkan daftar affiliate untuk produk tertentu
 *     tags:
 *       - Affiliate
 *     parameters:
 *       - name: product_id
 *         in: query
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Daftar affiliate aktif untuk produk
 *       400:
 *         description: Request tidak valid
 */


export default async function handler(req, res) {
  const { method } = req;
  const action = req.query.action; // 'list', 'my', 'toggle'

  try {
    if (action === 'my') {
      // GET /api/affiliate?action=my
      authenticate(req, res, async () => {
        const affiliates = await db.AffiliateProduct.findAll({
          where: { affiliate_user_id: req.user.id },
          include: [
            { model: db.Product, as: 'product', attributes: ['title', 'price'] }
          ]
        });
        return res.status(200).json({ data: affiliates });
      });

    } else if (action === 'toggle') {
      // POST /api/affiliate?action=toggle { product_id, commission_rate, is_active }
      authenticate(req, res, async () => {
        const { product_id, commission_rate, is_active } = req.body;
        let ap = await db.AffiliateProduct.findOne({
          where: { product_id, affiliate_user_id: req.user.id }
        });
        if (ap) {
          // Update existing
          ap.commission_rate =
            commission_rate !== undefined ? commission_rate : ap.commission_rate;
          ap.is_active = is_active !== undefined ? is_active : ap.is_active;
          ap.updated_at = new Date();
          await ap.save();
          return res
            .status(200)
            .json({ message: 'Affiliate product diupdate', data: ap });
        } else {
          // Create baru
          const newAP = await db.AffiliateProduct.create({
            product_id,
            affiliate_user_id: req.user.id,
            commission_rate,
            is_active: true
          });
          return res
            .status(201)
            .json({ message: 'Affiliate product dibuat', data: newAP });
        }
      });

    } else if (action === 'list') {
      // GET /api/affiliate?action=list&product_id=123
      const { product_id } = req.query;
      const affiliates = await db.AffiliateProduct.findAll({
        where: { product_id, is_active: true },
        include: [
          { model: db.User, as: 'affiliateUser', attributes: ['username'] }
        ]
      });
      return res.status(200).json({ data: affiliates });

    } else {
      return res.status(400).json({ message: 'Action affiliate tidak valid' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

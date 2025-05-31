import db from '../models/index.js';
import { authenticate } from '../middleware/auth.js';

/**
 * @swagger
 * /api/wallet?action=balance:
 *   get:
 *     summary: Mendapatkan informasi saldo wallet user yang terautentikasi
 *     tags:
 *       - Wallet
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Informasi saldo berhasil diambil
 *       404:
 *         description: Wallet tidak ditemukan
 */

/**
 * @swagger
 * /api/wallet?action=transactions:
 *   get:
 *     summary: Mendapatkan daftar transaksi wallet user
 *     tags:
 *       - Wallet
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar transaksi berhasil diambil
 */

/**
 * @swagger
 * /api/wallet?action=withdraw:
 *   post:
 *     summary: Melakukan penarikan dana dari wallet user
 *     tags:
 *       - Wallet
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - description
 *             properties:
 *               amount:
 *                 type: number
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Penarikan tercatat
 *       400:
 *         description: Saldo tidak mencukupi
 *       404:
 *         description: Wallet tidak ditemukan
 */

/**
 * @swagger
 * /api/wallet?action=topup:
 *   post:
 *     summary: Melakukan top-up ke wallet user
 *     tags:
 *       - Wallet
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - description
 *             properties:
 *               amount:
 *                 type: number
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Top-up tercatat
 *       404:
 *         description: Wallet tidak ditemukan
 */


export default async function handler(req, res) {
  const { method } = req;
  const action = req.query.action; // 'balance', 'transactions', 'withdraw', 'topup'

  try {
    if (action === 'balance') {
      // GET /api/wallet?action=balance
      authenticate(req, res, async () => {
        const wallet = await db.Wallet.findOne({
          where: { user_id: req.user.id }
        });
        if (!wallet) {
          return res.status(404).json({ message: 'Wallet tidak ditemukan' });
        }
        return res.status(200).json({ data: wallet });
      });

    } else if (action === 'transactions') {
      // GET /api/wallet?action=transactions
      authenticate(req, res, async () => {
        const transactions = await db.WalletTransaction.findAll({
          include: [
            {
              model: db.Wallet,
              as: 'wallet',
              where: { user_id: req.user.id },
              attributes: []
            }
          ],
          order: [['created_at', 'DESC']]
        });
        return res.status(200).json({ data: transactions });
      });

    } else if (action === 'withdraw') {
      // POST /api/wallet?action=withdraw { amount, description }
      authenticate(req, res, async () => {
        const { amount, description } = req.body;
        const wallet = await db.Wallet.findOne({
          where: { user_id: req.user.id }
        });
        if (!wallet) {
          return res.status(404).json({ message: 'Wallet tidak ditemukan' });
        }
        if (parseFloat(wallet.balance) < parseFloat(amount)) {
          return res.status(400).json({ message: 'Saldo tidak mencukupi' });
        }
        const trans = await db.WalletTransaction.create({
          wallet_id: wallet.id,
          amount: -Math.abs(parseFloat(amount)),
          transaction_type: 'withdrawal',
          description
        });
        await wallet.decrement('balance', { by: parseFloat(amount) });
        return res.status(201).json({ message: 'Withdrawal tercatat', data: trans });
      });

    } else if (action === 'topup') {
      // POST /api/wallet?action=topup { amount, description }
      authenticate(req, res, async () => {
        const { amount, description } = req.body;
        const wallet = await db.Wallet.findOne({
          where: { user_id: req.user.id }
        });
        if (!wallet) {
          return res.status(404).json({ message: 'Wallet tidak ditemukan' });
        }
        const trans = await db.WalletTransaction.create({
          wallet_id: wallet.id,
          amount: Math.abs(parseFloat(amount)),
          transaction_type: 'topup',
          description
        });
        await wallet.increment('balance', { by: parseFloat(amount) });
        return res.status(201).json({ message: 'Top-up tercatat', data: trans });
      });

    } else {
      return res.status(400).json({ message: 'Action wallet tidak valid' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

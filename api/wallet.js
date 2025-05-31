import db from '../models/index.js';
import { authenticate } from '../middleware/auth.js';

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

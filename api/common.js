import db from '../models/index.js';

export default async function handler(req, res) {
  try {
    await db.sequelize.sync({ alter: true });
    return res.status(200).json({ message: 'Database tersinkronisasi' });
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Gagal sinkronisasi DB', error: err.message });
  }
}

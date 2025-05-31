import db from '../models/index.js';
import { authenticate } from '../middleware/auth.js';

export default async function handler(req, res) {
  const { method } = req;
  const route = req.query.route; // 'theme', 'link', atau 'public'

  try {
    if (route === 'theme') {
      if (method === 'GET') {
        // Publik: GET /api/bio?route=theme&username=john_doe
        const { username } = req.query;
        const user = await db.User.findOne({
          where: { username },
          attributes: ['id', 'username', 'full_name', 'avatar_url', 'bio']
        });
        if (!user) {
          return res.status(404).json({ message: 'User tidak ditemukan' });
        }
        const theme = await db.BioTheme.findOne({
          where: { user_id: user.id, is_active: true }
        });
        return res.status(200).json({ data: { user, theme } });

      } else if (method === 'POST') {
        // Terautentikasi: POST /api/bio?route=theme
        authenticate(req, res, async () => {
          const { theme_name, config_json } = req.body;
          // Nonaktifkan tema aktif sebelumnya
          await db.BioTheme.update(
            { is_active: false },
            { where: { user_id: req.user.id, is_active: true } }
          );
          const newTheme = await db.BioTheme.create({
            user_id: req.user.id,
            theme_name,
            config_json,
            is_active: true
          });
          return res.status(201).json({
            message: 'Tema bio disimpan',
            data: newTheme
          });
        });

      } else {
        return res
          .status(405)
          .json({ message: `Metode ${method} tidak diijinkan di /api/bio?route=theme` });
      }

    } else if (route === 'link') {
      if (method === 'GET') {
        // Publik: GET /api/bio?route=link&username=john_doe
        const { username } = req.query;
        const user = await db.User.findOne({ where: { username } });
        if (!user) {
          return res.status(404).json({ message: 'User tidak ditemukan' });
        }
        const links = await db.BioLink.findAll({
          where: { user_id: user.id, is_active: true },
          order: [
            ['sort_order', 'ASC'],
            ['created_at', 'ASC']
          ]
        });
        return res.status(200).json({ data: links });

      } else if (method === 'POST') {
        // Terautentikasi: POST /api/bio?route=link
        authenticate(req, res, async () => {
          const { title, url, thumbnail, sort_order } = req.body;
          if (!title || !url) {
            return res.status(400).json({ message: 'Title dan URL wajib diisi' });
          }
          const count = await db.BioLink.count({ where: { user_id: req.user.id } });
          const pos = sort_order !== undefined ? sort_order : count + 1;
          const newLink = await db.BioLink.create({
            user_id: req.user.id,
            title,
            url,
            thumbnail,
            sort_order: pos,
            is_active: true
          });
          return res.status(201).json({
            message: 'Link bio dibuat',
            data: newLink
          });
        });

      } else if (method === 'PUT') {
        // Terautentikasi: PUT /api/bio?route=link&id=123
        authenticate(req, res, async () => {
          const { id } = req.query;
          const link = await db.BioLink.findOne({
            where: { id, user_id: req.user.id }
          });
          if (!link) {
            return res.status(404).json({ message: 'Link tidak ditemukan' });
          }
          const { title, url, thumbnail, sort_order, is_active } = req.body;
          link.title = title !== undefined ? title : link.title;
          link.url = url !== undefined ? url : link.url;
          link.thumbnail = thumbnail !== undefined ? thumbnail : link.thumbnail;
          link.sort_order = sort_order !== undefined ? sort_order : link.sort_order;
          link.is_active = is_active !== undefined ? is_active : link.is_active;
          link.updated_at = new Date();
          await link.save();
          return res.status(200).json({
            message: 'Link bio diupdate',
            data: link
          });
        });

      } else {
        return res
          .status(405)
          .json({ message: `Metode ${method} tidak diijinkan di /api/bio?route=link` });
      }

    } else if (route === 'public') {
      // Publik: GET /api/bio?route=public&username=john_doe
      if (method !== 'GET') {
        return res
          .status(405)
          .json({ message: `Metode ${method} tidak diijinkan di /api/bio?route=public` });
      }
      const { username } = req.query;
      const user = await db.User.findOne({
        where: { username },
        attributes: ['id', 'username', 'full_name', 'avatar_url', 'bio']
      });
      if (!user) {
        return res.status(404).json({ message: 'User tidak ditemukan' });
      }
      const theme = await db.BioTheme.findOne({
        where: { user_id: user.id, is_active: true }
      });
      const links = await db.BioLink.findAll({
        where: { user_id: user.id, is_active: true },
        order: [
          ['sort_order', 'ASC'],
          ['created_at', 'ASC']
        ]
      });
      return res.status(200).json({ data: { profile: user, theme, links } });

    } else {
      return res.status(400).json({ message: 'Route bio tidak valid' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

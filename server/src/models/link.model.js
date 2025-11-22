import { pool } from "../../db.js";

export const LinkModel = {
  async create(code, url) {
    await pool.query(
      "INSERT INTO links (code, target_url) VALUES ($1, $2)",
      [code, url]
    );
  },

  async findAll() {
    const res = await pool.query("SELECT * FROM links ORDER BY created_at DESC");
    return res.rows;
  },

  async findByCode(code) {
    const res = await pool.query("SELECT * FROM links WHERE code = $1", [code]);
    return res.rows[0];
  },

  async delete(code) {
    await pool.query("DELETE FROM links WHERE code = $1", [code]);
  },

  async incrementClicks(code) {
    await pool.query(
      "UPDATE links SET total_clicks = total_clicks + 1, last_clicked_at = NOW() WHERE code = $1",
      [code]
    );
  },
};

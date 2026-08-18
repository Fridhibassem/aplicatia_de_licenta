/**
 * VetCare DB Adapter – MySQL
 *
 * Expune metode generice (findOne / findAll / insert / update / delete)
 * peste pool-ul mysql2, ca sa pastram codul controllerelor curat.
 */

require('dotenv').config();

class MySQLAdapter {
  constructor() {
    const mysql = require('mysql2/promise');
    this.pool = mysql.createPool({
      host:     process.env.DB_HOST || 'localhost',
      port:     process.env.DB_PORT || 3306,
      database: process.env.DB_NAME || 'vetcare',
      user:     process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
      waitForConnections: true,
      connectionLimit: 10
    });
    console.log(`[DB] MySQL conectat → ${process.env.DB_NAME || 'vetcare'}`);
  }

  async findOne(collection, predicate) {
    const entries = Object.entries(predicate);
    const where   = entries.map(([k]) => `\`${k}\` = ?`).join(' AND ');
    const values  = entries.map(([, v]) => v);
    const [rows]  = await this.pool.query(
      `SELECT * FROM \`${collection}\` WHERE ${where} LIMIT 1`,
      values
    );
    return rows[0] || null;
  }

  async findAll(collection, predicate = {}) {
    const entries = Object.entries(predicate);
    if (!entries.length) {
      const [rows] = await this.pool.query(`SELECT * FROM \`${collection}\``);
      return rows;
    }
    const where  = entries.map(([k]) => `\`${k}\` = ?`).join(' AND ');
    const values = entries.map(([, v]) => v);
    const [rows] = await this.pool.query(
      `SELECT * FROM \`${collection}\` WHERE ${where}`,
      values
    );
    return rows;
  }

  async insert(collection, obj) {
    const keys    = Object.keys(obj).map(k => `\`${k}\``).join(', ');
    const placeh  = Object.keys(obj).map(() => '?').join(', ');
    const values  = Object.values(obj);
    await this.pool.query(
      `INSERT INTO \`${collection}\` (${keys}) VALUES (${placeh})`,
      values
    );
    return obj;
  }

  async update(collection, predicate, changes) {
    const set    = Object.keys(changes).map(k => `\`${k}\` = ?`).join(', ');
    const where  = Object.keys(predicate).map(k => `\`${k}\` = ?`).join(' AND ');
    const values = [...Object.values(changes), ...Object.values(predicate)];
    await this.pool.query(
      `UPDATE \`${collection}\` SET ${set} WHERE ${where}`,
      values
    );
    return this.findOne(collection, predicate);
  }

  async delete(collection, predicate) {
    const where  = Object.keys(predicate).map(k => `\`${k}\` = ?`).join(' AND ');
    const values = Object.values(predicate);
    await this.pool.query(
      `DELETE FROM \`${collection}\` WHERE ${where}`,
      values
    );
    return true;
  }
}

module.exports = new MySQLAdapter();

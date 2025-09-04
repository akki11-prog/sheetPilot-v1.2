import { query, pool } from "./config/db.config.js";

try {
  const res = await query("SELECT NOW()");
  console.log("DB time is:", res.rows[0]);
} catch (err) {
  console.error("DB connection failed:", err);
} finally {
  await pool.end();
}

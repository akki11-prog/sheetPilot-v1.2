import bcrypt from "bcryptjs";
import { EncryptJWT, jwtDecrypt } from "jose";
import { query } from "../config/db.config.js";

// 32+ byte key for A256GCM
const secretKey = new TextEncoder().encode(
  process.env.JWT_SECRET || "dev_secret_key_32_bytes_minimum__change_me__"
);

const EXPIRES = process.env.JWT_EXPIRES_IN || "1h";

/**
 * Create/Register a local user
 */
export async function registerService({ email, password }) {
  // basic guard (you can swap with zod later)
  if (!email || !password) {
    const err = new Error("Email and password are required");
    err.status = 400;
    throw err;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  try {
    const sql = `
      INSERT INTO sp_users (email, password, auth_type, is_pro, active)
      VALUES ($1, $2, 'local', false, true)
    `;
    await query(sql, [email, passwordHash]);

    return { ok: true, message: "User registered" };
  } catch (err) {
    // 23505 = unique_violation (email already exists)
    if (err.code === "23505") {
      const e = new Error("Email already in use");
      e.status = 409;
      throw e;
    }
    throw err;
  }
}

/**
 * Login local user
 */
export async function loginService({ email, password }) {
  if (!email || !password) {
    const err = new Error("Email and password are required");
    err.status = 400;
    throw err;
  }

  const sql = `
    SELECT user_id, email, password, is_pro, active
    FROM sp_users
    WHERE email = $1 AND auth_type = 'local' AND active = true
    LIMIT 1
  `;
  const { rows } = await query(sql, [email]);
  if (!rows.length) {
    const err = new Error("Invalid credentials");
    err.status = 401;
    throw err;
  }

  const user = rows[0];
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    const err = new Error("Invalid credentials");
    err.status = 401;
    throw err;
  }

  const token = await new EncryptJWT({
    uid: user.user_id,
    email: user.email,
    typ: "access",
  })
    .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
    .setIssuedAt()
    .setExpirationTime(EXPIRES)
    .encrypt(secretKey);

  delete user.password;
  return { ok: true, message: "Login success", user, token };
}

/**
 * Verify a JWE and return its payload
 */
export async function verifyTokenService(token) {
  const { payload } = await jwtDecrypt(token, secretKey);
  return payload; // { uid, email, typ, iat, exp }
}

import { verifyTokenService } from "../services/auth.services.js";

const COOKIE_NAME = process.env.JWT_COOKIE_NAME || "sp_at";

const authenticate = async (req, res, next) => {
  try {
    // 1) Prefer cookie
    const cookieToken = req.cookies?.[COOKIE_NAME];

    // 2) Fallback to Authorization header if present
    const header = req.headers.authorization || "";
    const headerToken = header.startsWith("Bearer ") ? header.slice(7) : null;

    const token = cookieToken || headerToken;
    if (!token) return res.status(401).json({ message: "No token provided" });

    const payload = await verifyTokenService(token); // decrypt JWE
    req.user = { id: payload.uid, token };
    next();
  } catch (_err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default authenticate;

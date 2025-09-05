import asyncHandler from "../middleware/asyncHandler.js";
import { registerService, loginService } from "../services/auth.services.js";

const cookieName = process.env.JWT_COOKIE_NAME || "sp_at";
const isProd = process.env.NODE_ENV === "production";

// Common cookie options
const cookieOpts = {
    httpOnly: true,           // JS can't read it
    secure: isProd,           // HTTPS only in prod
    sameSite: isProd ? "none" : "lax", // "none" if using cross-site cookies
    path: "/",                // send cookie to all routes
    // maxAge will be set per-response if you want absolute expiry
};

export const register = asyncHandler(async (req, res) => {
    const result = await registerService(req.body);

    res.status(201).json({ where: "Auth.Controller.register", ok: true, user: result.user, message: "User registered" });
});

export const login = asyncHandler(async (req, res) => {
    const result = await loginService(req.body);
    const monthMs = 1000 * 60 * 60 * 24 * 30;

    res.cookie(cookieName, result.token, {
        ...cookieOpts,
        maxAge: monthMs   // cookie expires in 30 days
    });

    res.json({ where: "Auth.Controller.login", ok: true, user: result.user, message: "Login success", token: result.token });
});

export const logout = asyncHandler(async (_req, res) => {
    // Invalidate cookie by expiring it
    res.clearCookie(cookieName, { ...cookieOpts, maxAge: 0 });
    res.json({ where: "Auth.Controller.logout", ok: true, message: "Logged out" });
});

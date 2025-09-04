import asyncHandler from "../middleware/asyncHandler.js";

export const register = asyncHandler(async (req, res) => {
  res.status(201).json({ where: "AuthController.register", ok: true, token: "dev-token", body: req.body });
});

export const login = asyncHandler(async (req, res) => {
  res.json({ where: "AuthController.login", ok: true, token: "dev-token", body: req.body });
});

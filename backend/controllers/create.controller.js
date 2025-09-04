import asyncHandler from "../middleware/asyncHandler.js";

export const createTable  = asyncHandler(async (req, res) => res.status(201).json({ where: "CreateController.createTable",  ok: true, user: req.user, body: req.body }));
export const createView   = asyncHandler(async (req, res) => res.status(201).json({ where: "CreateController.createView",   ok: true, user: req.user, body: req.body }));
export const createReport = asyncHandler(async (req, res) => res.status(201).json({ where: "CreateController.createReport", ok: true, user: req.user, body: req.body }));
export const createChart  = asyncHandler(async (req, res) => res.status(201).json({ where: "CreateController.createChart",  ok: true, user: req.user, body: req.body }));

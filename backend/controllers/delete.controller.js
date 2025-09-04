import asyncHandler from "../middleware/asyncHandler.js";

export const deleteTable  = asyncHandler(async (req, res) => res.json({ where: "DeleteController.deleteTable",  ok: true, user: req.user, id: req.params.id }));
export const deleteView   = asyncHandler(async (req, res) => res.json({ where: "DeleteController.deleteView",   ok: true, user: req.user, id: req.params.id }));
export const deleteReport = asyncHandler(async (req, res) => res.json({ where: "DeleteController.deleteReport", ok: true, user: req.user, id: req.params.id }));
export const deleteChart  = asyncHandler(async (req, res) => res.json({ where: "DeleteController.deleteChart",  ok: true, user: req.user, id: req.params.id }));

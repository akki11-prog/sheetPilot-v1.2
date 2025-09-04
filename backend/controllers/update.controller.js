import asyncHandler from "../middleware/asyncHandler.js";

export const updateTable  = asyncHandler(async (req, res) => res.json({ where: "UpdateController.updateTable",  ok: true, user: req.user, id: req.params.id, patch: req.body }));
export const updateView   = asyncHandler(async (req, res) => res.json({ where: "UpdateController.updateView",   ok: true, user: req.user, id: req.params.id, patch: req.body }));
export const updateReport = asyncHandler(async (req, res) => res.json({ where: "UpdateController.updateReport", ok: true, user: req.user, id: req.params.id, patch: req.body }));
export const updateChart  = asyncHandler(async (req, res) => res.json({ where: "UpdateController.updateChart",  ok: true, user: req.user, id: req.params.id, patch: req.body }));

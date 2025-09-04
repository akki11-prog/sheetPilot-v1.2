import asyncHandler from "../middleware/asyncHandler.js";

export const listTables   = asyncHandler(async (req, res) => res.json({ where: "RetrieveController.listTables",   ok: true, user: req.user, data: [] }));
export const getTable     = asyncHandler(async (req, res) => res.json({ where: "RetrieveController.getTable",     ok: true, user: req.user, id: req.params.id }));

export const listViews    = asyncHandler(async (req, res) => res.json({ where: "RetrieveController.listViews",    ok: true, user: req.user, data: [] }));
export const getView      = asyncHandler(async (req, res) => res.json({ where: "RetrieveController.getView",      ok: true, user: req.user, id: req.params.id }));

export const listReports  = asyncHandler(async (req, res) => res.json({ where: "RetrieveController.listReports",  ok: true, user: req.user, data: [] }));
export const getReport    = asyncHandler(async (req, res) => res.json({ where: "RetrieveController.getReport",    ok: true, user: req.user, id: req.params.id }));

export const listCharts   = asyncHandler(async (req, res) => res.json({ where: "RetrieveController.listCharts",   ok: true, user: req.user, data: [] }));
export const getChart     = asyncHandler(async (req, res) => res.json({ where: "RetrieveController.getChart",     ok: true, user: req.user, id: req.params.id }));

import { Router } from "express";
import authenticate from "../middleware/authenticate.js";
import {
  listTables,  getTable,
  listViews,   getView,
  listReports, getReport,
  listCharts,  getChart
} from "../controllers/retrive.controller.js";

const router = Router();
router.get("/tables",      authenticate, listTables);
router.get("/tables/:id",  authenticate, getTable);

router.get("/views",       authenticate, listViews);
router.get("/views/:id",   authenticate, getView);

router.get("/reports",     authenticate, listReports);
router.get("/reports/:id", authenticate, getReport);

router.get("/charts",      authenticate, listCharts);
router.get("/charts/:id",  authenticate, getChart);

export default router;

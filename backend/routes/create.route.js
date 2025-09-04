import { Router } from "express";
import authenticate from "../middleware/authenticate.js";
import { createTable, createView, createReport, createChart } from "../controllers/create.controller.js";

const router = Router();
router.post("/tables",  authenticate, createTable);
router.post("/views",   authenticate, createView);
router.post("/reports", authenticate, createReport);
router.post("/charts",  authenticate, createChart);
export default router;

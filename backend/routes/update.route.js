import { Router } from "express";
import authenticate from "../middleware/authenticate.js";
import { updateTable, updateView, updateReport, updateChart } from "../controllers/update.controller.js";

const router = Router();
router.patch("/tables/:id",  authenticate, updateTable);
router.patch("/views/:id",   authenticate, updateView);
router.patch("/reports/:id", authenticate, updateReport);
router.patch("/charts/:id",  authenticate, updateChart);
export default router;

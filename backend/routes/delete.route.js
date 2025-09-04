import { Router } from "express";
import authenticate from "../middleware/authenticate.js";
import { deleteTable, deleteView, deleteReport, deleteChart } from "../controllers/delete.controller.js";

const router = Router();
router.delete("/tables/:id",  authenticate, deleteTable);
router.delete("/views/:id",   authenticate, deleteView);
router.delete("/reports/:id", authenticate, deleteReport);
router.delete("/charts/:id",  authenticate, deleteChart);
export default router;

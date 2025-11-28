import express from "express";
import { getDataMonitor, getDataMonitorHistory, getDataRencanaKerja } from "../controllers/monitorController.js";

const monitorRoutes= express.Router();

monitorRoutes.get('/', getDataMonitor);
monitorRoutes.get('/:monitorId', getDataMonitorHistory);
monitorRoutes.get('/:monitorId/rencana', getDataRencanaKerja);
export default monitorRoutes;
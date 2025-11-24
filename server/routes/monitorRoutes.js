import express from "express";
import { getDataMonitor, getDataMonitorHistory } from "../controllers/monitorController.js";

const monitorRoutes= express.Router();

monitorRoutes.get('/', getDataMonitor);
monitorRoutes.get('/:monitorId', getDataMonitorHistory);
export default monitorRoutes;
import express from "express";
import { getDataMonitor } from "../controllers/monitorController.js";

const monitorRoutes= express.Router();

monitorRoutes.get('/', getDataMonitor);

export default monitorRoutes;
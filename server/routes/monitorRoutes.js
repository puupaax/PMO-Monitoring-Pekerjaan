import express from "express";
import { getDataMonitor } from "../controllers/monitorController";

const monitorRoutes= express.Router();

monitorRoutes.get('/', getDataMonitor);

export default monitorRoutes;
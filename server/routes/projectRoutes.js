import express from "express";
import multer from "multer";
import {createProject, deleteMonitor, updateProject, previewExcel } from "../controllers/projectController.js";

const projectRouter= express.Router();
const upload = multer({ storage: multer.memoryStorage() });

projectRouter.post(
  "/",
  upload.single("rencana_kerja"),
  createProject
);
projectRouter.put('/', updateProject)
projectRouter.delete('/:monitorId', deleteMonitor)
projectRouter.post(
  "/api/monitoring/preview-excel",
  upload.single("rencana_kerja"),
  previewExcel
);



export default projectRouter;
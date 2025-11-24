import express from "express";
import {createProject, deleteMonitor, updateProject } from "../controllers/projectController.js";

const projectRouter= express.Router();

projectRouter.post('/', createProject)
projectRouter.put('/', updateProject)
projectRouter.delete('/:monitorId', deleteMonitor)
//projectRouter.post('/:projectId/addMember', addMember)

export default projectRouter;
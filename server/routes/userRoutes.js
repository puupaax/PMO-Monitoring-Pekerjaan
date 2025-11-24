import { Router } from "express";
import { fetchUsers, updateUserRole, getMe } from "../controllers/userController.js";
import { requireAuth } from "@clerk/express";

const router = Router();

router.get("/me", requireAuth(), getMe);
router.get("/", requireAuth(), fetchUsers);
router.put("/:id/role", requireAuth(), updateUserRole);

export default router;

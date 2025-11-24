import prisma from "../config/prisma.js";

export const fetchUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            orderBy: { createdAt: "desc" }
        });

        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Failed to fetch users" });
    }
};

export const updateUserRole = async (req, res) => {
    try {
        const requesterId = req.auth.userId; // user yg lagi login via Clerk
        const targetId = req.params.id;
        const { role } = req.body;

        // 1. CEK USER YG LOGIN
        const requester = await prisma.user.findUnique({
            where: { id: requesterId }
        });

        if (!requester) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // 2. HARUS ADMIN
        if (requester.role !== "ADMIN") {
            return res.status(403).json({ message: "Forbidden: Only admin can update role" });
        }

        // 3. UPDATE ROLE
        const updated = await prisma.user.update({
            where: { id: targetId },
            data: { role }
        });

        res.status(200).json(updated);

    } catch (error) {
        console.error("Error updating user role:", error);
        res.status(500).json({ message: "Failed to update role" });
    }
};

export const getMe = async (req, res) => {
    try {
        const userId = req.auth?.userId;

        const user = await prisma.user.findUnique({
            where: { id: userId }
        });


        return res.status(200).json(user);
    } catch (error) {
        console.error("Error getMe:", error);
        res.status(500).json({ message: "Failed to fetch current user" });
    }
};




import prisma from "../config/prisma.js";

export const requireRole = (role) => {
    return async (req, res, next) => {
        try {
            const userId = req.auth.userId;
            
            const user = await prisma.user.findUnique({
                where: { id: userId }
            });

            if (!user) return res.status(401).json({ message: "User not found" });

            if (user.role !== role) {
                return res.status(403).json({ message: "Forbidden" });
            }

            next();
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
    };
};

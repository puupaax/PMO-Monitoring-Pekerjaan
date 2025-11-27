import prisma from "../config/prisma.js";

export const getDataMonitor = async (req, res) => {
    try {
        const { userId } = await req.auth();
        
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        let filter = {};

        if (user.role !== "ADMIN") {

            const historyMonitor = await prisma.monitoringHistory.findMany({
                where: { team_lead: userId },
                select: { monitoring_id: true }
            });

            const monitorId = historyMonitor.map(h => h.monitoring_id);

            filter = {
                OR: [
                    { team_lead: userId },
                    { id: { in: monitorId } }
                ]
            };
        }

        const monitors = await prisma.monitoring.findMany({
            where: filter,
            include: {
                owner: { select: { id: true } }
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        return res.json(monitors);
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.code || error.message });
    }
};

export const getDataMonitorHistory = async (req, res) => {
    try {
        const { userId } = await req.auth();
        
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        let filter = {};

        if (user.role !== "ADMIN") {
            const historyMonitor = await prisma.monitoringHistory.findMany({
                where: { team_lead: userId },
                select: { monitoring_id: true }
            });

            const monitorId = historyMonitor.map(h => h.monitoring_id);

            filter = {
                OR: [
                    { team_lead: userId }, 
                    { monitoring_id: { in: monitorId } } // ✔️ perbaikan
                ]
            };
        }

        const monitors = await prisma.monitoringHistory.findMany({
            where: filter,
            include: { owner: { select: { id: true } } },
            orderBy: { createdAt: "desc" }
        });

        return res.json(monitors);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.code || error.message });
    }
};


export const getDataRencanaKerja = async (req, res) => {
    try {
        
        const { userId } = await req.auth();
        const { monitorId } = req.params;

        const rencanakerja = await prisma.rencanaKerja.findMany({
            where: {
                monitoring_id: monitorId
            }, orderBy: 
            {
                minggu: "asc"
            }
        });
        
        return res.json(rencanakerja);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.code || error.message });
    }
};


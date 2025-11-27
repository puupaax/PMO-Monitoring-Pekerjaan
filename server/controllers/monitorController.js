import prisma from "../config/prisma.js";

export const getDataMonitor = async (req, res) => {
    try {
        
        const { userId } = await req.auth();
        const monitors = await prisma.monitoring.findMany({
            where: {

            }, include: {
                owner: { select: { id: true } }
            }
            , orderBy: {
                createdAt: "desc"
            }
        });
        // console.log("data: ", monitors);
        return res.json(monitors);
        // const user = await prisma.user.findUnique({
        //     where: { id: userId }
        // });

        // if (!user) {
        //     return res.status(404).json({ message: "User not found" });
        // }

        // const memberships = await prisma.workspaceMember.findMany({
        //     where: { userId },
        //     select: { workspaceId: true, role: true }
        // });

        // if (memberships.length === 0) {
        //     return res.status(403).json({ message: "Anda tidak tergabung dalam workspace manapun" });
        // }

        // const workspaceIds = memberships.map(m => m.workspaceId);

        // monitors = await prisma.monitoring.findMany({
        //     where: {
        //         workspaceId: { in: workspaceIds }
        //     },
        //     include: {
        //         owner: true,
        //         workspace: true,
        //         history: true
        //     }
        // });

        // return res.json({ monitors });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.code || error.message });
    }
};

export const getDataMonitorHistory = async (req, res) => {
    try {
        
        const { userId } = await req.auth();
        const { monitorId } = req.params;

        const monitors = await prisma.monitoringHistory.findMany({
            where: {
                monitoring_id: monitorId
            }, include: {
                owner: { select: { id: true } }
            }
            , orderBy: {
                createdAt: "desc"
            }
        });
        // console.log("data: ", monitors);
        return res.json(monitors);
        // const user = await prisma.user.findUnique({
        //     where: { id: userId }
        // });

        // if (!user) {
        //     return res.status(404).json({ message: "User not found" });
        // }

        // const memberships = await prisma.workspaceMember.findMany({
        //     where: { userId },
        //     select: { workspaceId: true, role: true }
        // });

        // if (memberships.length === 0) {
        //     return res.status(403).json({ message: "Anda tidak tergabung dalam workspace manapun" });
        // }

        // const workspaceIds = memberships.map(m => m.workspaceId);

        // monitors = await prisma.monitoring.findMany({
        //     where: {
        //         workspaceId: { in: workspaceIds }
        //     },
        //     include: {
        //         owner: true,
        //         workspace: true,
        //         history: true
        //     }
        // });

        // return res.json({ monitors });

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


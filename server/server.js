    import express from 'express';
    import 'dotenv/config';
    import cors from 'cors';
    import { clerkMiddleware } from '@clerk/express'

    import { serve } from "inngest/express";
    import { inngest, functions } from "./inngest/index.js"
    import { protect } from './middlewares/authMiddleware.js';
    import { requireRole } from "./middlewares/requireRole.js";
    import projectRouter from './routes/projectRoutes.js';

    import userRoutes from './routes/userRoutes.js';
    import monitoringgraphRoutes from "./routes/monitoringgraphRoutes.js";

    import monitorRoutes from './routes/monitorRoutes.js';

    if (!process.env.CLERK_PUBLISHABLE_KEY) {
        throw new Error('Missing Clerk Publishable Key');
    }

    const app = express();

    app.use(
    clerkMiddleware({
        publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
        secretKey: process.env.CLERK_SECRET_KEY
    })
    );

    app.use((req, res, next) => {
    next();
    });


    app.use(express.json());
    app.use(cors());
    // app.use(clerkMiddleware({
    //     publishableKey: process.env.CLERK_PUBLISHABLE_KEY
    // }));
    // app.use("/uploads", express.static("uploads"));


    app.get('/', (req, res)=> res.send('Server is live'));
    app.use("/api/inngest", serve({ client: inngest, functions }));

    //routes
    app.use("/api/projects", protect, requireRole("ADMIN"),  projectRouter) //GRAFIK
    app.use("/api/users", protect, requireRole("ADMIN"), userRoutes);
    app.use("/api/monitoring-history", monitoringgraphRoutes);
    app.use("/api/monitor", protect, monitorRoutes)


    const PORT = process.env.PORT || 5000;

    app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));

import prisma from "../config/prisma.js";

/**
 * GET /api/monitoring-history/summary
 * returns: { totalProjects, problematicProjects, onTrack }
 */
export const getSummary = async (req, res) => {
  try {
    const rows = await prisma.monitoring.findMany({
      select: { id: true, kendala: true },
    });

    const uniqueByMonitoring = new Map();
    for (const r of rows) {
      // keep if any row for that id has kendala = true
      const prev = uniqueByMonitoring.get(r.id);
      uniqueByMonitoring.set(
        r.id,
        prev ? prev || r.kendala : r.kendala
      );
    }

    let totalProjects = uniqueByMonitoring.size;
    let problematicProjects = 0;
    for (const val of uniqueByMonitoring.values()) {
      if (val) problematicProjects++;
    }
    const onTrack = totalProjects - problematicProjects;

    res.json({ totalProjects, problematicProjects, onTrack });
  } catch (err) {
    console.error("getSummary error:", err);
    res.status(500).json({ message: "Failed to get summary" });
  }
};

/**
 * GET /api/monitoring-history/deviasi
 * returns deviasi aggregated per project (latest deviasi per monitoring or average)
 * We'll return the latest deviasi per id to show current deviation.
 * response: [{ id, nama_proyek, deviasi }]
 */
export const getDeviasiPerProject = async (req, res) => {
  try {
    // fetch latest entry per id by createdAt
    const all = await prisma.monitoring.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        nama_proyek: true,
        deviasi: true,
        createdAt: true,
      },
    });

    const seen = new Map();
    const result = [];
    for (const row of all) {
      if (!seen.has(row.id)) {
        seen.set(row.id, true);
        result.push({
          id: row.id,
          nama_proyek: row.nama_proyek,
          deviasi: Number(row.deviasi), // convert Decimal -> Number
          date: row.createdAt,
        });
      }
    }

    res.json(result);
  } catch (err) {
    console.error("getDeviasiPerProject error:", err);
    res.status(500).json({ message: "Failed to get deviasi per project" });
  }
};

/**
 * GET /api/monitoring-history/problem-pie
 * returns counts for pie chart: [{ name: 'Problematic', value }, { name: 'On Track', value }]
 */
export const getProblemPie = async (req, res) => {
  try {
    const rows = await prisma.monitoring.findMany({
      select: { id: true, kendala: true },
    });

    const map = new Map();
    for (const r of rows) {
      // if any entry for id has kendala true -> problematic
      const prev = map.get(r.id) || false;
      map.set(r.id, prev || r.kendala);
    }

    let problematic = 0;
    for (const v of map.values()) if (v) problematic++;
    const total = map.size;
    const onTrack = total - problematic;

    res.json([
      { name: "Problematic", value: problematic },
      { name: "On Track", value: onTrack },
    ]);
  } catch (err) {
    console.error("getProblemPie error:", err);
    res.status(500).json({ message: "Failed to get problem pie" });
  }
};

/**
 * GET /api/monitoring-history/trends?monitoring_id=... (optional)
 * returns trend deviasi per monitoring_id grouped by date
 * If monitoring_id not provided, returns trends for top N projects.
 * response: [{ monitoring_id, nama_proyek, points: [{ date, deviasi }] }]
 */
export const getTrends = async (req, res) => {
  try {
    const { monitoring_id } = req.query;

    const all = await prisma.monitoringHistory.findMany({
      where: monitoring_id ? { monitoring_id } : {},
      orderBy: [{ monitoring_id: "asc" }, { createdAt: "asc" }],
      select: {
        monitoring_id: true,
        nama_proyek: true,
        rencana: true,
        realisasi: true,
        deviasi: true,
        createdAt: true,
      },
    });

    const groups = new Map();
    for (const row of all) {
      const key = row.monitoring_id;
      if (!groups.has(key)) {
        groups.set(key, {
          monitoring_id: key,
          nama_proyek: row.nama_proyek,
          points: [],
        });
      }
      groups.get(key).points.push({
        date: row.createdAt,
        rencana: Number(row.rencana),
        realisasi : Number(row.realisasi),
        deviasi: Number(row.deviasi),
      });
    }

    // Convert to array
    const result = Array.from(groups.values());
    res.json(result);
  } catch (err) {
    console.error("getTrends error:", err);
    res.status(500).json({ message: "Failed to get trends" });
  }
};

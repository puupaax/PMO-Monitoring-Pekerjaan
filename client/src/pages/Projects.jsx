// src/pages/Projects.jsx
import { useEffect, useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import { useAuth } from "@clerk/clerk-react";
import api from "../configs/api";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function Projects() {
  const { getToken } = useAuth();

  const [summary, setSummary] = useState(null);
  const [deviasi, setDeviasi] = useState([]);
  const [pie, setPie] = useState([]);
  const [trends, setTrends] = useState([]);
  const [selectedProject, setSelectedProject] = useState("ALL");
  const [loading, setLoading] = useState(true);

  const ScrollableLegend = ({ payload }) => {
    return (
      <div
        className="overflow-y-auto pr-2"
        style={{ maxHeight: "75px" }}
      >
        {payload.map((entry, index) => (
          <div
            key={`item-${index}`}
            className="flex items-center gap-2 mb-1 text-sm leading-5"
            style={{ height: "24px" }} // tinggi per item
          >
            <span
              className="w-3 h-3 rounded-full inline-block"
              style={{ backgroundColor: entry.color }}
            />
            <span className="truncate">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };



  const fetchAll = async () => {
    try {
      setLoading(true);
      const token = await getToken();

      const [sRes, dRes, pRes, tRes] = await Promise.all([
        api.get("/api/monitoring-history/summary", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        api.get("/api/monitoring-history/deviasi", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        api.get("/api/monitoring-history/problem-pie", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        api.get("/api/monitoring-history/trends", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setSummary(sRes.data);
      setDeviasi(dRes.data);
      setPie(pRes.data);
      setTrends(tRes.data);
    } catch (err) {
      console.error("fetchAll error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // top N untuk bar chart
  const topDeviasi = useMemo(() => {
    // Jika ingin sort berdasarkan deviasi absolut descending:
    return [...deviasi]
      .sort((a, b) => Math.abs(b.deviasi) - Math.abs(a.deviasi))
    //   .slice(0, 8);
  }, [deviasi]);

  // cari nilai absolut maksimal untuk scaling warna gradasi
  const maxAbsDeviasi = useMemo(() => {
    if (topDeviasi.length === 0) return 1;
    return Math.max(
      1,
      ...topDeviasi.map((d) => Math.abs(Number(d.deviasi) || 0))
    );
  }, [topDeviasi]);

  // fungsi warna gradasi berdasarkan nilai deviasi
  const getDeviasiColor = (value) => {
    const v = Number(value) || 0;

    // intensity sekarang makin kecil saat deviasi makin besar
    const intensity = Math.round(
        255 - (Math.min(Math.abs(v), maxAbsDeviasi) / maxAbsDeviasi) * 155
    ); // hasil 100..255

    if (v < 0) {
        // merah tua = deviasi besar
        return `rgb(${intensity}, 60, 60)`;
    } else {
        // hijau tua = deviasi besar (negatif)
        return `rgb(60, ${intensity}, 60)`;
    }
  };


  const filteredTrends =
    selectedProject === "ALL"
      ? trends.slice(0, 50)
      : trends.filter((t) => t.monitoring_id === selectedProject);


  const selectedTrend = useMemo(() => {
    if (selectedProject === "ALL") return null;
    return trends.find((t) => t.monitoring_id === selectedProject);
  }, [selectedProject, trends]);

  useEffect(() => {
    console.log("Selected project:", selectedProject);
    console.log("Selected trend:", selectedTrend);
  }, [selectedProject, selectedTrend]);



  if (loading) return <div>Loading...</div>;


  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold">Analisis Proyek</h1>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="max-sm:w-full dark:bg-gradient-to-br dark:from-zinc-800/70 dark:to-zinc-900/50 border border-gray-300 dark:border-zinc-800 rounded-lg p-6">
          <p className="text-sm text-gray-500">Total Proyek</p>
          <p className="text-xl font-bold">{summary?.totalProjects ?? 0}</p>
        </div>
        <div className="max-sm:w-full dark:bg-gradient-to-br dark:from-zinc-800/70 dark:to-zinc-900/50 border border-gray-300 dark:border-zinc-800 rounded-lg p-6">
          <p className="text-sm text-gray-500">Proyek Terkendala</p>
          <p className="text-xl font-bold">{summary?.problematicProjects ?? 0}</p>
        </div>
        <div className="max-sm:w-full dark:bg-gradient-to-br dark:from-zinc-800/70 dark:to-zinc-900/50 border border-gray-300 dark:border-zinc-800 rounded-lg p-6">
          <p className="text-sm text-gray-500">On Track</p>
          <p className="text-xl font-bold">{summary?.onTrack ?? 0}</p>
        </div>
      </div>

      {/* Deviasi Bar Chart */}
      <div className="max-sm:w-full dark:bg-gradient-to-br dark:from-zinc-800/70 dark:to-zinc-900/50 border border-gray-300 dark:border-zinc-800 rounded-lg p-6">
        <h2 className="mb-2 font-medium">Grafik Deviasi Pekerjaan (per proyek)</h2>
        <ResponsiveContainer width="100%" height={340}>
          <BarChart data={topDeviasi} margin={{ top: 10, right: 20, left: 0, bottom: 60 }}>
            <XAxis
              dataKey="nama_proyek"
              tick={{ fontSize: 12 }}
              angle={-30}
              textAnchor="end"
              interval={0}
              height={60}
              tickFormatter={(value) =>
                    value.length > 25 ? value.substring(0, 25) + "..." : value
                }
            />
            <YAxis />
            <Tooltip
              formatter={(value) => {
                // tampilkan dengan 2 desimal
                return [Number(value).toLocaleString(undefined, { maximumFractionDigits: 2 }), "Deviasi"];
              }}
            />
            <Bar dataKey="deviasi" radius={[6, 6, 0, 0]}>
              {topDeviasi.map((item, index) => (
                <Cell key={`cell-${index}`} fill={getDeviasiColor(item.deviasi)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        
      </div>

      {/* Pie + Trends */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Problem Pie (diperbesar) */}
        <div className="max-sm:w-full dark:bg-gradient-to-br dark:from-zinc-800/70 dark:to-zinc-900/50 border border-gray-300 dark:border-zinc-800 rounded-lg p-6">
          <h2 className="mb-2 font-medium">Proyek Bermasalah (Proporsi)</h2>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={pie}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={110} 
                label
              >
                {pie.map((entry, i) => (
                  <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

          {/* Trend Deviasi */}
          <div className="max-sm:w-full dark:bg-gradient-to-br dark:from-zinc-800/70 dark:to-zinc-900/50 border border-gray-300 dark:border-zinc-800 rounded-lg p-6">

            {/* Dropdown filter proyek */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-medium">
                {selectedProject === "ALL"
                  ? "Trend Deviasi Semua Proyek" 
                  : `Trend Proyek:  ${selectedTrend?.nama_proyek}`}
              </h2>
              <select
                  className="border p-1.5 rounded text-sm w-48"
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
              >
                  <option value="ALL">Semua Proyek</option>
                  {trends.map((proj) => (
                  <option key={proj.monitoring_id} value={proj.monitoring_id}>
                      {proj.nama_proyek}
                  </option>
                  ))}
              </select>
              </div>

            {/* Chart */}
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <LineChart
                  data={selectedProject === "ALL" ? undefined : selectedTrend?.points}
                  margin={{ top: 10, right: 20, left: 0, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(d) => new Date(d).toLocaleDateString()}
                  />
                  <YAxis />
                  <Tooltip labelFormatter={(l) => new Date(l).toLocaleString()} />
                  <Legend
                    content={<ScrollableLegend />}
                    wrapperStyle={{
                      paddingTop: 15,
                      paddingLeft: 30,  
                    }}
                  />

                  {selectedProject === "ALL" ? (
                    // MODE SEMUA PROYEK (deviasi saja)
                    filteredTrends.map((proj, idx) => (
                      <Line
                        key={proj.monitoring_id}
                        data={proj.points}
                        name={proj.nama_proyek}
                        dataKey="deviasi"
                        stroke={COLORS[idx % COLORS.length]}
                        dot={false}
                        strokeWidth={2}
                        isAnimationActive={false}
                      />
                    ))
                  ) : (
                    // MODE 1 PROYEK (rencana, realisasi, deviasi)
                    <>
                      <Line
                        dataKey="rencana"
                        name="Rencana"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={false}
                      />
                      <Line
                        dataKey="realisasi"
                        name="Realisasi"
                        stroke="#10b981"
                        strokeWidth={2}
                        dot={false}
                      />
                      <Line
                        dataKey="deviasi"
                        name="Deviasi"
                        stroke="#ef4444"
                        strokeWidth={2}
                        dot={false}
                      />
                    </>
                  )}

                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
      </div>
    </div>
  );
}

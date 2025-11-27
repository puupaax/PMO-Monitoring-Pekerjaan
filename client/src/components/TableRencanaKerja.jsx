import { createColumnHelper, flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";
import { ArrowUpDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Clock, Component, Mail, NotebookPen, Percent, Search, SquarePen, Trash2, TriangleAlert, User, X, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import mockData from "../assets/mockdata.json";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";



import api from "../configs/api";
import { useAuth } from "@clerk/clerk-react";


const columnHelper = createColumnHelper();

const columns = [
    columnHelper.accessor("minggu", {
        cell: (info) => info.getValue(),
        header: () => (
        <span className="flex items-center">
            <Component className="mr-2" size={16} /> Minggu Ke-
        </span>
        ),
    }),
        columnHelper.accessor("progress", {
        header: () => (
        <span className="flex items-center">
            <NotebookPen className="mr-2" size={16} /> Progress
        </span>
        ),
        cell: (info) => `${info.getValue()}%`,
    }),
];

const TableRencanaKerja = ({ show, onClose, monitorId }) => {
    const [data, setData] = useState([]);
    const [sorting, setSorting] = useState([]);
    const [globalFilter, setGlobalFilter] = useState("");
    const { getToken } = useAuth();

    useEffect(() => {
        if (!show || !monitorId) return;

        const fetchData = async () => {
            try {
                const token = await getToken();
                const res = await api.get(`/api/monitor/${monitorId}/rencana`, {
                    headers: {Authorization: `Bearer ${token}`}
                }); 
                setData(res.data); 
            } catch (error) {
                console.log("Error fetching monitoring:", error);
            }
        };

        fetchData();
    }, [show, monitorId]);

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            globalFilter,
        },
        initialState: {
            pageSize: 100,
        },
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onGlobalFilterChange: setGlobalFilter,
        getFilteredRowModel: getFilteredRowModel(),
    });

    if (!show) return null;

return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 dark:bg-black/60 backdrop-blur"
            onClick={onClose}
        >
            <div
                className="bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg shadow-lg w-full max-w-5xl p-6 text-zinc-900 dark:text-white"
                onClick={(e) => e.stopPropagation()}
            >
                {/* TITLE */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Rencana Kerja dan Kurva S</h2>
                    <button
                        onClick={onClose}
                        className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                    >
                        <X size={22} />
                    </button>
                </div>

                {/* SEARCH */}
                {/* <div className="mb-4 relative">
                        <input
                            value={globalFilter ?? ""}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            placeholder="Cari Minggu Ke-"
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                </div> */}


                {/* TABLE */}
                {/* CONTENT GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">

                {/* TABEL KIRI */}
                <div className="h-[350px] overflow-y-auto border rounded dark:border-zinc-800">
                    <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
                    <thead className="bg-zinc-50 dark:bg-zinc-900">
                        {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                            <th
                                key={header.id}
                                className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider"
                            >
                                {flexRender(header.column.columnDef.header, header.getContext())}
                            </th>
                            ))}
                        </tr>
                        ))}
                    </thead>
                    <tbody className="bg-white dark:bg-zinc-950 divide-y divide-zinc-200 dark:divide-zinc-800">
                        {table.getRowModel().rows.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length} className="text-center py-6 text-zinc-500">
                            Tidak ada Rencana Kerja.
                            </td>
                        </tr>
                        ) : (
                        table.getRowModel().rows.map(row => (
                            <tr key={row.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900">
                            {row.getVisibleCells().map(cell => (
                                <td key={cell.id} className="px-4 py-3 text-sm">
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                            </tr>
                        ))
                        )}
                    </tbody>
                    </table>
                </div>

                {/* GRAFIK KANAN */}
                <div className="border rounded dark:border-zinc-800 p-4 h-[350px] flex flex-col">
                    <h3 className="text-sm font-semibold mb-4 text-center">Kurva S</h3>

                    <ResponsiveContainer width="100%" height="100%">
                    <LineChart 
                        data={[...data].sort((a,b) => a.minggu - b.minggu)}
                        margin={{ top: 10, right: 10, left: 10, bottom: 10 }} 
                        >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="minggu" label={{ value: "Minggu", position: "insideBottom", offset: -5 }} />
                        <YAxis domain={[0, 100]} label={{ value: "Progress (%)", angle: -90, position: "insideLeft" }} />
                        <Tooltip />
                        <Line
                        type="monotone"
                        dataKey="progress"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                        />
                    </LineChart>
                    </ResponsiveContainer>
                </div>

                </div>

                {/* PAGINATION
                <div className="flex justify-between items-center mt-4 text-sm">
                    <span>
                        Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                    </span>

                    <div className="flex gap-2">
                        <button
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                            className="px-3 py-1 border rounded disabled:opacity-40"
                        >
                            Prev
                        </button>
                        <button 
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                            className="px-3 py-1 border rounded disabled:opacity-40"
                        >
                            Next
                        </button>
                    </div>
                </div> */}
            </div>
        </div>
    );
}

export default TableRencanaKerja;
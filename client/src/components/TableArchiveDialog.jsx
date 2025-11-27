import { createColumnHelper, flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";
import { ArrowUpDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Clock, Component, Mail, NotebookPen, Percent, Search, SquarePen, Trash2, TriangleAlert, User, X, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import mockData from "../assets/mockdata.json";


import api from "../configs/api";
import { useSelector } from "react-redux";
import { useAuth } from "@clerk/clerk-react";
import CreateProjectDialog from "./CreateProjectDialog";

const columnHelper = createColumnHelper();

const columns = [
    columnHelper.accessor("nama_proyek", {
        cell: (info) => info.getValue(),
        header: () => (
        <span className="flex items-center">
            <Component className="mr-2" size={16} /> Nama Proyek
        </span>
        ),
    }),
    columnHelper.accessor("no_kontrak", {
        id: "email",
        cell: (info) => (
        <span className="italic text-blue-600">{info.getValue()}</span>
        ),
        header: () => (
        <span className="flex items-center">
            <Mail className="mr-2" size={16} /> Nomor Kontrak
        </span>
        ),
    }),
    columnHelper.accessor("pelaksana_pekerjaan", {
        header: () => (
        <span className="flex items-center">
            <User className="mr-2" size={16} /> Pelaksana Pekerjaan
        </span>
        ),
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("jangka_waktu", {
        header: () => (
        <span className="flex items-center">
            <Clock className="mr-2" size={16} /> Jangka Waktu Pelaksanaan
        </span>
        ),
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("nama_ppp", {
        header: () => (
        <span className="flex items-center">
            <User className="mr-2" size={16} /> PPP
        </span>
        ),
        cell: (info) => info.getValue(),
    }),
        columnHelper.accessor("nama_ppk", {
        header: () => (
        <span className="flex items-center">
            <User className="mr-2" size={16} /> PPIK
        </span>
        ),
        cell: (info) => info.getValue(),
    }),
        columnHelper.accessor("nama_php", {
        header: () => (
        <span className="flex items-center">
            <User className="mr-2" size={16} /> PHP
        </span>
        ),
        cell: (info) => info.getValue(),
    }),
        columnHelper.accessor("rencana", {
        header: () => (
        <span className="flex items-center">
            <Percent className="mr-2" size={16} /> Rencana
        </span>
        ),
        cell: (info) => info.getValue(),
    }),
        columnHelper.accessor("realisasi", {
        header: () => (
        <span className="flex items-center">
            <Percent className="mr-2" size={16} /> Realisasi
        </span>
        ),
        cell: (info) => info.getValue(),
    }),
        columnHelper.accessor("deviasi", {
        header: () => (
        <span className="flex items-center">
            <Percent className="mr-2" size={16} /> Deviasi
        </span>
        ),
        cell: (info) => info.getValue(),
    }),
        columnHelper.accessor("kendala", {
        header: () => (
        <span className="flex items-center">
            <TriangleAlert className="mr-2" size={16} /> Kendala
        </span>
        ),
        cell: (info) => info.getValue(),
    }),
        columnHelper.accessor("keterangan", {
        header: () => (
        <span className="flex items-center">
            <NotebookPen className="mr-2" size={16} /> Keterangan
        </span>
        ),
        cell: (info) => info.getValue(),
    }),
];

const TableArchiveDialog = ({ show, onClose, monitorId }) => {
    const [data, setData] = useState([]);
    const [sorting, setSorting] = useState([]);
    const [globalFilter, setGlobalFilter] = useState("");
    const { getToken } = useAuth();

    useEffect(() => {
        if (!show || !monitorId) return;

        const fetchData = async () => {
            try {
                const token = await getToken();
                const res = await api.get(`/api/monitor/${monitorId}`, {
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
            pagination: {
                pageSize: 5,
            },
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
                    <h2 className="text-xl font-bold">Arsip Monitoring</h2>
                    <button
                        onClick={onClose}
                        className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                    >
                        <X size={22} />
                    </button>
                </div>

                {/* SEARCH */}
                <div className="mb-4 relative">
                        <input
                            value={globalFilter ?? ""}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            placeholder="Cari Nama Proyek"
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                </div>


                {/* TABLE */}
                <div className="overflow-x-auto overflow-y-auto max-h-[50vh] border rounded dark:border-zinc-800">
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
                                        Tidak ada data arsip.
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

                {/* PAGINATION */}
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
                </div>
            </div>
        </div>
    );
}

export default TableArchiveDialog;
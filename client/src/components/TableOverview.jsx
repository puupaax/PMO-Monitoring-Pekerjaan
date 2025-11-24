import { createColumnHelper, flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";
import { ArrowUpDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Clock, Component, Mail, NotebookPen, Percent, Phone, Search, SquarePen, TableOfContents, Trash2, TriangleAlert, User } from "lucide-react";
import React, { useEffect, useState } from "react";
import mockData from "../assets/mockdata.json";

import api from "../configs/api";
import { useSelector } from "react-redux";
import { useAuth } from "@clerk/clerk-react";
import TableArchiveDialog from "./TableArchiveDialog";
import UpdMonitorDialog from "./UpdMonitorDialog";
import DeleteMonitor from "./DeleteMonitor";

const columnHelper = createColumnHelper();

const TableOverview = () => {
    const [showArchive, setShowArchive] = useState(false);
    const [updMonitor, setUpdMonitor] = useState(false);
    const [delMonitor, setDelMonitor] = useState(false);

    const [data, setData] = useState([]);
    const [sorting, setSorting] = useState([]);
    const [globalFilter, setGlobalFilter] = useState("");
    const { getToken } = useAuth();
    const [monitoringId, setMonitoringId] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = await getToken();
                const res = await api.get("/api/monitor/", {
                    headers: {Authorization: `Bearer ${token}`}
                }); 
                setData(res.data); 
            } catch (error) {
                console.log("Error fetching monitoring:", error);
            }
        };

        fetchData();
    }, []);

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
            cell: (info) => {
                const value = info.getValue();

                return value ? (
                    <span className="text-red-600 animate-flash">
                        Project berkendala
                    </span>
                ) : (
                    <span className="text-green-600 ">
                        Project berjalan dengan baik
                    </span>
                );
            },
        }),
            columnHelper.accessor("keterangan", {
            header: () => (
            <span className="flex items-center">
                <NotebookPen className="mr-2" size={16} /> Keterangan
            </span>
            ),
            cell: (info) => info.getValue(),
        }),
        columnHelper.display({
            id: "actions",
            header: () => (
                <span className="flex items-center cursor-default select-none">
                    History
                </span>
            ),
            enableSorting: false,
            cell: ({ row }) => {
                return (
                    <div className="flex items-center gap-2">
                        <TableOfContents size={18} className="text-gray-600"
                            onClick={() => {
                                setMonitoringId(row.original.id)
                                setShowArchive(true)
                            }}
                        />
                        <SquarePen size={18} className="text-green-600" 
                        onClick={() => {
                            setSelectedProject(row.original)
                            setUpdMonitor(true)
                        }}/>
                        <Trash2 size={18} className="text-red-600" 
                        onClick={() => {
                            setMonitoringId(row.original.id)
                            setDelMonitor(true)
                        }}/>
                    </div>
                );
            }
    }),
    ];

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

    const reloadData = async () => {
        try {
            const token = await getToken();
            const res = await api.get("/api/monitor/", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setData(res.data);
        } catch (error) {
            console.log("Error fetching monitoring:", error);
        }
    };


    return (
        <>
        <TableArchiveDialog
            show={showArchive}
            onClose={() => setShowArchive(false)}
            monitorId={monitoringId}
        />
        <UpdMonitorDialog 
            isDialogOpen={updMonitor}
            setIsDialogOpen={setUpdMonitor}
            projectData={selectedProject}
            onSuccess={reloadData}
        />
        <DeleteMonitor 
            isDialogOpen={delMonitor}
            setIsDialogOpen={setDelMonitor}
            monitorId={monitoringId}
            onDeleted={reloadData}
        />

        <div className="flex flex-col w-full mt-6">
            <div className="mb-4 relative">
                <input
                    value={globalFilter ?? ""}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    placeholder="Cari Nama Proyek"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>

            <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        <div
                                            {...{
                                                className: header.column.getCanSort()
                                                    ? "cursor-pointer select-none flex items-center"
                                                    : "flex items-center",
                                                onClick: header.column.getCanSort()
                                                    ? header.column.getToggleSortingHandler()
                                                    : undefined,
                                            }}
                                        >
                                            {flexRender(header.column.columnDef.header, header.getContext())}

                                            {/* Hanya tampilkan icon sorting jika kolom bisa sorting */}
                                            {header.column.getCanSort() && (
                                                <ArrowUpDown className="ml-2" size={14} />
                                            )}
                                        </div>
                                    </th>

                                ))}
                            </tr>
                        ))}
                        
                    </thead>

                    <tbody className="bg-white divide-y divide-gray-200">
                        {table.getRowModel().rows.map((row) => (
                            <tr key={row.id} className="hover:bg-gray-50">
                                {row.getVisibleCells().map((cell) => (
                                    <td
                                        key={cell.id}
                                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                                    >
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row justify-between items-center mt-4 text-sm text-gray-700">
                <div className="flex items-center mb-4 sm:mb-0">
                    <span className="mr-2">Items per page</span>
                    <select
                        className="border border-gray-300 rounded-md shadow-sm p-2"
                        value={table.getState().pagination.pageSize}
                        onChange={(e) => table.setPageSize(Number(e.target.value))}
                    >
                        {[5, 10, 20, 30].map((pageSize) => (
                            <option key={pageSize} value={pageSize}>
                                {pageSize}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center space-x-2">
                    <button
                        className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <ChevronsLeft size={20} />
                    </button>

                    <button
                        className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <ChevronLeft size={20} />
                    </button>

                    <span className="flex items-center">
                        <input
                            min={1}
                            max={table.getPageCount()}
                            type="number"
                            value={table.getState().pagination.pageIndex + 1}
                            onChange={(e) => {
                                const page = Number(e.target.value) - 1;
                                table.setPageIndex(page);
                            }}
                            className="w-16 p-2 rounded-md border border-gray-300 text-center"
                        />
                        <span className="ml-1">of {table.getPageCount()}</span>
                    </span>

                    <button
                        className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <ChevronRight size={20} />
                    </button>

                    <button
                        className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                        disabled={!table.getCanNextPage()}
                    >
                        <ChevronsRight size={20} />
                    </button>
                </div>
            </div>
        </div> 
        </>
    );
};

export default TableOverview;
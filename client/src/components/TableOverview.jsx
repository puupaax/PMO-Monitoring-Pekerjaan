import { createColumnHelper, flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";
import { ArrowUpDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Mail, Phone, Search, User } from "lucide-react";
import React, { useEffect, useState } from "react";
import mockData from "../assets/mockdata.json";

import api from "../configs/api";
import { useSelector } from "react-redux";

const columnHelper = createColumnHelper();

const columns = [
    columnHelper.accessor("No", {
        cell: (info) => info.getValue(),
        header: () => (
        <span className="flex items-center">
            <User className="mr-2" size={16} /> No
        </span>
        ),
    }),

    columnHelper.accessor("Nama Proyek", {
        cell: (info) => info.getValue(),
        header: () => (
        <span className="flex items-center">
            <User className="mr-2" size={16} /> Nama Proyek
        </span>
        ),
    }),
    columnHelper.accessor("Nomor Kontak", {
        id: "email",
        cell: (info) => (
        <span className="italic text-blue-600">{info.getValue()}</span>
        ),
        header: () => (
        <span className="flex items-center">
            <Mail className="mr-2" size={16} /> Nomor Kontak
        </span>
        ),
    }),
    columnHelper.accessor("Pelaksana Pekerjaan", {
        header: () => (
        <span className="flex items-center">
            <Phone className="mr-2" size={16} /> Pelaksana Pekerjaan
        </span>
        ),
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("Jangka Waktu Pelaksanaan", {
        header: () => (
        <span className="flex items-center">
            <Phone className="mr-2" size={16} /> Jangka Waktu Pelaksanaan
        </span>
        ),
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("PPP", {
        header: () => (
        <span className="flex items-center">
            <Phone className="mr-2" size={16} /> PPP
        </span>
        ),
        cell: (info) => info.getValue(),
    }),
        columnHelper.accessor("PPIK", {
        header: () => (
        <span className="flex items-center">
            <Phone className="mr-2" size={16} /> PPIK
        </span>
        ),
        cell: (info) => info.getValue(),
    }),
        columnHelper.accessor("PHP", {
        header: () => (
        <span className="flex items-center">
            <Phone className="mr-2" size={16} /> PHP
        </span>
        ),
        cell: (info) => info.getValue(),
    }),
        columnHelper.accessor("Rencana", {
        header: () => (
        <span className="flex items-center">
            <Phone className="mr-2" size={16} /> Rencana
        </span>
        ),
        cell: (info) => info.getValue(),
    }),
        columnHelper.accessor("Realisasi", {
        header: () => (
        <span className="flex items-center">
            <Phone className="mr-2" size={16} /> Realisasi
        </span>
        ),
        cell: (info) => info.getValue(),
    }),
        columnHelper.accessor("Deviasi", {
        header: () => (
        <span className="flex items-center">
            <Phone className="mr-2" size={16} /> Deviasi
        </span>
        ),
        cell: (info) => info.getValue(),
    }),
        columnHelper.accessor("Kendala", {
        header: () => (
        <span className="flex items-center">
            <Phone className="mr-2" size={16} /> Kendala
        </span>
        ),
        cell: (info) => info.getValue(),
    }),
        columnHelper.accessor("Keterangan", {
        header: () => (
        <span className="flex items-center">
            <Phone className="mr-2" size={16} /> Keterangan
        </span>
        ),
        cell: (info) => info.getValue(),
    }),
        columnHelper.accessor("History", {
        header: () => (
        <span className="flex items-center">
            <Phone className="mr-2" size={16} /> History
        </span>
        ),
        cell: (info) => info.getValue(),
    }),
];


const TableOverview = () => {
    const [data, setData] = useState([]);
    const [sorting, setSorting] = useState([]);
    const [globalFilter, setGlobalFilter] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get("/api/monitoring"); 
                setData(res.data.monitors); 
            } catch (error) {
                console.log("Error fetching monitoring:", error);
            }
        };

        fetchData();
    }, []);

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

    return (
        <div className="flex flex-col min-h-screen max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="mb-4 relative">
                <input
                    value={globalFilter ?? ""}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    placeholder="Search..."
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
                                                    : "",
                                                onClick: header.column.getToggleSortingHandler(),
                                            }}
                                        >
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                            <ArrowUpDown className="ml-2" size={14} />
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
    );
};

export default TableOverview;
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  getPaginationRowModel
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Mail,
  Phone,
  Search,
  User,
} from "lucide-react";
import React from "react";
import mockData from "../assets/mockdata.json";

const columnHelper = createColumnHelper();

const columns = [
  columnHelper.accessor("id", {
    cell: (info) => info.getValue(),
    header: () => (
      <span className="flex items-center">
        <User className="mr-2" size={16} /> ID
      </span>
    ),
  }),

  columnHelper.accessor("name", {
    cell: (info) => info.getValue(),
    header: () => (
      <span className="flex items-center">
        <User className="mr-2" size={16} /> Name
      </span>
    ),
  }),
  columnHelper.accessor("email", {
    id: "email",
    cell: (info) => (
      <span className="italic text-blue-600">{info.getValue()}</span>
    ),
    header: () => (
      <span className="flex items-center">
        <Mail className="mr-2" size={16} /> Email
      </span>
    ),
  }),
  columnHelper.accessor("phone", {
    header: () => (
      <span className="flex items-center">
        <Phone className="mr-2" size={16} /> Phone
      </span>
    ),
    cell: (info) => info.getValue(),
  }),
];

const TableOverviewd = () => {
    const [data] = React.useState(() => [...mockData]);
    const [sorting, setSorting] = React.useState([]);
    const [globalFilter, setGlobalFilter] = React.useState("");

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

        onGlobalFilterChange: setGlobalFilter,
        getFilteredRowModel: getFilteredRowModel(),
        
        getPaginationRowModel: getPaginationRowModel(),
    });

    console.log(table.getRowModel());

    return (
        <div className="flex flex-col min-h-screen max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-4 relative">
            <input
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
            />
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

        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 text-sm text-gray-700">
            <div className="flex items-center mb-4 sm:mb-0">
            <span className="mr-2">Items per page</span>
            <select
                className="border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2"
                value={table.getState().pagination.pageSize}
                onChange={(e) => {
                table.setPageSize(Number(e.target.value));
                }}
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
                className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
            >
                <ChevronsLeft size={20} />
            </button>

            <button
                className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
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
                    const page = e.target.value ? Number(e.target.value) - 1 : 0;
                    table.setPageIndex(page);
                }}
                className="w-16 p-2 rounded-md border border-gray-300 text-center"
                />
                <span className="ml-1">of {table.getPageCount()}</span>
            </span>

            <button
                className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
            >
                <ChevronRight size={20} />
            </button>

            <button
                className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
            >
                <ChevronsRight size={20} />
            </button>
            </div>
        </div>
        </div>
    );
}

export default TableOverviewd;
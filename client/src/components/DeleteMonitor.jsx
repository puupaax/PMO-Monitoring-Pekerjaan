import { useState } from "react";
import { XIcon } from "lucide-react";
import api from "../configs/api";
import { useAuth } from "@clerk/clerk-react";

const DeleteMonitor = ({ isDialogOpen, setIsDialogOpen, monitorId, onDeleted }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { getToken } = useAuth();

    if (!isDialogOpen) return null;

    const handleDelete = async () => {
        try {
            setIsSubmitting(true);
            const token = await getToken();

            await api.delete(`/api/projects/${monitorId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setIsSubmitting(false);
            setIsDialogOpen(false);

            if (onDeleted) onDeleted();
        } catch (error) {
            console.error("Error deleting monitor:", error);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/20 dark:bg-black/60 backdrop-blur flex items-center justify-center text-left z-50">
            <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 w-full max-w-lg text-zinc-900 dark:text-zinc-200 relative">

                <button
                    className="absolute top-3 right-3 text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                    onClick={() => setIsDialogOpen(false)}
                >
                    <XIcon className="size-5" />
                </button>

                <h2 className="text-xl font-medium mb-1">
                    Apakah Anda yakin akan menghapus proyek ini?
                </h2>

                <div className="flex justify-end gap-3 pt-2 text-sm">
                    <button
                        type="button"
                        onClick={() => setIsDialogOpen(false)}
                        className="px-4 py-2 rounded border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleDelete}
                        disabled={isSubmitting}
                        className="px-4 py-2 rounded bg-red-600 text-white disabled:opacity-50"
                    >
                        {isSubmitting ? "Deleting..." : "Delete Monitoring"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteMonitor;

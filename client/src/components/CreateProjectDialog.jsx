import { useState } from "react";
import { XIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { set } from "date-fns";
import { useAuth } from "@clerk/clerk-react";
import api from "../configs/api";
import { addProject } from "../features/workspaceSlice";    
import * as XLSX from "xlsx";


const CreateProjectDialog = ({ isDialogOpen, setIsDialogOpen, onSuccess }) => {

    const{getToken} = useAuth();
    const dispatch = useDispatch();
    const [previewData, setPreviewData] = useState([]);
    const [showPreview, setShowPreview] = useState(false);


    //const { currentWorkspace } = useSelector((state) => state.workspace);

    const [formData, setFormData] = useState({
        nama_proyek: "",
        no_kontrak: "",
        pelaksana_pekerjaan: "",
        jangka_waktu: "",
        nama_ppp: "",
        nama_ppk: "",
        nama_php: "",
        rencana: "",
        realisasi: "",
        kendala: false,
        keterangan: "",
        rencana_kerja : null,

        // tgl_kontrak: "",
        nilai_proyek: "",
        start_proyek: "",
        end_proyek: "",
        start_pemeliharaan: "",
        masa_pemeliharaan: "",
        end_pemeliharaan: ""
    });

    const [errors, setErrors] = useState({
        rencana: "",
        realisasi: ""
    });


    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);

            const fd = new FormData();

            Object.entries(formData).forEach(([key, value]) => {
            if (value !== null) {
                fd.append(key, value);
            }
            });

            const { data } = await api.post("/api/projects", fd, {
            headers: {
                Authorization: `Bearer ${await getToken()}`,
                "Content-Type": "multipart/form-data"
            }
            });

            dispatch(addProject(data.project));

            setFormData({
                nama_proyek: "",
                no_kontrak: "",
                pelaksana_pekerjaan: "",
                jangka_waktu: "",
                nama_ppp: "",
                nama_ppk: "",
                nama_php: "",
                rencana: "",
                realisasi: "",
                kendala: false,
                keterangan: "",

                // tgl_kontrak: "",
                nilai_proyek: "",
                start_proyek: "",
                end_proyek: "",
                start_pemeliharaan: "",
                masa_pemeliharaan: "",
                end_pemeliharaan: ""
            })
            if (typeof onSuccess === "function") onSuccess();
            toast.success(data.message);
            setIsDialogOpen(false);

        } catch (error) {
            toast.error(error?.response?.data?.message || error.message);
        } finally {
            setIsSubmitting(false);
        }
    };


    const handleExcelUpload = async (file) => {
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data, { type: "array" });

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Convert to JSON, PEMBAHASAN: header=1 => array 2D
        const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // HAPUS ROW PERTAMA (TEMPLATE / HEADER)
        const dataRows = rows.slice(1);

        // Mapping sesuai template Excel kamu
        const parsed = dataRows
            .filter(row => row.length > 0) // buang baris kosong
            .map((row, index) => ({
                minggu: row[0] || "",
                progress: row[1] || "",
            }));

        setPreviewData(parsed);
        setShowPreview(true);
    };


    if (!isDialogOpen) return null;

    // const removeTeamMember = (email) => {
    //     setFormData((prev) => ({ ...prev, team_members: prev.team_members.filter(m => m !== email) }));
    // };

    // if (!isDialogOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/20 dark:bg-black/60 backdrop-blur flex items-center justify-center text-left z-50">
            <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 w-full max-w-lg text-zinc-900 dark:text-zinc-200 relative">

                <button className="absolute top-3 right-3 text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                    onClick={() => setIsDialogOpen(false)}>
                    <XIcon className="size-5" />
                </button>

                <h2 className="text-xl font-medium mb-1">Create Monitoring</h2>
                {/* {currentWorkspace && (
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                        Workspace: <span className="text-blue-600 dark:text-blue-400">{currentWorkspace.name}</span>
                    </p>
                )} */}

                <form onSubmit={handleSubmit} className="max-h-[70vh] overflow-y-auto space-y-4 pr-4">

                    {/* NAMA PROYEK */}
                    <div >
                        <label className="block text-sm mb-1">Nama Proyek</label>
                        <input
                            type="text"
                            value={formData.nama_proyek}
                            onChange={(e) => setFormData({ ...formData, nama_proyek: e.target.value })}
                            className="w-full px-3 py-2 rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700"
                            required
                        />
                    </div>

                    {/* NO KONTRAK */}
                    <div>
                        <label className="block text-sm mb-1">No Kontrak</label>
                        <input
                            type="text"
                            value={formData.no_kontrak}
                            onChange={(e) => setFormData({ ...formData, no_kontrak: e.target.value })}
                            className="w-full px-3 py-2 rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700"
                            required
                        />
                    </div>

                    {/* NILAI PROYEK */}
                    <div>
                        <label className="block text-sm mb-1">Nilai Proyek</label>
                        <input
                            type="number"
                            value={formData.nilai_proyek}
                            onChange={(e) => setFormData({ ...formData, nilai_proyek: Number(e.target.value) })}
                            className="w-full px-3 py-2 rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700"
                            required
                        />
                    </div>

                    {/* PELAKSANA */}
                    <div>
                        <label className="block text-sm mb-1">Pelaksana Pekerjaan</label>
                        <input
                            type="text"
                            value={formData.pelaksana_pekerjaan}
                            onChange={(e) => setFormData({ ...formData, pelaksana_pekerjaan: e.target.value })}
                            className="w-full px-3 py-2 rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700"
                            required
                        />
                    </div>

                    {/* JANGKA WAKTU */}
                    <div>
                        <label className="block text-sm mb-1">Jangka Waktu (hari)</label>
                        <input
                            type="number"
                            value={formData.jangka_waktu}
                            onChange={(e) => {
                                const duration = Number(e.target.value);
                                const start = formData.start_proyek;

                                let endProject = "";
                                if (start && duration) {
                                    const d = new Date(start);
                                    d.setDate(d.getDate() + duration);
                                    endProject = d.toISOString().split("T")[0];
                                }

                                setFormData({
                                    ...formData,
                                    jangka_waktu: duration,
                                    end_proyek: endProject,
                                });
                            }}
                            className="w-full px-3 py-2 rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700"
                            required
                        />
                    </div>

                    <div>
                            <label className="block text-sm mb-1">Start Date</label>
                            <input type="date" value={formData.start_proyek} 
                            onChange={(e) => {
                                const start = e.target.value;
                                const duration = formData.jangka_waktu;

                                let endProject = "";
                                if (start && duration) {
                                    const d = new Date(start);
                                    d.setDate(d.getDate() + Number(duration));
                                    endProject = d.toISOString().split("T")[0];
                                }

                                setFormData({
                                    ...formData,
                                    start_proyek: start,
                                    end_proyek: endProject,
                                });
                            }}  
                            className="w-full px-3 py-2 rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 mt-1 text-zinc-900 dark:text-zinc-200 text-sm" />
                    </div>
                    <div>
                            <label className="block text-sm mb-1">End Date</label>
                            <input type="date" disabled value={formData.end_proyek} onChange={(e) => setFormData({ ...formData, end_proyek: e.target.value })} className="w-full px-3 py-2 rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 mt-1 text-zinc-900 dark:text-zinc-200 text-sm" />
                    </div>


                    {/* MASA PEMELIHARAAN */}
                    <div>
                        <label className="block text-sm mb-1">Masa Pemeliharaan (hari)</label>
                        <input
                            type="number"
                            value={formData.masa_pemeliharaan}
                            onChange={(e) => setFormData({ ...formData, masa_pemeliharaan: Number(e.target.value) })}
                            className="w-full px-3 py-2 rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-1">Start Pemeliharaan</label>
                            <input type="date" value={formData.start_pemeliharaan} 
                                onChange={(e) => {
                                    const start = e.target.value;
                                    const duration = formData.masa_pemeliharaan;

                                    let endProject = "";
                                    if (start && duration) {
                                        const d = new Date(start);
                                        d.setDate(d.getDate() + Number(duration));
                                        endProject = d.toISOString().split("T")[0];
                                    }

                                    setFormData({
                                        ...formData,
                                        start_pemeliharaan: start,
                                        end_pemeliharaan: endProject,
                                    });
                                }}
                            className="w-full px-3 py-2 rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 mt-1 text-zinc-900 dark:text-zinc-200 text-sm" />
                    </div>
                    <div>
                            <label className="block text-sm mb-1">End Pemeliharaan</label>
                            <input type="date" disabled value={formData.end_pemeliharaan} onChange={(e) => setFormData({ ...formData, end_pemeliharaan: e.target.value })} className="w-full px-3 py-2 rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 mt-1 text-zinc-900 dark:text-zinc-200 text-sm" />
                    </div>


                    {/* PJ PPP, PPK, PHP */}
                    <div>
                        <label className="block text-sm mb-1">Nama PPP</label>
                        <input
                            type="text"
                            value={formData.nama_ppp}
                            onChange={(e) => setFormData({ ...formData, nama_ppp: e.target.value })}
                            className="w-full px-3 py-2 rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700"
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-1">Nama PPK</label>
                        <input
                            type="text"
                            value={formData.nama_ppk}
                            onChange={(e) => setFormData({ ...formData, nama_ppk: e.target.value })}
                            className="w-full px-3 py-2 rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700"
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-1">Nama PHP</label>
                        <input
                            type="text"
                            value={formData.nama_php}
                            onChange={(e) => setFormData({ ...formData, nama_php: e.target.value })}
                            className="w-full px-3 py-2 rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700"
                        />
                    </div>

                    {/* RENCANA / REALISASI / DEVIASI */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm mb-1">Rencana</label>
                            <div className="relative h-10">
                                <input
                                    type="number"
                                    step="0.01"
                                    min={0}
                                    max={100}
                                    value={formData.rencana}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setFormData({ ...formData, rencana: val });
                                    }}
                                    className={`w-full px-3 py-2 pr-10 rounded border 
                                        ${errors.rencana 
                                            ? "border-red-500 dark:border-red-500" 
                                            : "border-zinc-300 dark:border-zinc-700"
                                        } dark:bg-zinc-900`}
                                />
                                {errors.rencana && (
                                    <p className="text-red-500 text-xs mt-1">{errors.rencana}</p>
                                )}
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500">%</span>
                            </div>
                        </div>

                        <div >
                            <label className="block text-sm mb-1">Realisasi</label>
                            <div className="relative h-10">
                                <input
                                    type="number"
                                    step="0.01"
                                    min={0}
                                    max={100}
                                    value={formData.realisasi}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        let error = "";

                                        if (val < 0) error = "Nilai tidak boleh kurang dari 0.";
                                        if (val > 100) error = "Nilai tidak boleh lebih dari 100.";

                                        setErrors({ ...errors, realisasi: error });
                                        setFormData({ ...formData, realisasi: val });
                                    }}
                                    className={`w-full px-3 py-2 pr-10 rounded border 
                                        ${errors.realisasi 
                                            ? "border-red-500 dark:border-red-500" 
                                            : "border-zinc-300 dark:border-zinc-700"
                                        } dark:bg-zinc-900`}
                                />
                                {errors.realisasi && (
                                    <p className="text-red-500 text-xs mt-1">{errors.realisasi}</p>
                                )}
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500">%</span>
                            </div>
                        </div>
                    </div>


                    {/* KETERANGAN */}
                    <div>
                        <label className="block text-sm mb-1">Keterangan</label>
                        <textarea
                            value={formData.keterangan}
                            onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                            rows={3}
                            className="w-full px-3 py-2 rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700    "
                        />
                    </div>
                    {/* RENCANA KERJA (UPLOAD EXCEL) */}
                    <div>
                        <label className="block text-sm mb-1">Rencana Kerja (Excel)</label>
                        <input
                            type="file"
                            accept=".xls,.xlsx"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                setFormData({ ...formData, rencana_kerja: file });
                                handleExcelUpload(file);
                            }}
                            className="w-full px-3 py-2 rounded dark:bg-zinc-900 border 
                                    border-zinc-300 dark:border-zinc-700"
                        />

                        {formData.rencana_kerja && (
                            <p className="text-xs mt-1 text-green-600">
                                File: {formData.rencana_kerja.name}
                            </p>
                        )}
                    </div>
                    <label className="block text-sm mb-1">Preview</label>
                    {showPreview && (
                        <div className="mt-3 border rounded-lg overflow-auto max-h-52">
                            
                            <table className="w-full text-sm border-collapse">
                                <thead className="bg-zinc-100 dark:bg-zinc-800 sticky top-0">
                                    <tr>
                                        <th className="border px-2 py-1">Minggu ke-</th>
                                        <th className="border px-2 py-1">Progress (%)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {previewData.map((row, i) => (
                                        <tr key={i} className="odd:bg-white even:bg-zinc-50 dark:odd:bg-zinc-900 dark:even:bg-zinc-800">
                                            
                                            <td className="border px-2 py-1">{row.minggu}</td>
                                            <td className="border px-2 py-1">{row.progress}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* FOOTER */}
                    <div className="flex justify-end gap-3 pt-2 text-sm">
                        <button
                            type="button"
                            onClick={() => setIsDialogOpen(false)}
                            className="px-4 py-2 rounded border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                        >
                            Cancel
                        </button>

                        <button
                            //disabled={isSubmitting || !currentWorkspace}
                            className="px-4 py-2 rounded bg-blue-600 text-white"
                        >
                            {isSubmitting ? "Saving..." : "Save Monitoring"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default CreateProjectDialog;
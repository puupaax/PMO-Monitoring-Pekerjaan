import { Plus } from 'lucide-react'
import { use, useState } from 'react'

import api from "../configs/api";

import CreateProjectDialog from '../components/CreateProjectDialog'
import { useAuth, useUser } from '@clerk/clerk-react'
import TableOverview from '../components/TableOverview'
import { useEffect } from 'react'


const Dashboard = () => {

    const { getToken } = useAuth();
    const {user} = useUser()
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [data, setData] = useState([])

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

    useEffect(() => {
        reloadData();
    }, []);

    return (
        <div className='w-full max-w-4xl mx-auto px-6'>
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 ">
                <div>
                    <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-1"> Selamat Datang, {user?.fullName || 'User'} </h1>
                    <p className="text-gray-500 dark:text-zinc-400 text-sm"> Monitor semua proyek dari sini! </p>
                </div>

                <button onClick={() => setIsDialogOpen(true)} className="flex items-center gap-2 px-5 py-2 text-sm rounded bg-gradient-to-br from-blue-500 to-blue-600 text-white space-x-2 hover:opacity-90 transition" >
                    <Plus size={16} /> Proyek Baru
                </button>

                <CreateProjectDialog isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} onSuccess={reloadData}/>
            </div>

            {/* <StatsGrid /> */}

            <div className="mt-8">
                <TableOverview data={data} reloadData={reloadData} />
            </div>
        </div>
    )
}

export default Dashboard

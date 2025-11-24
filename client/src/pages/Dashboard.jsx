import { Plus } from 'lucide-react'
import { use, useState } from 'react'
import StatsGrid from '../components/StatsGrid'
import ProjectOverview from '../components/ProjectOverview'
import RecentActivity from '../components/RecentActivity'
import TasksSummary from '../components/TasksSummary'
import CreateProjectDialog from '../components/CreateProjectDialog'
import { useUser } from '@clerk/clerk-react'
import TableOverview from '../components/TableOverview'
import TableOverviewd from '../components/TableOverviewd'

const Dashboard = () => {

    const {user} = useUser()
    const [isDialogOpen, setIsDialogOpen] = useState(false)

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
        <div className='w-full max-w-4xl mx-auto px-6'>
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 ">
                <div>
                    <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-1"> Welcome back, {user?.fullName || 'User'} </h1>
                    <p className="text-gray-500 dark:text-zinc-400 text-sm"> Here's what's happening with your projects today </p>
                </div>

                <button onClick={() => setIsDialogOpen(true)} className="flex items-center gap-2 px-5 py-2 text-sm rounded bg-gradient-to-br from-blue-500 to-blue-600 text-white space-x-2 hover:opacity-90 transition" >
                    <Plus size={16} /> New Project
                </button>

                <CreateProjectDialog isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} onSuccess={reloadData}/>
            </div>

            <StatsGrid />

            <div className="mt-8">
                <TableOverview />
            </div>
        </div>
    )
}

export default Dashboard

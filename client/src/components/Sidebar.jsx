import { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import WorkspaceDropdown from "./WorkspaceDropdown";
import {
    FolderOpenIcon,
    LayoutDashboardIcon,
    SettingsIcon,
    UsersIcon,
} from "lucide-react";
import { useClerk, useAuth } from "@clerk/clerk-react";
import api from "../configs/api";

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
    const { openUserProfile } = useClerk();
    const { getToken } = useAuth();
    const [currentUser, setCurrentUser] = useState(null);

    const sidebarRef = useRef(null);

    // 1. FETCH ROLE
    useEffect(() => {
        const fetchMe = async () => {
            try {
                const token = await getToken();
                const res = await api.get("/api/users/me", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCurrentUser(res.data);
            } catch (error) {
                console.error("Failed fetch me:", error);
            }
        };
        fetchMe();
    }, []);

    // 2. MENU ADMIN VS USER
    const adminMenu = [
        { name: "Dashboard", href: "/", icon: LayoutDashboardIcon },
        { name: "Grafik", href: "/projects", icon: FolderOpenIcon },
        { name: "Kelola Pengguna", href: "/team", icon: UsersIcon },
    ];

    const userMenu = [
        { name: "Dashboard", href: "/", icon: LayoutDashboardIcon },
    ];

    const menuItems = currentUser?.role === "ADMIN" ? adminMenu : userMenu;

    // 3. CLOSE SIDEBAR ON CLICK OUTSIDE
    useEffect(() => {
        function handleClickOutside(event) {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setIsSidebarOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [setIsSidebarOpen]);

    return (
        <div
            ref={sidebarRef}
            className={`z-10 bg-white dark:bg-zinc-900 min-w-68 flex flex-col h-screen border-r border-gray-200 dark:border-zinc-800 max-sm:absolute transition-all ${
                isSidebarOpen ? "left-0" : "-left-full"
            } `}
        >
            <WorkspaceDropdown />
            <hr className="border-gray-200 dark:border-zinc-800" />

            <div className="flex-1 overflow-y-scroll no-scrollbar flex flex-col">
                <div className="p-4">
                    {menuItems.map((item) => (
                        <NavLink
                            to={item.href}
                            key={item.name}
                            className={({ isActive }) =>
                                `flex items-center gap-3 py-2 px-4 text-gray-800 dark:text-zinc-100 cursor-pointer rounded transition-all ${
                                    isActive
                                        ? "bg-gray-100 dark:bg-zinc-900 dark:bg-gradient-to-br dark:from-zinc-800 dark:to-zinc-800/50"
                                        : "hover:bg-gray-50 dark:hover:bg-zinc-800/60"
                                }`
                            }
                        >
                            <item.icon size={16} />
                            <p className="text-sm truncate">{item.name}</p>
                        </NavLink>
                    ))}

                    <button
                        onClick={openUserProfile}
                        className="flex w-full items-center gap-3 py-2 px-4 text-gray-800 dark:text-zinc-100 cursor-pointer rounded hover:bg-gray-50 dark:hover:bg-zinc-800/60 transition-all"
                    >
                        <SettingsIcon size={16} />
                        <p className="text-sm truncate">Kelola Akun</p>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;

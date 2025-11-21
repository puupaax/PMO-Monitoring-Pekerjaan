import logo from "../assets/logo.png";

function WorkspaceDropdown() {
    return (
        <div className="m-4 flex items-center gap-3 select-none">
            {/* Logo */}
            <img
                src={logo}
                alt="Logo"
                className="w-8 h-8 rounded shadow"
            />

            {/* Title */}
            <h1 className="text-lg font-semibold text-gray-800 dark:text-white">
                NavMonitor
            </h1>
        </div>
    );
}

export default WorkspaceDropdown;

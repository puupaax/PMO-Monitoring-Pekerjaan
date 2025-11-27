import { Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import { Toaster } from "react-hot-toast";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Team from "./pages/Team";


const App = () => {
    return (
        <>
            <Toaster />
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Projects />} />
                    <Route path="team" element={<Team />} />
                    <Route path="archives" element={<Dashboard />} />
                </Route>
            </Routes>
        </>
    );
};

export default App;

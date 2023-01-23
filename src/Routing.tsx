import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AddResume from "./components/AddResume/AddResume";
import ResponsiveAppBar from "./components/layout/NavBar/ResponsiveAppBar";
import Login from './components/Login';

const Routing = () => {
    return (
        <div>
            <ResponsiveAppBar />
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/addResume" element={<AddResume />} />
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default Routing;
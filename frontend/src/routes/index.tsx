import { Routes, Route, Navigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import LoginPage from "@/pages/login";
import DashboardPage from "@/pages/dashboard";
import ConductoresPage from "@/pages/conductores/index";
import CreateConductorPage from "@/pages/conductores/create";
import ConductorDetailPage from "@/pages/conductores/detail";
import EditConductorPage from "@/pages/conductores/edit";
import MototaxisPage from "@/pages/mototaxis/index";
import CreateMototaxiPage from "@/pages/mototaxis/create";
import EditMototaxiPage from "@/pages/mototaxis/edit";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/conductores" element={<ConductoresPage />} />
        <Route path="/conductores/crear" element={<CreateConductorPage />} />
        <Route path="/conductores/:id" element={<ConductorDetailPage />} />
        <Route path="/conductores/:id/editar" element={<EditConductorPage />} />
        <Route path="/mototaxis" element={<MototaxisPage />} />
        <Route path="/mototaxis/crear" element={<CreateMototaxiPage />} />
        <Route path="/mototaxis/:id/editar" element={<EditMototaxiPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

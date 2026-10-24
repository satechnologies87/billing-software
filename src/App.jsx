import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import DashboardPage from './modules/dashboard/DashboardPage';
import ItemsPage from './modules/items/ItemsPage';
import ItemDetailsPage from './modules/items/ItemDetailsPage';
import CategoriesPage from './modules/categories/CategoriesPage';
import UnitsPage from './modules/units/UnitsPage';
import GodownsPage from './modules/godowns/GodownsPage';
import { ToastProvider } from './components/Toast';

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/app/home" replace />} />

          {/* App Layout wrapped routes */}
          <Route path="/app/home" element={<AppLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="items" element={<ItemsPage />} />
            <Route path="items/:id" element={<ItemDetailsPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="units" element={<UnitsPage />} />
            <Route path="godowns" element={<GodownsPage />} />
          </Route>

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/app/home" replace />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

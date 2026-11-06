import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { LandingPage } from '@/pages/LandingPage';
import { MarketplacePage } from '@/pages/MarketplacePage';
import { ListingDetailPage } from '@/pages/ListingDetailPage';
import { CreateListingPage } from '@/pages/CreateListingPage';
import { WantedBoardPage } from '@/pages/WantedBoardPage';
import { MessagesPage } from '@/pages/MessagesPage';
import { FavoritesPage } from '@/pages/FavoritesPage';
import { UserDashboardPage } from '@/pages/UserDashboardPage';
import { PublicProfilePage } from '@/pages/PublicProfilePage';
import { OrdersHistoryPage } from '@/pages/OrdersHistoryPage';
import { AdminDashboardPage } from '@/pages/AdminDashboardPage';
import { AuthPage } from '@/pages/AuthPage';
import { ImpactPage } from '@/pages/ImpactPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="marketplace" element={<MarketplacePage />} />
        <Route path="listing/:id" element={<ListingDetailPage />} />
        <Route path="sell" element={<CreateListingPage />} />
        <Route path="wanted" element={<WantedBoardPage />} />
        <Route path="messages" element={<MessagesPage />} />
        <Route path="favorites" element={<FavoritesPage />} />
        <Route path="dashboard" element={<UserDashboardPage />} />
        <Route path="profile/:id" element={<PublicProfilePage />} />
        <Route path="orders" element={<OrdersHistoryPage />} />
        <Route path="admin" element={<AdminDashboardPage />} />
        <Route path="auth" element={<AuthPage />} />
        <Route path="impact" element={<ImpactPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

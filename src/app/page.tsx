'use client';

import React from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { StatCards } from '../components/dashboard/StatCards';
import { TodaySchedule } from '../components/dashboard/TodaySchedule';
import { RoomsOverviewWidget } from '../components/dashboard/RoomsOverviewWidget';
import { RecentPaymentsWidget } from '../components/dashboard/RecentPaymentsWidget';
import { FaHouse } from 'react-icons/fa6';

export default function DashboardPage() {
  return (
    <div className="space-y-6 w-full">
      {/* Top Welcome & Header */}
      <PageHeader
        title="Tableau de bord"
        description="Vue globale et temps réel des activités du centre de soutien scolaire."
        badge="Session 2026/2027"
        icon={FaHouse}
      >
        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Centre Ouvert • 2 salles actives</span>
        </div>
      </PageHeader>

      {/* KPI Stats Grid */}
      <StatCards />

      {/* Main Grid: Today's Schedule & Recent Payments */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 w-full">
        <div className="xl:col-span-7">
          <TodaySchedule />
        </div>

        <div className="xl:col-span-5">
          <RecentPaymentsWidget />
        </div>
      </div>

      {/* Rooms Live Status Overview */}
      <div className="w-full">
        <RoomsOverviewWidget />
      </div>
    </div>
  );
}

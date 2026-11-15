'use client';

import React from 'react';
import {
  FaUsers,
  FaUserGraduate,
  FaBookOpen,
  FaSchool,
  FaReceipt,
  FaArrowTrendUp,
} from 'react-icons/fa6';
import { formatDH } from '../../lib/utils';
import { mockEtudiants, mockProfesseurs, mockGroupes, mockSalles, mockPaiements } from '../../data/mockData';

export function StatCards() {
  const totalEtudiants = mockEtudiants.length;
  const etudiantsActifs = mockEtudiants.filter((e) => e.statut === 'actif').length;

  const totalProfs = mockProfesseurs.length;
  const profsActifs = mockProfesseurs.filter((p) => p.statut === 'actif').length;

  const totalGroupes = mockGroupes.length;
  const groupesComplets = mockGroupes.filter((g) => g.statut === 'complet').length;

  const totalSalles = mockSalles.length;
  const sallesDisponibles = mockSalles.filter((s) => s.statut === 'disponible').length;

  const totalPaye = mockPaiements
    .filter((p) => p.statut === 'paye')
    .reduce((acc, curr) => acc + curr.montant, 0);

  const totalEnRetard = mockPaiements
    .filter((p) => p.statut === 'en_retard')
    .reduce((acc, curr) => acc + curr.montant, 0);

  const stats = [
    {
      title: 'Total Étudiants',
      value: totalEtudiants.toString(),
      subtext: `${etudiantsActifs} actifs ce mois`,
      icon: FaUsers,
      trend: '+12% ce mois',
      color: 'blue',
    },
    {
      title: 'Corps Enseignant',
      value: `${profsActifs} / ${totalProfs}`,
      subtext: 'Professeurs actifs',
      icon: FaUserGraduate,
      trend: 'Maths, PC, SVT, FR',
      color: 'indigo',
    },
    {
      title: 'Groupes d’études',
      value: totalGroupes.toString(),
      subtext: `${groupesComplets} groupes complets`,
      icon: FaBookOpen,
      trend: '88% taux remplissage',
      color: 'emerald',
    },
    {
      title: 'Salles Disponibles',
      value: `${sallesDisponibles} / ${totalSalles}`,
      subtext: 'Prêtes pour séances',
      icon: FaSchool,
      trend: 'Temps réel',
      color: 'amber',
    },
    {
      title: 'Cotisations (Novembre)',
      value: formatDH(totalPaye),
      subtext: `${formatDH(totalEnRetard)} en attente`,
      icon: FaReceipt,
      trend: 'Recouvrement 82%',
      color: 'purple',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 w-full">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {stat.title}
              </span>
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                  stat.color === 'blue'
                    ? 'bg-blue-50 text-blue-600'
                    : stat.color === 'indigo'
                    ? 'bg-indigo-50 text-indigo-600'
                    : stat.color === 'emerald'
                    ? 'bg-emerald-50 text-emerald-600'
                    : stat.color === 'amber'
                    ? 'bg-amber-50 text-amber-600'
                    : 'bg-purple-50 text-purple-600'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-3">
              <div className="text-2xl font-bold text-slate-900 tracking-tight">
                {stat.value}
              </div>
              <div className="flex items-center justify-between mt-1 text-xs text-slate-500">
                <span>{stat.subtext}</span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-medium text-slate-600">
              <FaArrowTrendUp className="w-3.5 h-3.5 text-emerald-500" />
              <span>{stat.trend}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

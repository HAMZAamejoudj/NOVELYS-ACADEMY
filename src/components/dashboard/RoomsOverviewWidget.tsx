'use client';

import React from 'react';
import { FaSchool, FaUsers, FaArrowRight, FaShieldHalved, FaWrench } from 'react-icons/fa6';
import Link from 'next/link';
import { mockSalles } from '../../data/mockData';

export function RoomsOverviewWidget() {
  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-5 w-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FaSchool className="w-5 h-5 text-teal-600" />
            <span>Occupation des Salles</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            État et disponibilité des espaces en temps réel
          </p>
        </div>
        <Link
          href="/salles"
          className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1 hover:underline"
        >
          <span>Gérer</span>
          <FaArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 w-full">
        {mockSalles.map((salle) => {
          const isOccupee = salle.statut === 'occupee';
          const isDisponible = salle.statut === 'disponible';
          const isMaintenance = salle.statut === 'maintenance';

          return (
            <div
              key={salle.id}
              className={`p-3.5 rounded-xl border transition-all ${
                isOccupee
                  ? 'bg-amber-50/40 border-amber-200/80'
                  : isDisponible
                  ? 'bg-emerald-50/30 border-emerald-200/80'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 truncate">{salle.nom}</h3>
                  <p className="text-[11px] text-slate-500">{salle.etage}</p>
                </div>
                {isDisponible && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1 shrink-0">
                    <FaShieldHalved className="w-2.5 h-2.5 text-emerald-600" />
                    Libre
                  </span>
                )}
                {isOccupee && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 flex items-center gap-1 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    En cours
                  </span>
                )}
                {isMaintenance && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 flex items-center gap-1 shrink-0">
                    <FaWrench className="w-2.5 h-2.5 text-slate-500" />
                    Maintenance
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-slate-200/60">
                <span className="flex items-center gap-1.5">
                  <FaUsers className="w-3 h-3 text-slate-400" />
                  <span>Max {salle.capacite} places</span>
                </span>
                <span className="text-[11px] text-slate-400">
                  {salle.equipements.length} équip.
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

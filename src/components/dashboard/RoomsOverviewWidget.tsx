'use client';

import React from 'react';
import {
  FaSchool,
  FaUsers,
  FaArrowRight,
  FaCircleCheck,
  FaWrench,
  FaDoorOpen,
  FaChalkboardUser,
} from 'react-icons/fa6';
import Link from 'next/link';
import { mockSalles, mockSeancesDuJour } from '../../data/mockData';

export function RoomsOverviewWidget() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 w-full">
      {/* Widget Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200/80 flex items-center justify-center text-teal-700 shrink-0">
            <FaSchool className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>Occupation des Salles</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                5 Salles
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Disponibilité en direct et séances en cours dans le centre
            </p>
          </div>
        </div>

        <Link
          href="/salles"
          className="text-xs font-semibold text-teal-700 hover:text-teal-800 bg-teal-50/70 hover:bg-teal-100/80 px-3 py-1.5 rounded-lg border border-teal-200/60 flex items-center gap-1.5 transition-all self-start sm:self-auto cursor-pointer"
        >
          <span>Planning & Gestion des Salles</span>
          <FaArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 w-full">
        {mockSalles.map((salle) => {
          const isOccupee = salle.statut === 'occupee';
          const isDisponible = salle.statut === 'disponible';
          const isMaintenance = salle.statut === 'maintenance';

          // Match active ongoing session
          const currentSeance = mockSeancesDuJour.find(
            (s) => s.salleId === salle.id && (s.statut === 'en_cours' || s.statut === 'a_venir')
          );

          return (
            <div
              key={salle.id}
              className={`group rounded-xl border p-4 transition-all duration-200 flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 ${
                isOccupee
                  ? 'bg-gradient-to-b from-amber-50/60 to-white border-amber-200/90 shadow-2xs'
                  : isDisponible
                  ? 'bg-gradient-to-b from-emerald-50/50 to-white border-emerald-200/90 shadow-2xs'
                  : 'bg-gradient-to-b from-slate-50/80 to-white border-slate-200 shadow-2xs'
              }`}
            >
              {/* Card Header: Icon + Status Pill */}
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-colors ${
                    isOccupee
                      ? 'bg-amber-100 text-amber-800'
                      : isDisponible
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  <FaDoorOpen className="w-4 h-4" />
                </div>

                {isDisponible && (
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-100/90 text-emerald-800 border border-emerald-200 flex items-center gap-1.5 shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Disponible</span>
                  </span>
                )}

                {isOccupee && (
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-100/90 text-amber-800 border border-amber-200 flex items-center gap-1.5 shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    <span>En cours</span>
                  </span>
                )}

                {isMaintenance && (
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-300 flex items-center gap-1.5 shadow-2xs">
                    <FaWrench className="w-2.5 h-2.5 text-slate-500" />
                    <span>Maintenance</span>
                  </span>
                )}
              </div>

              {/* Room Name & Floor */}
              <div className="mb-3">
                <h3
                  className="text-sm font-bold text-slate-900 group-hover:text-teal-700 transition-colors leading-snug line-clamp-1"
                  title={salle.nom}
                >
                  {salle.nom}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">{salle.etage}</p>
              </div>

              {/* Ongoing Session or Status Note */}
              <div className="min-h-[38px] mb-3 p-2 rounded-lg bg-white/80 border border-slate-100 text-xs flex items-center gap-2">
                {isOccupee && currentSeance ? (
                  <div className="leading-tight truncate">
                    <p className="font-semibold text-amber-900 truncate text-[11px]">
                      {currentSeance.groupeNom}
                    </p>
                    <p className="text-[10px] text-amber-700 truncate">
                      {currentSeance.heureDebut} - {currentSeance.heureFin}
                    </p>
                  </div>
                ) : isDisponible ? (
                  <p className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                    <FaCircleCheck className="w-3 h-3 text-emerald-500 shrink-0" />
                    <span>Libre pour réservation</span>
                  </p>
                ) : (
                  <p className="text-[11px] text-slate-500 italic">Travaux / Entretien</p>
                )}
              </div>

              {/* Footer: Capacity & Equipments */}
              <div className="flex items-center justify-between text-xs text-slate-500 pt-2.5 border-t border-slate-100 mt-auto">
                <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                  <FaUsers className="w-3.5 h-3.5 text-slate-400" />
                  <span>{salle.capacite} places</span>
                </span>
                <span className="text-[11px] text-slate-400 font-medium">
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

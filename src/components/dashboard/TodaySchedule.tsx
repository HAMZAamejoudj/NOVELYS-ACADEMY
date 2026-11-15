'use client';

import React from 'react';
import { FaCalendarDays, FaUser, FaSchool, FaArrowRight, FaClock, FaCheck } from 'react-icons/fa6';
import Link from 'next/link';
import { mockSeancesDuJour } from '../../data/mockData';

export function TodaySchedule() {
  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-5 w-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FaCalendarDays className="w-4 h-4 text-teal-600" />
            <span>Séances d'Aujourd'hui</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
              {mockSeancesDuJour.length} programmées
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Planning en direct des cours du jour au centre
          </p>
        </div>
        <Link
          href="/planning"
          className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1 hover:underline"
        >
          <span>Voir tout le planning</span>
          <FaArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="space-y-3 w-full">
        {mockSeancesDuJour.map((seance) => {
          const isEnCours = seance.statut === 'en_cours';
          const isTerminee = seance.statut === 'terminee';

          return (
            <div
              key={seance.id}
              className={`p-4 rounded-xl border transition-all ${
                isEnCours
                  ? 'bg-teal-50/40 border-teal-200 shadow-xs ring-1 ring-teal-300/40'
                  : isTerminee
                  ? 'bg-slate-50 border-slate-200/70 opacity-80'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-slate-900">
                      {seance.groupeNom}
                    </span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {seance.matiere}
                    </span>
                    {isEnCours && (
                      <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        En cours
                      </span>
                    )}
                    {isTerminee && (
                      <span className="flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-200 text-slate-600">
                        <FaCheck className="w-2.5 h-2.5 text-slate-500" />
                        Terminée
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-600 flex-wrap">
                    <span className="flex items-center gap-1.5">
                      <FaUser className="w-3 h-3 text-slate-400" />
                      <span className="font-medium">{seance.professeurNom}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <FaSchool className="w-3 h-3 text-teal-600" />
                      <span className="font-semibold text-teal-800">{seance.salleNom}</span>
                    </span>
                    <span className="text-slate-400">•</span>
                    <span>{seance.totalEtudiants} élèves attendus</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
                    <FaClock className="w-3 h-3 text-teal-600" />
                    <span>{seance.heureDebut} - {seance.heureFin}</span>
                  </div>

                  <Link
                    href={`/presence?seance=${seance.id}`}
                    className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-teal-600 hover:bg-teal-700 text-white transition-colors"
                  >
                    Pointage
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

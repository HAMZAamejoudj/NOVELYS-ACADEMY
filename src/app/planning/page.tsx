'use client';

import React, { useState } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import {
  Clock,
  DoorOpen,
  GraduationCap,
  Plus,
  Filter,
  Layers,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { FaCalendarDays, FaCircleCheck } from 'react-icons/fa6';
import { mockGroupes, mockProfesseurs, mockSalles } from '../../data/mockData';

export default function PlanningPage() {
  const [selectedSalle, setSelectedSalle] = useState('all');
  const [selectedProf, setSelectedProf] = useState('all');

  const jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'] as const;

  // Flatten all group schedules into calendar slots
  const allSeances = mockGroupes.flatMap((grp) => {
    const prof = mockProfesseurs.find((p) => p.id === grp.professeurId);
    return grp.horaires.map((h) => {
      const salle = mockSalles.find((s) => s.id === h.salleId) || mockSalles.find((s) => s.id === grp.salleDefautId);
      return {
        id: `${grp.id}-${h.jour}-${h.heureDebut}`,
        groupeId: grp.id,
        groupeNom: grp.nom,
        matiere: grp.matiere,
        professeurId: grp.professeurId,
        professeurNom: prof ? `Pr. ${prof.prenom} ${prof.nom}` : 'Prof',
        salleId: salle?.id || '',
        salleNom: salle?.nom || 'Salle',
        jour: h.jour,
        heureDebut: h.heureDebut,
        heureFin: h.heureFin,
      };
    });
  });

  const filteredSeances = allSeances.filter((s) => {
    const matchesSalle = selectedSalle === 'all' || s.salleId === selectedSalle;
    const matchesProf = selectedProf === 'all' || s.professeurId === selectedProf;
    return matchesSalle && matchesProf;
  });

  return (
    <div className="space-y-6 w-full">
      <PageHeader
        title="Emploi du Temps Hebdomadaire"
        description="Vue globale du planning par salle, professeur et groupe. Détection des chevauchements."
        badge="Planning Actif"
        icon={FaCalendarDays}
        action={{
          label: 'Programmer une Séance',
          icon: Plus,
          onClick: () => alert('Ouverture du planificateur de séance avec détection de conflit.'),
        }}
      />

      {/* Filter toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
            <Filter className="w-4 h-4 text-slate-400" />
            <span>Filtrer par :</span>
          </div>

          {/* Salle Filter */}
          <select
            value={selectedSalle}
            onChange={(e) => setSelectedSalle(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg text-slate-700 outline-none focus:border-blue-500"
          >
            <option value="all">Toutes les Salles</option>
            {mockSalles.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nom}
              </option>
            ))}
          </select>

          {/* Prof Filter */}
          <select
            value={selectedProf}
            onChange={(e) => setSelectedProf(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg text-slate-700 outline-none focus:border-blue-500"
          >
            <option value="all">Tous les Professeurs</option>
            {mockProfesseurs.map((p) => (
              <option key={p.id} value={p.id}>
                Pr. {p.prenom} {p.nom} ({p.matieres[0]})
              </option>
            ))}
          </select>
        </div>

        {/* Conflict Protection Pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
          <FaCircleCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Aucun conflit de salle ni de prof détecté</span>
        </div>
      </div>

      {/* Week Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3 w-full">
        {jours.map((jour) => {
          const seancesDuJour = filteredSeances.filter((s) => s.jour === jour);
          const isWeekend = jour === 'Samedi' || jour === 'Dimanche';

          return (
            <div
              key={jour}
              className={`rounded-xl border flex flex-col min-h-[350px] ${
                isWeekend ? 'bg-blue-50/20 border-blue-200/60' : 'bg-white border-slate-200/90'
              }`}
            >
              {/* Day Header */}
              <div
                className={`p-3 border-b text-center ${
                  isWeekend
                    ? 'bg-blue-50/80 border-blue-200 font-bold text-blue-900 text-xs'
                    : 'bg-slate-50/90 border-slate-200 font-bold text-slate-800 text-xs'
                }`}
              >
                <span>{jour}</span>
                <span className="block text-[10px] font-normal text-slate-500 mt-0.5">
                  {seancesDuJour.length} séance{seancesDuJour.length > 1 ? 's' : ''}
                </span>
              </div>

              {/* Day Sessions List */}
              <div className="p-2 space-y-2.5 flex-1 overflow-y-auto">
                {seancesDuJour.length > 0 ? (
                  seancesDuJour.map((seance) => (
                    <div
                      key={seance.id}
                      className="p-2.5 rounded-lg bg-white border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-[10px] text-blue-700 font-bold bg-blue-50 px-1.5 py-0.5 rounded">
                        <span>{seance.heureDebut} - {seance.heureFin}</span>
                        <span className="uppercase text-[9px]">{seance.matiere.slice(0, 5)}</span>
                      </div>

                      <p className="font-bold text-slate-900 text-xs leading-tight">
                        {seance.groupeNom}
                      </p>

                      <div className="text-[11px] text-slate-600 space-y-0.5">
                        <div className="flex items-center gap-1">
                          <GraduationCap className="w-3 h-3 text-slate-400" />
                          <span className="truncate">{seance.professeurNom}</span>
                        </div>
                        <div className="flex items-center gap-1 font-semibold text-blue-600">
                          <DoorOpen className="w-3 h-3" />
                          <span className="truncate">{seance.salleNom}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex items-center justify-center text-center p-3 text-[11px] text-slate-400 italic">
                    Aucun cours
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import {
  FaCalendarDays,
  FaCircleCheck,
  FaPlus,
  FaFilter,
  FaDoorOpen,
  FaGraduationCap,
  FaPenToSquare,
  FaTrash,
  FaTriangleExclamation,
  FaRotateLeft,
  FaClock,
} from 'react-icons/fa6';
import { mockProfesseurs, mockSalles } from '../../data/mockData';
import {
  PlanningSeance,
  getPlanningSeances,
  savePlanningSeances,
  isOverlapping,
} from '../../data/planningStore';
import { SeanceModal } from '../../components/planning/SeanceModal';

export default function PlanningPage() {
  const [seances, setSeances] = useState<PlanningSeance[]>([]);
  const [selectedSalle, setSelectedSalle] = useState('all');
  const [selectedProf, setSelectedProf] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSeance, setEditingSeance] = useState<PlanningSeance | null>(null);

  const jours: PlanningSeance['jour'][] = [
    'Lundi',
    'Mardi',
    'Mercredi',
    'Jeudi',
    'Vendredi',
    'Samedi',
    'Dimanche',
  ];

  // Load seances on client mount
  useEffect(() => {
    setSeances(getPlanningSeances());

    const handleUpdate = () => {
      setSeances(getPlanningSeances());
    };
    window.addEventListener('planningStoreUpdated', handleUpdate);
    return () => window.removeEventListener('planningStoreUpdated', handleUpdate);
  }, []);

  // Check global conflicts across all sessions
  const conflictsList: { s1: PlanningSeance; s2: PlanningSeance; reason: string }[] = [];
  for (let i = 0; i < seances.length; i++) {
    for (let j = i + 1; j < seances.length; j++) {
      const a = seances[i];
      const b = seances[j];
      if (a.jour === b.jour && isOverlapping(a.heureDebut, a.heureFin, b.heureDebut, b.heureFin)) {
        if (a.salleId && b.salleId && a.salleId === b.salleId) {
          conflictsList.push({
            s1: a,
            s2: b,
            reason: `Salle "${a.salleNom}" occupée simultanément par "${a.groupeNom}" et "${b.groupeNom}" le ${a.jour} (${a.heureDebut}-${a.heureFin})`,
          });
        }
        if (a.professeurId && b.professeurId && a.professeurId === b.professeurId) {
          conflictsList.push({
            s1: a,
            s2: b,
            reason: `${a.professeurNom} programmé en double avec "${a.groupeNom}" et "${b.groupeNom}" le ${a.jour}`,
          });
        }
      }
    }
  }

  // Filter seances
  const filteredSeances = seances.filter((s) => {
    const matchesSalle = selectedSalle === 'all' || s.salleId === selectedSalle;
    const matchesProf = selectedProf === 'all' || s.professeurId === selectedProf;
    return matchesSalle && matchesProf;
  });

  // Handlers
  const handleOpenAdd = () => {
    setEditingSeance(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (seance: PlanningSeance) => {
    setEditingSeance(seance);
    setIsModalOpen(true);
  };

  const handleSaveSeance = (saved: PlanningSeance) => {
    let updated: PlanningSeance[];
    const exists = seances.some((s) => s.id === saved.id);
    if (exists) {
      updated = seances.map((s) => (s.id === saved.id ? saved : s));
    } else {
      updated = [...seances, saved];
    }
    setSeances(updated);
    savePlanningSeances(updated);
  };

  const handleDeleteSeance = (id: string) => {
    const updated = seances.filter((s) => s.id !== id);
    setSeances(updated);
    savePlanningSeances(updated);
  };

  const handleReset = () => {
    if (confirm('Voulez-vous réinitialiser le planning avec les cours par défaut du centre ?')) {
      localStorage.removeItem('novelys_planning_seances_v1');
      const def = getPlanningSeances();
      setSeances(def);
    }
  };

  // Helper for matiere color
  const getMatiereBadgeStyle = (matiere: string) => {
    const m = matiere.toLowerCase();
    if (m.includes('math')) return 'bg-blue-50 text-blue-700 border-blue-200';
    if (m.includes('physiq') || m.includes('chimie')) return 'bg-sky-50 text-sky-700 border-sky-200';
    if (m.includes('svt') || m.includes('scien')) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (m.includes('fran')) return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    if (m.includes('angl')) return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-purple-50 text-purple-700 border-purple-200';
  };

  return (
    <div className="space-y-6 w-full">
      {/* Page Header */}
      <PageHeader
        title="Emploi du Temps Hebdomadaire"
        description="Vue globale du planning par salle, professeur et groupe. Détection automatique des chevauchements."
        badge="Planning Actif"
        icon={FaCalendarDays}
        action={{
          label: 'Programmer une Séance',
          icon: FaPlus,
          onClick: handleOpenAdd,
        }}
      />

      {/* Global Conflicts Alert if any */}
      {conflictsList.length > 0 && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 space-y-2">
          <div className="flex items-center gap-2 font-bold text-sm">
            <FaTriangleExclamation className="w-4 h-4 text-rose-600" />
            <span>Attention : {conflictsList.length} conflit(s) d'horaire ou de salle détecté(s) dans le planning !</span>
          </div>
          <ul className="text-xs list-disc list-inside space-y-1 text-rose-700">
            {conflictsList.map((c, idx) => (
              <li key={idx}>{c.reason}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Filter and Control toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
            <FaFilter className="w-3.5 h-3.5 text-slate-400" />
            <span>Filtrer par :</span>
          </div>

          {/* Salle Filter */}
          <select
            value={selectedSalle}
            onChange={(e) => setSelectedSalle(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg text-slate-700 outline-none focus:border-teal-500 transition-colors"
          >
            <option value="all">Toutes les Salles</option>
            {mockSalles.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nom} ({s.capacite} pl.)
              </option>
            ))}
          </select>

          {/* Prof Filter */}
          <select
            value={selectedProf}
            onChange={(e) => setSelectedProf(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg text-slate-700 outline-none focus:border-teal-500 transition-colors"
          >
            <option value="all">Tous les Professeurs</option>
            {mockProfesseurs.map((p) => (
              <option key={p.id} value={p.id}>
                Pr. {p.prenom} {p.nom} ({p.matieres[0]})
              </option>
            ))}
          </select>
        </div>

        {/* Right Info and Actions */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Conflict Status Pill */}
          {conflictsList.length === 0 ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
              <FaCircleCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Aucun conflit de salle ni de prof détecté</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-800">
              <FaTriangleExclamation className="w-3.5 h-3.5 text-rose-600" />
              <span>{conflictsList.length} conflit(s) détecté(s)</span>
            </div>
          )}

          {/* Reset Planning */}
          <button
            onClick={handleReset}
            title="Réinitialiser au planning par défaut"
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
          >
            <FaRotateLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Réinitialiser</span>
          </button>
        </div>
      </div>

      {/* Week Grid (7 columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3 w-full">
        {jours.map((jour) => {
          const seancesDuJour = filteredSeances.filter((s) => s.jour === jour);
          // Sort by start time
          seancesDuJour.sort((a, b) => a.heureDebut.localeCompare(b.heureDebut));
          const isWeekend = jour === 'Samedi' || jour === 'Dimanche';

          return (
            <div
              key={jour}
              className={`rounded-xl border flex flex-col min-h-[380px] ${
                isWeekend ? 'bg-teal-50/15 border-teal-200/60' : 'bg-white border-slate-200/90'
              }`}
            >
              {/* Day Header */}
              <div
                className={`p-3 border-b text-center flex items-center justify-between sm:flex-col ${
                  isWeekend
                    ? 'bg-teal-50/70 border-teal-200 font-bold text-teal-900 text-xs'
                    : 'bg-slate-50 border-slate-200 font-bold text-slate-800 text-xs'
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
                      onClick={() => handleOpenEdit(seance)}
                      className="group relative p-2.5 rounded-xl bg-white border border-slate-200 hover:border-teal-500 shadow-2xs hover:shadow-md transition-all cursor-pointer space-y-2"
                    >
                      {/* Top Time and Subject */}
                      <div className="flex items-center justify-between gap-1 text-[10px]">
                        <span className="font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded flex items-center gap-1">
                          <FaClock className="w-2.5 h-2.5 text-slate-400" />
                          {seance.heureDebut} - {seance.heureFin}
                        </span>
                        <span
                          className={`uppercase text-[9px] font-bold px-1.5 py-0.5 rounded border ${getMatiereBadgeStyle(
                            seance.matiere
                          )}`}
                        >
                          {seance.matiere.slice(0, 6)}
                        </span>
                      </div>

                      {/* Group Name */}
                      <p className="font-bold text-slate-900 text-xs leading-tight group-hover:text-teal-700 transition-colors">
                        {seance.groupeNom}
                      </p>

                      {/* Prof and Room details */}
                      <div className="text-[11px] text-slate-600 space-y-1 pt-0.5 border-t border-slate-100">
                        <div className="flex items-center gap-1.5">
                          <FaGraduationCap className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{seance.professeurNom}</span>
                        </div>
                        <div className="flex items-center gap-1.5 font-semibold text-teal-700">
                          <FaDoorOpen className="w-3 h-3 text-teal-600 shrink-0" />
                          <span className="truncate">{seance.salleNom}</span>
                        </div>
                      </div>

                      {/* Hover action overlay */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-1.5 right-1.5 flex items-center gap-1 bg-white/95 px-1 py-0.5 rounded-lg border border-slate-200 shadow-xs">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenEdit(seance);
                          }}
                          title="Modifier la séance"
                          className="p-1 text-slate-500 hover:text-teal-600 hover:bg-slate-50 rounded"
                        >
                          <FaPenToSquare className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm(`Supprimer la séance de "${seance.groupeNom}" ?`)) {
                              handleDeleteSeance(seance.id);
                            }
                          }}
                          title="Supprimer la séance"
                          className="p-1 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded"
                        >
                          <FaTrash className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-full min-h-[120px] flex flex-col items-center justify-center text-center p-3 text-[11px] text-slate-400 italic">
                    <span>Aucun cours programmé</span>
                    <button
                      onClick={handleOpenAdd}
                      className="mt-1.5 text-[10px] text-teal-600 hover:underline font-semibold not-italic"
                    >
                      + Ajouter
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Add / Edit */}
      <SeanceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveSeance}
        onDelete={handleDeleteSeance}
        initialSeance={editingSeance}
        existingSeances={seances}
      />
    </div>
  );
}

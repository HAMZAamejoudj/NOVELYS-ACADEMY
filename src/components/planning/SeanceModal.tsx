'use client';

import React, { useState, useEffect } from 'react';
import {
  FaXmark,
  FaCalendarDays,
  FaClock,
  FaDoorOpen,
  FaGraduationCap,
  FaUsers,
  FaTriangleExclamation,
  FaCheck,
  FaTrash,
} from 'react-icons/fa6';
import { mockGroupes, mockProfesseurs, mockSalles } from '../../data/mockData';
import {
  PlanningSeance,
  detectConflict,
  ConflictResult,
} from '../../data/planningStore';

interface SeanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (seance: PlanningSeance) => void;
  onDelete?: (id: string) => void;
  initialSeance?: PlanningSeance | null;
  existingSeances: PlanningSeance[];
}

const JOURS: PlanningSeance['jour'][] = [
  'Lundi',
  'Mardi',
  'Mercredi',
  'Jeudi',
  'Vendredi',
  'Samedi',
  'Dimanche',
];

export function SeanceModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  initialSeance,
  existingSeances,
}: SeanceModalProps) {
  const [groupeId, setGroupeId] = useState('');
  const [groupeNom, setGroupeNom] = useState('');
  const [matiere, setMatiere] = useState('');
  const [professeurId, setProfesseurId] = useState('');
  const [salleId, setSalleId] = useState('');
  const [jour, setJour] = useState<PlanningSeance['jour']>('Lundi');
  const [heureDebut, setHeureDebut] = useState('17:30');
  const [heureFin, setHeureFin] = useState('19:30');
  const [conflict, setConflict] = useState<ConflictResult>({ hasConflict: false });

  useEffect(() => {
    if (initialSeance) {
      setGroupeId(initialSeance.groupeId);
      setGroupeNom(initialSeance.groupeNom);
      setMatiere(initialSeance.matiere);
      setProfesseurId(initialSeance.professeurId);
      setSalleId(initialSeance.salleId);
      setJour(initialSeance.jour);
      setHeureDebut(initialSeance.heureDebut);
      setHeureFin(initialSeance.heureFin);
    } else {
      // Default to first group
      const firstGrp = mockGroupes[0];
      if (firstGrp) {
        setGroupeId(firstGrp.id);
        setGroupeNom(firstGrp.nom);
        setMatiere(firstGrp.matiere);
        setProfesseurId(firstGrp.professeurId);
        setSalleId(firstGrp.salleDefautId || mockSalles[0].id);
      }
      setJour('Lundi');
      setHeureDebut('17:30');
      setHeureFin('19:30');
    }
  }, [initialSeance, isOpen]);

  // Real-time conflict detection
  useEffect(() => {
    if (!salleId || !professeurId || !heureDebut || !heureFin) return;

    const res = detectConflict(
      {
        id: initialSeance?.id,
        jour,
        heureDebut,
        heureFin,
        salleId,
        professeurId,
      },
      existingSeances
    );
    setConflict(res);
  }, [salleId, professeurId, jour, heureDebut, heureFin, existingSeances, initialSeance]);

  const handleGroupChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const gId = e.target.value;
    setGroupeId(gId);
    const grp = mockGroupes.find((g) => g.id === gId);
    if (grp) {
      setGroupeNom(grp.nom);
      setMatiere(grp.matiere);
      setProfesseurId(grp.professeurId);
      if (grp.salleDefautId) {
        setSalleId(grp.salleDefautId);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (conflict.hasConflict) {
      alert(`Impossible d'enregistrer : ${conflict.message}`);
      return;
    }

    const prof = mockProfesseurs.find((p) => p.id === professeurId);
    const salle = mockSalles.find((s) => s.id === salleId);

    const updatedSeance: PlanningSeance = {
      id: initialSeance?.id || `seance-${Date.now()}`,
      groupeId,
      groupeNom: groupeNom || 'Groupe',
      matiere: matiere || 'Matière',
      professeurId,
      professeurNom: prof ? `Pr. ${prof.prenom} ${prof.nom}` : 'Professeur',
      salleId,
      salleNom: salle?.nom || 'Salle',
      jour,
      heureDebut,
      heureFin,
    };

    onSave(updatedSeance);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center">
              <FaCalendarDays className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {initialSeance ? 'Modifier la Séance' : 'Programmer une Nouvelle Séance'}
              </h3>
              <p className="text-xs text-slate-500">
                Gestion des horaires, de la salle et du professeur avec vérification de conflit.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <FaXmark className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Groupe */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <FaUsers className="w-3.5 h-3.5 text-slate-400" />
              <span>Groupe & Niveau</span>
            </label>
            <select
              value={groupeId}
              onChange={handleGroupChange}
              required
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:border-teal-600 outline-none transition-colors"
            >
              {mockGroupes.map((grp) => (
                <option key={grp.id} value={grp.id}>
                  {grp.nom} ({grp.matiere})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Professeur */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <FaGraduationCap className="w-3.5 h-3.5 text-slate-400" />
                <span>Enseignant</span>
              </label>
              <select
                value={professeurId}
                onChange={(e) => setProfesseurId(e.target.value)}
                required
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:border-teal-600 outline-none"
              >
                {mockProfesseurs.map((p) => (
                  <option key={p.id} value={p.id}>
                    Pr. {p.prenom} {p.nom}
                  </option>
                ))}
              </select>
            </div>

            {/* Salle */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <FaDoorOpen className="w-3.5 h-3.5 text-slate-400" />
                <span>Salle de Cours</span>
              </label>
              <select
                value={salleId}
                onChange={(e) => setSalleId(e.target.value)}
                required
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:border-teal-600 outline-none"
              >
                {mockSalles.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nom} ({s.capacite} places)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Jour */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Jour</label>
              <select
                value={jour}
                onChange={(e) => setJour(e.target.value as PlanningSeance['jour'])}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:border-teal-600 outline-none"
              >
                {JOURS.map((j) => (
                  <option key={j} value={j}>
                    {j}
                  </option>
                ))}
              </select>
            </div>

            {/* Heure Début */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                <FaClock className="w-3 h-3 text-slate-400" />
                <span>Début</span>
              </label>
              <input
                type="time"
                value={heureDebut}
                onChange={(e) => setHeureDebut(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:border-teal-600 outline-none"
              />
            </div>

            {/* Heure Fin */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                <FaClock className="w-3 h-3 text-slate-400" />
                <span>Fin</span>
              </label>
              <input
                type="time"
                value={heureFin}
                onChange={(e) => setHeureFin(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:border-teal-600 outline-none"
              />
            </div>
          </div>

          {/* Real-time Conflict Alert */}
          {conflict.hasConflict ? (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
              <FaTriangleExclamation className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Alerte de Chevauchement détectée !</p>
                <p className="text-[11px] mt-0.5 leading-relaxed">{conflict.message}</p>
              </div>
            </div>
          ) : (
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <FaCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span className="font-semibold">Créneau horaire et salle disponibles. Aucun conflit.</span>
            </div>
          )}

          {/* Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
            {initialSeance && onDelete ? (
              <button
                type="button"
                onClick={() => {
                  if (confirm('Voulez-vous vraiment supprimer cette séance du planning ?')) {
                    onDelete(initialSeance.id);
                    onClose();
                  }
                }}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 flex items-center gap-1.5 transition-colors"
              >
                <FaTrash className="w-3 h-3" />
                <span>Supprimer</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={conflict.hasConflict}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-xs transition-colors flex items-center gap-1.5"
              >
                <FaCheck className="w-3.5 h-3.5" />
                <span>{initialSeance ? 'Enregistrer les modifications' : 'Confirmer la Programmation'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

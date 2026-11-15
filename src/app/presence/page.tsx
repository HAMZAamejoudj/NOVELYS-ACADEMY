'use client';

import React, { useState } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import {
  UserCheck,
  Save,
  DoorOpen,
  GraduationCap,
  Layers,
  Sparkles,
} from 'lucide-react';
import {
  FaClipboardCheck,
  FaCircleCheck,
  FaCircleXmark,
  FaClock,
} from 'react-icons/fa6';
import { mockSeancesDuJour, mockGroupes, mockEtudiants } from '../../data/mockData';
import { StatutPresence } from '../../types';

export default function PresencePage() {
  const [selectedSeanceId, setSelectedSeanceId] = useState(mockSeancesDuJour[0]?.id || '');
  const activeSeance = mockSeancesDuJour.find((s) => s.id === selectedSeanceId) || mockSeancesDuJour[0];

  // Students in this session's group
  const studentsInGroup = mockEtudiants.filter((e) =>
    e.groupesIds.includes(activeSeance.groupeId)
  );

  // Attendance state dictionary { studentId: StatutPresence }
  const [attendance, setAttendance] = useState<Record<string, StatutPresence>>(() => {
    const initial: Record<string, StatutPresence> = {};
    mockEtudiants.forEach((e) => {
      initial[e.id] = 'present';
    });
    return initial;
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleStatusChange = (studentId: string, status: StatutPresence) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const countPresent = studentsInGroup.filter((s) => (attendance[s.id] || 'present') === 'present').length;
  const countAbsent = studentsInGroup.filter((s) => attendance[s.id] === 'absent').length;
  const countRetard = studentsInGroup.filter((s) => attendance[s.id] === 'retard').length;

  return (
    <div className="space-y-6 w-full">
      <PageHeader
        title="Pointage & Suivi des Présences"
        description="Enregistrez la présence des élèves par séance en un clic."
        badge="Feuille d'émargement"
        icon={FaClipboardCheck}
        action={{
          label: 'Enregistrer la Présence',
          icon: Save,
          onClick: handleSave,
        }}
      />

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center gap-2 animate-in fade-in">
          <FaCircleCheck className="w-5 h-5 text-emerald-600" />
          <span>Feuille de présence enregistrée avec succès ! Les absences sont notifiées.</span>
        </div>
      )}

      {/* Session Selector Card */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
            Sélectionner la séance à pointer :
          </label>
          <select
            value={selectedSeanceId}
            onChange={(e) => setSelectedSeanceId(e.target.value)}
            className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-800 outline-none focus:border-blue-500"
          >
            {mockSeancesDuJour.map((s) => (
              <option key={s.id} value={s.id}>
                {s.groupeNom} • {s.salleNom} ({s.heureDebut} - {s.heureFin})
              </option>
            ))}
          </select>
        </div>

        {/* Quick summary badges */}
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Présents : {countPresent}</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>Absents : {countAbsent}</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>Retards : {countRetard}</span>
          </div>
        </div>
      </div>

      {/* Students Roll Call List */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 text-sm">
              Liste d'appel • {activeSeance.groupeNom}
            </span>
            <span className="text-xs text-slate-500">
              ({studentsInGroup.length} élèves inscrits dans ce groupe)
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <DoorOpen className="w-4 h-4 text-blue-600" />
            <span>{activeSeance.salleNom}</span>
            <span>•</span>
            <GraduationCap className="w-4 h-4 text-indigo-600" />
            <span>{activeSeance.professeurNom}</span>
          </div>
        </div>

        {studentsInGroup.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {studentsInGroup.map((etudiant) => {
              const currentStatus = attendance[etudiant.id] || 'present';

              return (
                <div
                  key={etudiant.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                      {etudiant.prenom[0]}
                      {etudiant.nom[0]}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">
                        {etudiant.nom} {etudiant.prenom}
                      </p>
                      <p className="text-xs text-slate-400">
                        {etudiant.niveau} • Tél: {etudiant.telephone}
                      </p>
                    </div>
                  </div>

                  {/* Attendance buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleStatusChange(etudiant.id, 'present')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        currentStatus === 'present'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <FaCircleCheck className="w-3.5 h-3.5" />
                      <span>Présent</span>
                    </button>

                    <button
                      onClick={() => handleStatusChange(etudiant.id, 'absent')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        currentStatus === 'absent'
                          ? 'bg-rose-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <FaCircleXmark className="w-3.5 h-3.5" />
                      <span>Absent</span>
                    </button>

                    <button
                      onClick={() => handleStatusChange(etudiant.id, 'retard')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        currentStatus === 'retard'
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <FaClock className="w-3.5 h-3.5" />
                      <span>En retard</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center text-slate-400 text-sm">
            Aucun étudiant inscrit dans ce groupe pour le moment.
          </div>
        )}
      </div>
    </div>
  );
}

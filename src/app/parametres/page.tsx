'use client';

import React, { useState } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import {
  School,
  Bell,
  Save,
  Plus,
  BookOpen,
} from 'lucide-react';
import Link from 'next/link';
import {
  FaGear,
  FaCircleCheck,
  FaPenToSquare,
  FaTrashCan,
  FaCheck,
  FaXmark,
  FaBookBookmark,
  FaRotateLeft,
  FaArrowRight,
} from 'react-icons/fa6';
import { useMatieres } from '../../data/matieresStore';

export default function ParametresPage() {
  const [centreNom, setCentreNom] = useState('Novelys Academy');
  const [telephone, setTelephone] = useState('0537-889900');
  const [adresse, setAdresse] = useState('Avenue Hassan II, Rabat');
  const [anneeScolaire, setAnneeScolaire] = useState('2026/2027');
  const [saved, setSaved] = useState(false);

  // Matières Management
  const { matieres, addMatiere, updateMatiere, deleteMatiere, resetToDefault } = useMatieres();
  const [newMatiereInput, setNewMatiereInput] = useState('');
  const [editingMatiere, setEditingMatiere] = useState<string | null>(null);
  const [editMatiereValue, setEditMatiereValue] = useState('');
  const [matiereFeedback, setMatiereFeedback] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleAddMatiereSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMatiereInput.trim()) return;

    const ok = addMatiere(newMatiereInput);
    if (ok) {
      setMatiereFeedback(`Matière "${newMatiereInput.trim()}" ajoutée avec succès !`);
      setNewMatiereInput('');
    } else {
      setMatiereFeedback('Cette matière existe déjà.');
    }
    setTimeout(() => setMatiereFeedback(null), 3000);
  };

  const startEditMatiere = (mat: string) => {
    setEditingMatiere(mat);
    setEditMatiereValue(mat);
  };

  const saveEditMatiere = (oldNom: string) => {
    if (!editMatiereValue.trim()) return;
    const ok = updateMatiere(oldNom, editMatiereValue);
    if (ok) {
      setMatiereFeedback(`Matière renommée en "${editMatiereValue.trim()}" !`);
      setEditingMatiere(null);
    } else {
      setMatiereFeedback('Une autre matière porte déjà ce nom.');
    }
    setTimeout(() => setMatiereFeedback(null), 3000);
  };

  return (
    <div className="space-y-6 w-full">
      <PageHeader
        title="Paramètres de la Plateforme"
        description="Gérez les informations du centre, configurez les matières enseignées et surveillez la synchronisation Supabase."
        icon={FaGear}
      />

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center gap-2">
          <FaCircleCheck className="w-5 h-5 text-emerald-600" />
          <span>Paramètres sauvegardés avec succès !</span>
        </div>
      )}

      {matiereFeedback && (
        <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-sm font-semibold flex items-center gap-2">
          <FaCircleCheck className="w-5 h-5 text-blue-600" />
          <span>{matiereFeedback}</span>
        </div>
      )}

      {/* Section Gestion des Matières */}
      <div id="matieres" className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
            <FaBookBookmark className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>Gestion des Matières Enseignées</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                {matieres.length} matières actives
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Gérez le catalogue officiel des matières sur sa propre page dédiée.
            </p>
          </div>
        </div>

        <Link
          href="/matieres"
          className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <span>Ouvrir la page Matières</span>
          <FaArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Center Info Form */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/90 shadow-xs p-6">
          <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <School className="w-5 h-5 text-blue-600" />
            <span>Informations Générales du Centre</span>
          </h2>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nom officiel du Centre
              </label>
              <input
                type="text"
                value={centreNom}
                onChange={(e) => setCentreNom(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Téléphone Fixe / Standard
                </label>
                <input
                  type="text"
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Année Scolaire Active
                </label>
                <input
                  type="text"
                  value={anneeScolaire}
                  onChange={(e) => setAnneeScolaire(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Adresse Complète
              </label>
              <input
                type="text"
                value={adresse}
                onChange={(e) => setAdresse(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500"
              />
            </div>

            <div className="pt-3">
              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Enregistrer les modifications</span>
              </button>
            </div>
          </form>
        </div>

        {/* Notifications & Alerts */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-6 h-fit">
          <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Bell className="w-4 h-4 text-blue-600" />
            <span>Alertes & Notifications</span>
          </h3>
          <div className="space-y-3 text-xs text-slate-600">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded text-blue-600" />
              <span>Alerte automatique si une salle est en conflit</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded text-blue-600" />
              <span>Rappel des cotisations impayées chaque fin de mois</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded text-blue-600" />
              <span>Notification WhatsApp pour les absences non justifiées</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

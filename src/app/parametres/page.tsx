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
import {
  FaGear,
  FaCircleCheck,
  FaPenToSquare,
  FaTrashCan,
  FaCheck,
  FaXmark,
  FaBookBookmark,
  FaRotateLeft,
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
      <div id="matieres" className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <FaBookBookmark className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>Gestion des Matières Enseignées</span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  {matieres.length} matières actives
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Ajoutez, modifiez ou supprimez les matières disponibles pour les groupes et les professeurs.
              </p>
            </div>
          </div>

          <button
            onClick={resetToDefault}
            className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            title="Rétablir les matières par défaut"
          >
            <FaRotateLeft className="w-3 h-3" />
            <span>Réinitialiser par défaut</span>
          </button>
        </div>

        {/* Add Matière Form */}
        <form onSubmit={handleAddMatiereSubmit} className="mt-4 flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={newMatiereInput}
            onChange={(e) => setNewMatiereInput(e.target.value)}
            placeholder="Nom de la nouvelle matière (ex: Informatique, SVT, Espagnol...)"
            className="flex-1 px-3.5 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter la Matière</span>
          </button>
        </form>

        {/* Matieres Grid */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {matieres.map((mat) => {
            const isEditing = editingMatiere === mat;

            return (
              <div
                key={mat}
                className="p-3.5 rounded-xl border border-slate-200/90 bg-slate-50/60 hover:bg-white hover:border-blue-300 transition-all flex items-center justify-between gap-3 shadow-2xs"
              >
                {isEditing ? (
                  <div className="flex items-center gap-2 w-full">
                    <input
                      type="text"
                      value={editMatiereValue}
                      onChange={(e) => setEditMatiereValue(e.target.value)}
                      className="flex-1 px-2.5 py-1 text-xs border border-blue-400 rounded-lg outline-none bg-white font-semibold text-slate-900"
                      autoFocus
                    />
                    <button
                      onClick={() => saveEditMatiere(mat)}
                      className="p-1.5 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 cursor-pointer"
                      title="Valider"
                    >
                      <FaCheck className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => setEditingMatiere(null)}
                      className="p-1.5 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300 cursor-pointer"
                      title="Annuler"
                    >
                      <FaXmark className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
                      <span className="text-xs font-semibold text-slate-800 truncate" title={mat}>
                        {mat}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => startEditMatiere(mat)}
                        title="Modifier le nom de cette matière"
                        className="p-1.5 rounded-md text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                      >
                        <FaPenToSquare className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Voulez-vous vraiment supprimer la matière "${mat}" ?`)) {
                            deleteMatiere(mat);
                            setMatiereFeedback(`Matière "${mat}" supprimée.`);
                            setTimeout(() => setMatiereFeedback(null), 3000);
                          }
                        }}
                        title="Supprimer cette matière"
                        className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        <FaTrashCan className="w-3 h-3" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
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

'use client';

import React, { useState } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import {
  FaBookBookmark,
  FaPlus,
  FaPenToSquare,
  FaTrashCan,
  FaCircleCheck,
  FaRotateLeft,
  FaCheck,
  FaXmark,
  FaUsers,
  FaUserGraduate,
  FaBookOpen,
} from 'react-icons/fa6';
import { Search } from 'lucide-react';
import { useMatieres } from '../../data/matieresStore';
import { useGroupes, useProfesseurs } from '../../data/appStores';
import { DeleteConfirmModal } from '../../components/common/DeleteConfirmModal';

export default function MatieresPage() {
  const { matieres, addMatiere, updateMatiere, deleteMatiere, resetToDefault } = useMatieres();
  const { groupes } = useGroupes();
  const { professeurs } = useProfesseurs();

  const [searchTerm, setSearchTerm] = useState('');
  const [newMatiereInput, setNewMatiereInput] = useState('');
  const [editingMatiere, setEditingMatiere] = useState<string | null>(null);
  const [editMatiereValue, setEditMatiereValue] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newMatiereInput.trim();
    if (!trimmed) return;

    const ok = addMatiere(trimmed);
    if (ok) {
      showToast(`Matière « ${trimmed} » ajoutée avec succès !`);
      setNewMatiereInput('');
    } else {
      showToast('Cette matière existe déjà.');
    }
  };

  const startEdit = (nom: string) => {
    setEditingMatiere(nom);
    setEditMatiereValue(nom);
  };

  const saveEdit = (oldNom: string) => {
    const trimmed = editMatiereValue.trim();
    if (!trimmed) return;

    const ok = updateMatiere(oldNom, trimmed);
    if (ok) {
      showToast(`Matière renommée en « ${trimmed} » !`);
      setEditingMatiere(null);
    } else {
      showToast('Une autre matière porte déjà ce nom.');
    }
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      deleteMatiere(deleteTarget);
      showToast(`Matière « ${deleteTarget} » supprimée avec succès.`);
      setDeleteTarget(null);
    }
  };

  const handleReset = () => {
    if (confirm('Voulez-vous réinitialiser le catalogue avec les matières par défaut ?')) {
      resetToDefault();
      showToast('Catalogue des matières réinitialisé.');
    }
  };

  // Filtered list
  const filteredMatieres = matieres.filter((m) =>
    m.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 w-full">
      {/* Page Header */}
      <PageHeader
        title="Gestion des Matières"
        description="Catalogue officiel des disciplines enseignées au centre. Configurez les matières disponibles pour les groupes et les professeurs."
        badge={`${matieres.length} matières actives`}
        icon={FaBookBookmark}
      />

      {/* Floating Success Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-emerald-600 text-white text-sm font-semibold rounded-xl shadow-lg animate-in slide-in-from-top-3 duration-200">
          <FaCircleCheck className="w-4 h-4 text-emerald-200 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center text-xl shrink-0">
            <FaBookBookmark className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-slate-900">{matieres.length}</span>
            <p className="text-xs text-slate-500 font-medium">Matières au catalogue</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl shrink-0">
            <FaBookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-slate-900">{groupes.length}</span>
            <p className="text-xs text-slate-500 font-medium">Groupes de soutien créés</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl shrink-0">
            <FaUserGraduate className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-slate-900">{professeurs.length}</span>
            <p className="text-xs text-slate-500 font-medium">Enseignants déclarés</p>
          </div>
        </div>
      </div>

      {/* Quick Add and Search Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
        {/* Form Add */}
        <div>
          <h3 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
            <FaPlus className="w-3.5 h-3.5 text-teal-600" />
            <span>Ajouter une Nouvelle Matière</span>
          </h3>
          <form onSubmit={handleAddSubmit} className="flex flex-col sm:flex-row items-center gap-2.5">
            <input
              type="text"
              value={newMatiereInput}
              onChange={(e) => setNewMatiereInput(e.target.value)}
              placeholder="Nom de la matière (ex: Informatique, SVT, Espagnol, Économie...)"
              className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:border-teal-500 focus:bg-white transition-colors"
            />
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              <FaPlus className="w-3.5 h-3.5" />
              <span>Ajouter la Matière</span>
            </button>
          </form>
        </div>

        {/* Search & Actions Toolbar */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher une matière..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg outline-none focus:border-teal-500 text-slate-700"
            />
          </div>

          <button
            onClick={handleReset}
            className="text-xs font-semibold text-slate-400 hover:text-slate-600 hover:bg-slate-100 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors self-start sm:self-auto cursor-pointer"
          >
            <FaRotateLeft className="w-3 h-3" />
            <span>Réinitialiser aux matières par défaut</span>
          </button>
        </div>
      </div>

      {/* Grid of Matières */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMatieres.map((mat) => {
          const isEditing = editingMatiere === mat;
          const assignedGroups = groupes.filter((g) =>
            g.matiere.toLowerCase().includes(mat.toLowerCase())
          );
          const assignedProfs = professeurs.filter((p) =>
            p.matieres.some((m) => m.toLowerCase().includes(mat.toLowerCase()))
          );

          return (
            <div
              key={mat}
              className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs hover:shadow-xs hover:border-teal-400 transition-all flex flex-col justify-between group"
            >
              <div>
                {isEditing ? (
                  <div className="flex items-center gap-1.5 mb-2">
                    <input
                      type="text"
                      value={editMatiereValue}
                      onChange={(e) => setEditMatiereValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveEdit(mat);
                        if (e.key === 'Escape') setEditingMatiere(null);
                      }}
                      autoFocus
                      className="flex-1 px-2.5 py-1 text-xs font-bold bg-white border-2 border-teal-500 rounded-lg outline-none text-slate-900"
                    />
                    <button
                      onClick={() => saveEdit(mat)}
                      className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg cursor-pointer"
                      title="Valider"
                    >
                      <FaCheck className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setEditingMatiere(null)}
                      className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg cursor-pointer"
                      title="Annuler"
                    >
                      <FaXmark className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-teal-500 shrink-0" />
                      <h4 className="font-bold text-slate-900 text-sm">{mat}</h4>
                    </div>

                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => startEdit(mat)}
                        title="Renommer la matière"
                        className="p-1.5 text-slate-400 hover:text-teal-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      >
                        <FaPenToSquare className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(mat)}
                        title="Supprimer la matière"
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <FaTrashCan className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Sub details: groups & teachers */}
                <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-1.5 text-xs text-slate-500">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <FaBookOpen className="w-3 h-3 text-slate-400" />
                      <span>Groupes rattachés :</span>
                    </span>
                    <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                      {assignedGroups.length} groupe{assignedGroups.length > 1 ? 's' : ''}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <FaUserGraduate className="w-3 h-3 text-slate-400" />
                      <span>Professeurs :</span>
                    </span>
                    <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                      {assignedProfs.length} enseignant{assignedProfs.length > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredMatieres.length === 0 && (
        <div className="p-8 text-center bg-white rounded-2xl border border-slate-200/90 text-slate-400 italic text-sm">
          Aucune matière trouvée correspondant à « {searchTerm} ».
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        title="Supprimer la Matière"
        itemType="la matière"
        itemName={deleteTarget || ''}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}

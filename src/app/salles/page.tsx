'use client';

import React, { useState } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import {
  Plus,
  Users,
  Wrench,
  Clock,
  GraduationCap,
  Layers,
  Sparkles,
  Monitor,
  Wind,
  SquareDashed,
  X,
} from 'lucide-react';
import { FaSchool, FaTrashCan, FaCircleCheck } from 'react-icons/fa6';
import { mockSeancesDuJour, mockGroupes, mockProfesseurs } from '../../data/mockData';
import { Salle } from '../../types';
import { useSalles } from '../../data/appStores';
import { DeleteConfirmModal } from '../../components/common/DeleteConfirmModal';

export default function SallesPage() {
  const { salles: sallesList, addSalle, updateSalle, deleteSalle } = useSalles();
  const [filterStatut, setFilterStatut] = useState<'all' | 'disponible' | 'occupee' | 'maintenance'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form
  const [nom, setNom] = useState('');
  const [etage, setEtage] = useState('1er Étage');
  const [capacite, setCapacite] = useState(25);
  const [equipements, setEquipements] = useState<string[]>([
    'Vidéoprojecteur',
    'Climatisation',
    'Tableau Blanc',
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredSalles = sallesList.filter((s) => {
    if (filterStatut === 'all') return true;
    return s.statut === filterStatut;
  });

  const handleAddSalle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nom) return;

    const newSalle: Salle = {
      id: `salle-${Date.now()}`,
      nom,
      etage,
      capacite: Number(capacite),
      equipements,
      statut: 'disponible',
    };

    addSalle(newSalle);
    setIsModalOpen(false);
    showToast(`Salle « ${nom} » ajoutée avec succès !`);
    setNom('');
  };

  const toggleStatus = (id: string) => {
    const s = sallesList.find((item) => item.id === id);
    if (!s) return;
    const nextStatut =
      s.statut === 'disponible'
        ? 'occupee'
        : s.statut === 'occupee'
        ? 'maintenance'
        : 'disponible';
    updateSalle(id, { statut: nextStatut });
  };

  return (
    <div className="space-y-6 w-full">
      <PageHeader
        title="Gestion des Salles & Disponibilité"
        description="Contrôlez les salles de cours, vérifiez les disponibilités en temps réel et prévenez les conflits."
        badge={`${sallesList.length} salles`}
        icon={FaSchool}
        action={{
          label: 'Ajouter une Salle',
          icon: Plus,
          onClick: () => setIsModalOpen(true),
        }}
      />

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        {(['all', 'disponible', 'occupee', 'maintenance'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilterStatut(tab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
              filterStatut === tab
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab === 'all'
              ? 'Toutes les salles'
              : tab === 'disponible'
              ? 'Disponibles (Libres)'
              : tab === 'occupee'
              ? 'Occupées (En cours)'
              : 'En Maintenance'}
          </button>
        ))}
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-5 w-full">
        {filteredSalles.map((salle) => {
          const isOccupee = salle.statut === 'occupee';
          const isDisponible = salle.statut === 'disponible';
          const isMaintenance = salle.statut === 'maintenance';

          // Check if there is an active session right now in this room
          const seanceActuelle = mockSeancesDuJour.find(
            (s) => s.salleId === salle.id && s.statut === 'en_cours'
          );

          // Find groups that use this room as default
          const assignedGroups = mockGroupes.filter((g) => g.salleDefautId === salle.id);

          return (
            <div
              key={salle.id}
              className={`rounded-2xl border p-5 shadow-xs transition-all flex flex-col justify-between ${
                isOccupee
                  ? 'bg-amber-50/30 border-amber-200 hover:border-amber-300'
                  : isDisponible
                  ? 'bg-white border-slate-200/90 hover:border-blue-300'
                  : 'bg-slate-50 border-slate-200 opacity-90'
              }`}
            >
              <div>
                {/* Top status bar */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                        isOccupee
                          ? 'bg-amber-100 text-amber-700'
                          : isDisponible
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      <FaSchool className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">{salle.nom}</h3>
                      <p className="text-xs text-slate-500">{salle.etage}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => toggleStatus(salle.id)}
                      title="Cliquer pour basculer l'état"
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 transition-all cursor-pointer ${
                        isDisponible
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : isOccupee
                          ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                          : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                      }`}
                    >
                      {isDisponible && (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Disponible
                        </>
                      )}
                      {isOccupee && (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                          Occupée
                        </>
                      )}
                      {isMaintenance && (
                        <>
                          <Wrench className="w-3 h-3 text-slate-500" />
                          Maintenance
                        </>
                      )}
                    </button>

                    <button
                      onClick={() =>
                        setDeleteTarget({
                          id: salle.id,
                          name: salle.nom,
                        })
                      }
                      title="Supprimer cette salle"
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <FaTrashCan className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Capacity and Equipment */}
                <div className="mt-4 flex items-center justify-between text-xs py-2 px-3 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                    <Users className="w-4 h-4 text-slate-400" />
                    <span>Capacité : {salle.capacite} places</span>
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="text-[11px] text-slate-500">
                    {salle.equipements.length} équipements
                  </span>
                </div>

                {/* Badges Equipements */}
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {salle.equipements.map((eq, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600 shadow-2xs"
                    >
                      {eq}
                    </span>
                  ))}
                </div>

                {/* Live Activity Box: Who is teaching right now! */}
                <div className="mt-4 pt-3 border-t border-slate-200/80">
                  {seanceActuelle ? (
                    <div className="p-3 rounded-xl bg-amber-100/60 border border-amber-200/80 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-ping" />
                          Séance en cours actuellement
                        </span>
                        <span className="text-xs font-bold text-amber-900">
                          {seanceActuelle.heureDebut} - {seanceActuelle.heureFin}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-slate-900">
                        {seanceActuelle.groupeNom}
                      </p>
                      <p className="text-xs text-slate-700 flex items-center gap-1 font-medium">
                        <GraduationCap className="w-3.5 h-3.5 text-slate-500" />
                        <span>{seanceActuelle.professeurNom}</span>
                      </p>
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-500">
                      <span className="font-semibold text-slate-700 block mb-1">
                        Groupes affectés à cette salle :
                      </span>
                      {assignedGroups.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {assignedGroups.map((g) => (
                            <span
                              key={g.id}
                              className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200"
                            >
                              {g.nom}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Aucun groupe récurrent</span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
                <span className="text-slate-400">ID: {salle.id}</span>
                <button
                  onClick={() => toggleStatus(salle.id)}
                  className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                >
                  Changer le statut
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Room Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Ajouter une nouvelle salle</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSalle} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nom de la salle *
                </label>
                <input
                  type="text"
                  required
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  placeholder="ex: Salle 5 - Al-Kindi"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Étage</label>
                  <select
                    value={etage}
                    onChange={(e) => setEtage(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 bg-white"
                  >
                    <option value="RDC">Rez-de-chaussée (RDC)</option>
                    <option value="1er Étage">1er Étage</option>
                    <option value="2ème Étage">2ème Étage</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Capacité (Élèves)
                  </label>
                  <input
                    type="number"
                    value={capacite}
                    onChange={(e) => setCapacite(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-xs"
                >
                  Ajouter la salle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Success Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-emerald-600 text-white text-sm font-semibold rounded-xl shadow-lg animate-in slide-in-from-top-3 duration-200">
          <FaCircleCheck className="w-4 h-4 text-emerald-200 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        title="Supprimer la Salle"
        itemType="la salle"
        itemName={deleteTarget?.name}
        onConfirm={() => {
          if (deleteTarget) {
            deleteSalle(deleteTarget.id);
            showToast(`La salle « ${deleteTarget.name} » a été supprimée.`);
            setDeleteTarget(null);
          }
        }}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}

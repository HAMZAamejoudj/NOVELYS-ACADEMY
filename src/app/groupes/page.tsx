'use client';

import React, { useState } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import {
  Plus,
  Users,
  DoorOpen,
  Calendar,
  GraduationCap,
  Clock,
  Sparkles,
  X,
} from 'lucide-react';
import { FaBookOpen, FaPlus } from 'react-icons/fa6';
import { mockGroupes, mockProfesseurs, mockSalles, mockEtudiants } from '../../data/mockData';
import { formatDH } from '../../lib/utils';
import { Groupe } from '../../types';
import { useMatieres } from '../../data/matieresStore';

export default function GroupesPage() {
  const [groupesList, setGroupesList] = useState<Groupe[]>(mockGroupes);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { matieres, addMatiere } = useMatieres();
  const [isAddingNewMatiere, setIsAddingNewMatiere] = useState(false);
  const [quickMatiereInput, setQuickMatiereInput] = useState('');

  // Form State
  const [nom, setNom] = useState('');
  const [matiere, setMatiere] = useState('Mathématiques');
  const [niveau, setNiveau] = useState('2ème Bac Sciences Maths');
  const [profId, setProfId] = useState(mockProfesseurs[0]?.id || '');
  const [salleId, setSalleId] = useState(mockSalles[0]?.id || '');
  const [capaciteMax, setCapaciteMax] = useState(20);
  const [tarifMensuel, setTarifMensuel] = useState(350);

  const handleAddGroupe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nom) return;

    const newGrp: Groupe = {
      id: `grp-${Date.now()}`,
      nom,
      code: nom.slice(0, 6).toUpperCase(),
      matiere,
      niveau,
      professeurId: profId,
      salleDefautId: salleId,
      capaciteMax: Number(capaciteMax),
      tarifMensuel: Number(tarifMensuel),
      statut: 'ouvert',
      horaires: [
        { jour: 'Mercredi', heureDebut: '17:30', heureFin: '19:30', salleId },
      ],
    };

    setGroupesList([newGrp, ...groupesList]);
    setIsModalOpen(false);
    setNom('');
  };

  return (
    <div className="space-y-6 w-full">
      <PageHeader
        title="Gestion des Groupes & Classes"
        description="Organisez vos étudiants par groupes (Groupe A, B, C...), matières et créneaux horaires."
        badge={`${groupesList.length} groupes`}
        icon={FaBookOpen}
        action={{
          label: 'Nouveau Groupe',
          icon: Plus,
          onClick: () => setIsModalOpen(true),
        }}
      />

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-5 w-full">
        {groupesList.map((groupe) => {
          const prof = mockProfesseurs.find((p) => p.id === groupe.professeurId);
          const salle = mockSalles.find((s) => s.id === groupe.salleDefautId);
          const inscritsCount = mockEtudiants.filter((e) =>
            e.groupesIds.includes(groupe.id)
          ).length;

          const ratioRemplissage = Math.min(
            100,
            Math.round((inscritsCount / groupe.capaciteMax) * 100)
          );
          const isComplet = inscritsCount >= groupe.capaciteMax;

          return (
            <div
              key={groupe.id}
              className="bg-white rounded-xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow p-5 flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                      {groupe.matiere}
                    </span>
                    <h3 className="font-bold text-slate-900 text-base mt-1.5">{groupe.nom}</h3>
                    <p className="text-xs text-slate-500">{groupe.niveau}</p>
                  </div>

                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      isComplet
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {isComplet ? 'Complet' : 'Ouvert'}
                  </span>
                </div>

                {/* Capacity Progress Bar */}
                <div className="mt-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
                    <span className="text-slate-600 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>Élèves inscrits</span>
                    </span>
                    <span className="font-bold text-slate-800">
                      {inscritsCount} / {groupe.capaciteMax} ({ratioRemplissage}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        ratioRemplissage >= 90
                          ? 'bg-rose-500'
                          : ratioRemplissage >= 70
                          ? 'bg-amber-500'
                          : 'bg-blue-600'
                      }`}
                      style={{ width: `${ratioRemplissage}%` }}
                    />
                  </div>
                </div>

                {/* Teacher and Room details */}
                <div className="mt-4 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Enseignant :</span>
                    </span>
                    <span className="font-semibold text-slate-800">
                      {prof ? `Pr. ${prof.prenom} ${prof.nom}` : 'Non assigné'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <DoorOpen className="w-3.5 h-3.5 text-blue-500" />
                      <span>Salle :</span>
                    </span>
                    <span className="font-semibold text-slate-800">
                      {salle ? salle.nom : 'Non assignée'}
                    </span>
                  </div>

                  {/* Horaires */}
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                      Créneaux des séances :
                    </span>
                    <div className="space-y-1">
                      {groupe.horaires.map((h, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between text-[11px] bg-slate-50 px-2 py-1 rounded text-slate-700"
                        >
                          <span className="font-semibold">{h.jour}</span>
                          <span className="text-slate-500 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {h.heureDebut} - {h.heureFin}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Price and Action Footer */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">Tarif mensuel</span>
                  <span className="text-base font-extrabold text-blue-700">
                    {formatDH(groupe.tarifMensuel)}
                    <span className="text-xs font-normal text-slate-500"> /mois</span>
                  </span>
                </div>

                <button className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors">
                  Gérer les élèves
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Group Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Créer un nouveau groupe</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddGroupe} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nom du Groupe *
                </label>
                <input
                  type="text"
                  required
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  placeholder="ex: 2 Bac SM - Maths Groupe B"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-700">Matière</label>
                    <button
                      type="button"
                      onClick={() => setIsAddingNewMatiere(!isAddingNewMatiere)}
                      className="text-[11px] text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {isAddingNewMatiere ? 'Choisir existante' : '+ Nouvelle'}
                    </button>
                  </div>

                  {isAddingNewMatiere ? (
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        placeholder="Nom matière..."
                        value={quickMatiereInput}
                        onChange={(e) => setQuickMatiereInput(e.target.value)}
                        className="flex-1 px-2.5 py-1.5 border border-blue-400 rounded-lg text-xs outline-none bg-blue-50/30"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (quickMatiereInput.trim()) {
                            addMatiere(quickMatiereInput.trim());
                            setMatiere(quickMatiereInput.trim());
                            setQuickMatiereInput('');
                            setIsAddingNewMatiere(false);
                          }
                        }}
                        className="px-2.5 py-1 bg-blue-600 text-white rounded-lg text-xs font-bold"
                      >
                        OK
                      </button>
                    </div>
                  ) : (
                    <select
                      value={matiere}
                      onChange={(e) => setMatiere(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 bg-white"
                    >
                      {matieres.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Niveau</label>
                  <select
                    value={niveau}
                    onChange={(e) => setNiveau(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 bg-white"
                  >
                    <option value="2ème Bac Sciences Maths">2ème Bac Sciences Maths</option>
                    <option value="2ème Bac Sciences Physiques">2ème Bac Sciences Physiques</option>
                    <option value="2ème Bac SVT">2ème Bac SVT</option>
                    <option value="1ère Bac Sciences Maths">1ère Bac Sciences Maths</option>
                    <option value="Tronc Commun">Tronc Commun</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Professeur Assigné
                  </label>
                  <select
                    value={profId}
                    onChange={(e) => setProfId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 bg-white"
                  >
                    {mockProfesseurs.map((p) => (
                      <option key={p.id} value={p.id}>
                        Pr. {p.prenom} {p.nom}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Salle par Défaut
                  </label>
                  <select
                    value={salleId}
                    onChange={(e) => setSalleId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 bg-white"
                  >
                    {mockSalles.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.nom} ({s.capacite} places)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Capacité Max (places)
                  </label>
                  <input
                    type="number"
                    value={capaciteMax}
                    onChange={(e) => setCapaciteMax(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tarif Mensuel (DH/mois)
                  </label>
                  <input
                    type="number"
                    value={tarifMensuel}
                    onChange={(e) => setTarifMensuel(Number(e.target.value))}
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
                  Créer le groupe
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

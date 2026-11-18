'use client';

import React, { useState } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import {
  Search,
  Filter,
  Plus,
  Phone,
  MessageCircle,
  X,
  Check,
} from 'lucide-react';
import {
  FaUsers,
  FaCircleCheck,
  FaCircleExclamation,
  FaCircleXmark,
  FaPenToSquare,
  FaUserGroup,
  FaCheck,
  FaTrashCan,
} from 'react-icons/fa6';
import { mockGroupes } from '../../data/mockData';
import { formatDate } from '../../lib/utils';
import { Etudiant, StatutEtudiant } from '../../types';
import { useEtudiants } from '../../data/appStores';
import { DeleteConfirmModal } from '../../components/common/DeleteConfirmModal';

export default function EtudiantsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNiveau, setSelectedNiveau] = useState('all');
  const { etudiants, addEtudiant, updateEtudiant, deleteEtudiant } = useEtudiants();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Etudiant | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Student Form state
  const [newNom, setNewNom] = useState('');
  const [newPrenom, setNewPrenom] = useState('');
  const [newTel, setNewTel] = useState('');
  const [newTelParent, setNewTelParent] = useState('');
  const [newNiveau, setNewNiveau] = useState('2ème Bac Sciences Maths');
  const [newGroupesIds, setNewGroupesIds] = useState<string[]>(['grp-1']);

  // Edit Student Form state
  const [editNom, setEditNom] = useState('');
  const [editPrenom, setEditPrenom] = useState('');
  const [editTel, setEditTel] = useState('');
  const [editTelParent, setEditTelParent] = useState('');
  const [editNiveau, setEditNiveau] = useState('');
  const [editStatut, setEditStatut] = useState<StatutEtudiant>('actif');
  const [editGroupesIds, setEditGroupesIds] = useState<string[]>([]);

  const niveaux = [
    'all',
    '2ème Bac Sciences Maths',
    '2ème Bac Sciences Physiques',
    '2ème Bac SVT',
    '1ère Bac Sciences Maths',
    '1ère Bac (Toutes branches)',
    'Tronc Commun Scientifique',
  ];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const filteredEtudiants = etudiants.filter((etudiant) => {
    const matchesSearch =
      `${etudiant.nom} ${etudiant.prenom} ${etudiant.telephone} ${etudiant.telephoneParent}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesNiveau = selectedNiveau === 'all' || etudiant.niveau === selectedNiveau;
    return matchesSearch && matchesNiveau;
  });

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNom || !newPrenom || !newTel) return;

    const newStudent: Etudiant = {
      id: `etud-${Date.now()}`,
      nom: newNom,
      prenom: newPrenom,
      telephone: newTel,
      telephoneParent: newTelParent || newTel,
      niveau: newNiveau,
      groupesIds: newGroupesIds.length > 0 ? newGroupesIds : ['grp-1'],
      dateInscription: new Date().toISOString().split('T')[0],
      statut: 'actif',
    };

    addEtudiant(newStudent);
    setIsAddModalOpen(false);
    showToast(`Élève ${newPrenom} ${newNom} inscrit avec succès !`);
    setNewNom('');
    setNewPrenom('');
    setNewTel('');
    setNewTelParent('');
    setNewGroupesIds(['grp-1']);
  };

  const openEditModal = (etudiant: Etudiant) => {
    setEditingStudent(etudiant);
    setEditNom(etudiant.nom);
    setEditPrenom(etudiant.prenom);
    setEditTel(etudiant.telephone);
    setEditTelParent(etudiant.telephoneParent);
    setEditNiveau(etudiant.niveau);
    setEditStatut(etudiant.statut);
    setEditGroupesIds([...etudiant.groupesIds]);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;

    updateEtudiant(editingStudent.id, {
      nom: editNom,
      prenom: editPrenom,
      telephone: editTel,
      telephoneParent: editTelParent,
      niveau: editNiveau,
      statut: editStatut,
      groupesIds: editGroupesIds,
    });

    setIsEditModalOpen(false);
    showToast(`Modifications enregistrées pour ${editPrenom} ${editNom} !`);
    setEditingStudent(null);
  };

  const toggleGroupInEdit = (grpId: string) => {
    if (editGroupesIds.includes(grpId)) {
      setEditGroupesIds(editGroupesIds.filter((id) => id !== grpId));
    } else {
      setEditGroupesIds([...editGroupesIds, grpId]);
    }
  };

  const toggleGroupInAdd = (grpId: string) => {
    if (newGroupesIds.includes(grpId)) {
      setNewGroupesIds(newGroupesIds.filter((id) => id !== grpId));
    } else {
      setNewGroupesIds([...newGroupesIds, grpId]);
    }
  };

  return (
    <div className="space-y-6 w-full">
      <PageHeader
        title="Gestion des Étudiants"
        description="Consultez, inscrivez, modifiez le statut et affectez les élèves aux différents groupes."
        badge={`${filteredEtudiants.length} élèves`}
        icon={FaUsers}
        action={{
          label: 'Nouvel Élève',
          icon: Plus,
          onClick: () => setIsAddModalOpen(true),
        }}
      />

      {/* Floating Success Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-emerald-600 text-white text-sm font-semibold rounded-xl shadow-lg animate-in slide-in-from-top-3 duration-200">
          <FaCircleCheck className="w-4 h-4 text-emerald-200 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher par nom, prénom, téléphone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 text-sm rounded-lg outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="text-xs font-semibold text-slate-500 shrink-0">Niveau :</span>
          <select
            value={selectedNiveau}
            onChange={(e) => setSelectedNiveau(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 text-xs font-medium rounded-lg text-slate-700 outline-none focus:border-blue-500"
          >
            <option value="all">Tous les niveaux</option>
            {niveaux
              .filter((n) => n !== 'all')
              .map((niv) => (
                <option key={niv} value={niv}>
                  {niv}
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-xs uppercase font-bold text-slate-500 tracking-wider">
              <tr>
                <th className="px-6 py-3.5">Élève</th>
                <th className="px-6 py-3.5">Niveau</th>
                <th className="px-6 py-3.5">Groupes Assignés</th>
                <th className="px-6 py-3.5">Contacts (Élève & Parent)</th>
                <th className="px-6 py-3.5">Date Inscription</th>
                <th className="px-6 py-3.5">Statut</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEtudiants.map((etudiant) => {
                const assignedGroups = mockGroupes.filter((g) =>
                  etudiant.groupesIds.includes(g.id)
                );

                return (
                  <tr key={etudiant.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">
                          {etudiant.prenom[0]}
                          {etudiant.nom[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">
                            {etudiant.nom} {etudiant.prenom}
                          </p>
                          <p className="text-xs text-slate-400">{etudiant.email || 'Aucun email'}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                        {etudiant.niveau}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1.5 items-center">
                        {assignedGroups.length > 0 ? (
                          assignedGroups.map((grp) => (
                            <span
                              key={grp.id}
                              className="text-[11px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200"
                            >
                              {grp.nom}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-400 italic">Aucun groupe</span>
                        )}
                        <button
                          onClick={() => openEditModal(etudiant)}
                          title="Modifier les groupes"
                          className="text-[10px] text-blue-600 hover:text-blue-800 underline font-medium ml-1"
                        >
                          + Gérer
                        </button>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-1.5 text-slate-700">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{etudiant.telephone}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                          <span className="text-[10px] text-slate-400">Parent:</span>
                          <span>{etudiant.telephoneParent}</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-xs text-slate-500">
                      {formatDate(etudiant.dateInscription)}
                    </td>

                    <td className="px-6 py-4">
                      <button
                        onClick={() => openEditModal(etudiant)}
                        title="Cliquer pour changer le statut ou le groupe"
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full inline-flex items-center gap-1.5 transition-all hover:scale-105 cursor-pointer ${
                          etudiant.statut === 'actif'
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : etudiant.statut === 'suspendu'
                            ? 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {etudiant.statut === 'actif' ? (
                          <>
                            <FaCircleCheck className="w-3 h-3 text-emerald-600" />
                            Actif
                          </>
                        ) : etudiant.statut === 'suspendu' ? (
                          <>
                            <FaCircleExclamation className="w-3 h-3 text-rose-600" />
                            Suspendu
                          </>
                        ) : (
                          <>
                            <FaCircleXmark className="w-3 h-3 text-slate-500" />
                            Inactif
                          </>
                        )}
                      </button>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Edit Button */}
                        <button
                          onClick={() => openEditModal(etudiant)}
                          title="Modifier l'élève (Statut, Groupes, Infos)"
                          className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors flex items-center gap-1 px-2.5 text-xs font-semibold cursor-pointer"
                        >
                          <FaPenToSquare className="w-3.5 h-3.5" />
                          <span>Éditer</span>
                        </button>

                        {/* WhatsApp Button */}
                        <a
                          href={`https://wa.me/212${etudiant.telephoneParent.replace(/[^0-9]/g, '').slice(1)}`}
                          target="_blank"
                          rel="noreferrer"
                          title="Contacter le Parent sur WhatsApp"
                          className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors cursor-pointer"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </a>

                        {/* Delete Button */}
                        <button
                          onClick={() =>
                            setDeleteTarget({
                              id: etudiant.id,
                              name: `${etudiant.prenom} ${etudiant.nom}`,
                            })
                          }
                          title="Supprimer définitivement l'élève"
                          className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors flex items-center gap-1 px-2.5 text-xs font-semibold cursor-pointer"
                        >
                          <FaTrashCan className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Supprimer</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Student Modal */}
      {isEditModalOpen && editingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 my-8 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                  <FaPenToSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Modifier l'Élève : {editingStudent.nom} {editingStudent.prenom}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Mettez à jour le statut, les groupes assignés ou les informations de contact.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 mt-4">
              {/* Statut Selector Section */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Statut de l'Élève *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setEditStatut('actif')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                      editStatut === 'actif'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <FaCircleCheck className="w-3.5 h-3.5" />
                    <span>Actif</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditStatut('suspendu')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                      editStatut === 'suspendu'
                        ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <FaCircleExclamation className="w-3.5 h-3.5" />
                    <span>Suspendu</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditStatut('inactif')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                      editStatut === 'inactif'
                        ? 'bg-slate-700 text-white border-slate-700 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <FaCircleXmark className="w-3.5 h-3.5" />
                    <span>Inactif</span>
                  </button>
                </div>
              </div>

              {/* Groupes Assignés Section */}
              <div className="p-3.5 bg-blue-50/50 rounded-xl border border-blue-200/70">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <FaUserGroup className="w-3.5 h-3.5 text-blue-600" />
                    <span>Groupes Assignés ({editGroupesIds.length} sélectionné{editGroupesIds.length > 1 ? 's' : ''})</span>
                  </label>
                  <span className="text-[11px] text-blue-600 font-medium">Cochez pour ajouter/retirer</span>
                </div>

                <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                  {mockGroupes.map((grp) => {
                    const isSelected = editGroupesIds.includes(grp.id);
                    return (
                      <div
                        key={grp.id}
                        onClick={() => toggleGroupInEdit(grp.id)}
                        className={`p-2.5 rounded-lg border text-xs cursor-pointer flex items-center justify-between transition-all ${
                          isSelected
                            ? 'bg-white border-blue-500 shadow-xs ring-1 ring-blue-500'
                            : 'bg-white/80 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                              isSelected
                                ? 'bg-blue-600 border-blue-600 text-white'
                                : 'border-slate-300 bg-white'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">{grp.nom}</p>
                            <p className="text-[10px] text-slate-500">
                              {grp.matiere} • {grp.niveau}
                            </p>
                          </div>
                        </div>
                        <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                          {grp.tarifMensuel} DH/m
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Personal Info */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nom *</label>
                  <input
                    type="text"
                    required
                    value={editNom}
                    onChange={(e) => setEditNom(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Prénom *</label>
                  <input
                    type="text"
                    required
                    value={editPrenom}
                    onChange={(e) => setEditPrenom(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tél Élève *</label>
                  <input
                    type="text"
                    required
                    value={editTel}
                    onChange={(e) => setEditTel(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tél Parent *</label>
                  <input
                    type="text"
                    required
                    value={editTelParent}
                    onChange={(e) => setEditTelParent(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Niveau Scolaire</label>
                <select
                  value={editNiveau}
                  onChange={(e) => setEditNiveau(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 bg-white"
                >
                  {niveaux
                    .filter((n) => n !== 'all')
                    .map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                </select>
              </div>

              <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    const target = {
                      id: editingStudent.id,
                      name: `${editingStudent.prenom} ${editingStudent.nom}`,
                    };
                    setIsEditModalOpen(false);
                    setDeleteTarget(target);
                  }}
                  className="px-3.5 py-2 rounded-lg text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <FaTrashCan className="w-3.5 h-3.5" />
                  <span>Supprimer cet élève</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-50 cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <FaCheck className="w-3.5 h-3.5" />
                    <span>Enregistrer les modifications</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 my-8 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Inscrire un nouvel élève</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddStudent} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nom *</label>
                  <input
                    type="text"
                    required
                    value={newNom}
                    onChange={(e) => setNewNom(e.target.value)}
                    placeholder="ex: Alaoui"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Prénom *</label>
                  <input
                    type="text"
                    required
                    value={newPrenom}
                    onChange={(e) => setNewPrenom(e.target.value)}
                    placeholder="ex: Mehdi"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tél Élève *</label>
                  <input
                    type="text"
                    required
                    value={newTel}
                    onChange={(e) => setNewTel(e.target.value)}
                    placeholder="0611223344"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tél Parent</label>
                  <input
                    type="text"
                    value={newTelParent}
                    onChange={(e) => setNewTelParent(e.target.value)}
                    placeholder="0622334455"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Niveau Scolaire</label>
                <select
                  value={newNiveau}
                  onChange={(e) => setNewNiveau(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 bg-white"
                >
                  {niveaux
                    .filter((n) => n !== 'all')
                    .map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Assigner aux Groupes ({newGroupesIds.length} sélectionné{newGroupesIds.length > 1 ? 's' : ''})
                </label>
                <div className="max-h-36 overflow-y-auto space-y-1.5 border border-slate-200 p-2 rounded-lg bg-slate-50">
                  {mockGroupes.map((grp) => {
                    const isSelected = newGroupesIds.includes(grp.id);
                    return (
                      <div
                        key={grp.id}
                        onClick={() => toggleGroupInAdd(grp.id)}
                        className={`p-2 rounded border text-xs cursor-pointer flex items-center justify-between ${
                          isSelected ? 'bg-blue-50 border-blue-400 font-semibold text-blue-900' : 'bg-white border-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            readOnly
                            className="rounded text-blue-600"
                          />
                          <span>{grp.nom} ({grp.matiere})</span>
                        </div>
                        <span className="text-[11px] text-slate-500">{grp.tarifMensuel} DH</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-xs"
                >
                  Enregistrer l'inscription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        title="Supprimer l'Élève"
        itemType="l'élève"
        itemName={deleteTarget?.name}
        onConfirm={() => {
          if (deleteTarget) {
            deleteEtudiant(deleteTarget.id);
            showToast(`L'élève ${deleteTarget.name} a été supprimé avec succès.`);
            setDeleteTarget(null);
          }
        }}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}

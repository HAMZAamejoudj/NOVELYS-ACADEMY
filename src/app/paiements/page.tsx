'use client';

import React, { useState } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import {
  Plus,
  Search,
  Filter,
  Printer,
  MessageCircle,
  Download,
  Calendar,
  X,
} from 'lucide-react';
import {
  FaReceipt,
  FaCircleCheck,
  FaTriangleExclamation,
  FaClock,
} from 'react-icons/fa6';
import { mockPaiements, mockEtudiants, mockGroupes } from '../../data/mockData';
import { formatDH, formatDate } from '../../lib/utils';
import { Paiement } from '../../types';

export default function PaiementsPage() {
  const [paiementsList, setPaiementsList] = useState<Paiement[]>(mockPaiements);
  const [filterStatut, setFilterStatut] = useState<'all' | 'paye' | 'en_retard' | 'en_attente'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form
  const [etudiantId, setEtudiantId] = useState(mockEtudiants[0]?.id || '');
  const [groupeId, setGroupeId] = useState(mockGroupes[0]?.id || '');
  const [mois, setMois] = useState('Novembre 2026');
  const [montant, setMontant] = useState(350);
  const [modePaiement, setModePaiement] = useState<'Espèces' | 'Virement' | 'Chèque' | 'Application'>('Espèces');

  const filteredPaiements = paiementsList.filter((p) => {
    const etudiant = mockEtudiants.find((e) => e.id === p.etudiantId);
    const matchesSearch =
      `${etudiant?.nom} ${etudiant?.prenom} ${p.recuNumero} ${p.mois}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesStatut = filterStatut === 'all' || p.statut === filterStatut;
    return matchesSearch && matchesStatut;
  });

  const totalEncaisse = paiementsList
    .filter((p) => p.statut === 'paye')
    .reduce((acc, c) => acc + c.montant, 0);

  const totalImpayes = paiementsList
    .filter((p) => p.statut === 'en_retard')
    .reduce((acc, c) => acc + c.montant, 0);

  const handleAddPaiement = (e: React.FormEvent) => {
    e.preventDefault();
    const newPaiement: Paiement = {
      id: `pay-${Date.now()}`,
      etudiantId,
      groupeId,
      mois,
      montant: Number(montant),
      datePaiement: new Date().toISOString().split('T')[0],
      modePaiement,
      statut: 'paye',
      recuNumero: `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    };

    setPaiementsList([newPaiement, ...paiementsList]);
    setIsModalOpen(false);
  };

  const handlePrintReceipt = (recu: string) => {
    alert(`Impression du reçu officiel ${recu} pour le parent d'élève.`);
  };

  return (
    <div className="space-y-6 w-full">
      <PageHeader
        title="Gestion des Paiements & Cotisations"
        description="Suivez les règlements mensuels des étudiants par groupe, éditez des reçus et relancez les impayés."
        badge="Novembre 2026"
        icon={FaReceipt}
        action={{
          label: 'Encaisser un Règlement',
          icon: Plus,
          onClick: () => setIsModalOpen(true),
        }}
      />

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Encaissé ce mois
          </span>
          <div className="text-2xl font-extrabold text-emerald-600 mt-1">
            {formatDH(totalEncaisse)}
          </div>
          <p className="text-xs text-slate-400 mt-1">Cotisations reçues avec reçu</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Impayés & Retards
          </span>
          <div className="text-2xl font-extrabold text-rose-600 mt-1">
            {formatDH(totalImpayes)}
          </div>
          <p className="text-xs text-slate-400 mt-1">À relancer auprès des parents</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Taux de Recouvrement
          </span>
          <div className="text-2xl font-extrabold text-blue-600 mt-1">
            {Math.round((totalEncaisse / (totalEncaisse + totalImpayes || 1)) * 100)}%
          </div>
          <p className="text-xs text-slate-400 mt-1">Progression du mois en cours</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher par élève, reçu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 text-sm rounded-lg outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          {(['all', 'paye', 'en_retard', 'en_attente'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatut(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                filterStatut === st
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {st === 'all'
                ? 'Tous'
                : st === 'paye'
                ? 'Payés'
                : st === 'en_retard'
                ? 'En Retard'
                : 'En Attente'}
            </button>
          ))}
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-xs uppercase font-bold text-slate-500 tracking-wider">
              <tr>
                <th className="px-6 py-3.5">Élève & Reçu</th>
                <th className="px-6 py-3.5">Groupe</th>
                <th className="px-6 py-3.5">Mois concerné</th>
                <th className="px-6 py-3.5">Montant</th>
                <th className="px-6 py-3.5">Date & Mode</th>
                <th className="px-6 py-3.5">Statut</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPaiements.map((p) => {
                const etudiant = mockEtudiants.find((e) => e.id === p.etudiantId);
                const groupe = mockGroupes.find((g) => g.id === p.groupeId);
                const isPaye = p.statut === 'paye';
                const isEnRetard = p.statut === 'en_retard';

                return (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-slate-900">
                          {etudiant ? `${etudiant.nom} ${etudiant.prenom}` : 'Élève'}
                        </p>
                        <p className="text-xs text-slate-400 font-mono">
                          {p.recuNumero || 'Sans reçu (Non réglé)'}
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                        {groupe?.nom}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-xs font-semibold text-slate-700">
                      {p.mois}
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-extrabold text-slate-900 text-sm">
                        {formatDH(p.montant)}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-xs text-slate-600">
                      <div>
                        <span>{p.datePaiement ? formatDate(p.datePaiement) : '-'}</span>
                        <span className="block text-slate-400 font-medium">{p.modePaiement}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-semibold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 ${
                          isPaye
                            ? 'bg-emerald-100 text-emerald-800'
                            : isEnRetard
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {isPaye ? (
                          <>
                            <FaCircleCheck className="w-3 h-3 text-emerald-600" />
                            Réglé
                          </>
                        ) : isEnRetard ? (
                          <>
                            <FaTriangleExclamation className="w-3 h-3 text-rose-600" />
                            En retard
                          </>
                        ) : (
                          <>
                            <FaClock className="w-3 h-3 text-amber-600" />
                            En attente
                          </>
                        )}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {isPaye && (
                          <button
                            onClick={() => handlePrintReceipt(p.recuNumero)}
                            title="Imprimer Reçu de paiement"
                            className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                        )}

                        {isEnRetard && etudiant && (
                          <a
                            href={`https://wa.me/212${etudiant.telephoneParent.replace(/[^0-9]/g, '').slice(1)}?text=Bonjour,%20Rappel%20de%20cotisation%20pour%20${etudiant.prenom}%20au%20centre%20de%20soutien.`}
                            target="_blank"
                            rel="noreferrer"
                            title="Relancer le parent WhatsApp"
                            className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Payment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Encaisser un paiement</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddPaiement} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Élève *</label>
                <select
                  value={etudiantId}
                  onChange={(e) => setEtudiantId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 bg-white"
                >
                  {mockEtudiants.map((et) => (
                    <option key={et.id} value={et.id}>
                      {et.nom} {et.prenom} ({et.niveau})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Groupe concerné *</label>
                <select
                  value={groupeId}
                  onChange={(e) => setGroupeId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 bg-white"
                >
                  {mockGroupes.map((grp) => (
                    <option key={grp.id} value={grp.id}>
                      {grp.nom} ({formatDH(grp.tarifMensuel)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mois</label>
                  <input
                    type="text"
                    value={mois}
                    onChange={(e) => setMois(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Montant (DH)</label>
                  <input
                    type="number"
                    value={montant}
                    onChange={(e) => setMontant(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mode de règlement</label>
                <select
                  value={modePaiement}
                  onChange={(e) => setModePaiement(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 bg-white"
                >
                  <option value="Espèces">Espèces</option>
                  <option value="Virement">Virement bancaire</option>
                  <option value="Chèque">Chèque</option>
                  <option value="Application">Application Mobile / Carte</option>
                </select>
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
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold shadow-xs"
                >
                  Confirmer l'encaissement & Générer reçu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

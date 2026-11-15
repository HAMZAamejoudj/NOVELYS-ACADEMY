'use client';

import React from 'react';
import { FaReceipt, FaArrowRight, FaWhatsapp } from 'react-icons/fa6';
import Link from 'next/link';
import { formatDH, formatDate } from '../../lib/utils';
import { mockPaiements, mockEtudiants, mockGroupes } from '../../data/mockData';

export function RecentPaymentsWidget() {
  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-5 w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FaReceipt className="w-4 h-4 text-teal-600" />
            <span>Paiements & Cotisations Récents</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Suivi des encaissements et relances impayés
          </p>
        </div>
        <Link
          href="/paiements"
          className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1 hover:underline"
        >
          <span>Historique complet</span>
          <FaArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Payments List */}
      <div className="space-y-3">
        {mockPaiements.slice(0, 5).map((paiement) => {
          const etudiant = mockEtudiants.find((e) => e.id === paiement.etudiantId);
          const groupe = mockGroupes.find((g) => g.id === paiement.groupeId);

          const isPaye = paiement.statut === 'paye';
          const isEnRetard = paiement.statut === 'en_retard';

          // Initials for avatar
          const initials = etudiant
            ? `${etudiant.nom.charAt(0)}${etudiant.prenom.charAt(0)}`
            : 'EL';

          return (
            <div
              key={paiement.id}
              className="p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/70 transition-all flex items-center gap-3.5"
            >
              {/* Avatar circle */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs ${
                  isPaye
                    ? 'bg-emerald-100 text-emerald-800'
                    : isEnRetard
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {initials}
              </div>

              {/* Middle details */}
              <div className="flex-1 min-w-0">
                {/* Line 1: Student Name & Amount */}
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-bold text-slate-900 truncate">
                    {etudiant ? `${etudiant.nom} ${etudiant.prenom}` : 'Élève'}
                  </h4>
                  <span className="text-sm font-extrabold text-slate-900 font-mono shrink-0">
                    {formatDH(paiement.montant)}
                  </span>
                </div>

                {/* Line 2: Group name, month & Status badge */}
                <div className="flex items-center justify-between gap-2 mt-1">
                  <div className="flex items-center gap-2 text-xs text-slate-500 truncate">
                    {groupe && (
                      <span className="font-medium text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded text-[11px] truncate">
                        {groupe.nom}
                      </span>
                    )}
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500 text-[11px] shrink-0">
                      {paiement.datePaiement ? formatDate(paiement.datePaiement) : paiement.mois}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${
                        isPaye
                          ? 'bg-emerald-100 text-emerald-800'
                          : isEnRetard
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {isPaye ? 'Réglé' : isEnRetard ? 'En retard' : 'En attente'}
                    </span>

                    {isEnRetard && etudiant && (
                      <a
                        href={`https://wa.me/212${etudiant.telephoneParent.replace(/[^0-9]/g, '').slice(1)}?text=Bonjour,%20Rappel%20de%20cotisation%20pour%20${etudiant.prenom}%20au%20centre%20Novelys%20Academy.`}
                        target="_blank"
                        rel="noreferrer"
                        title="Relancer le parent sur WhatsApp"
                        className="p-1 rounded-md bg-emerald-500 hover:bg-emerald-600 text-white transition-colors flex items-center justify-center"
                      >
                        <FaWhatsapp className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

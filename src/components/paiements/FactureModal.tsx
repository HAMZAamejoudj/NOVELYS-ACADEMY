'use client';

import React from 'react';
import Image from 'next/image';
import { X, Printer, Download, CheckCircle2 } from 'lucide-react';
import { FaCheck, FaReceipt, FaPhone, FaEnvelope, FaGraduationCap } from 'react-icons/fa6';
import { formatDH, formatDate } from '../../lib/utils';
import { Paiement, Etudiant, Groupe } from '../../types';

interface FactureModalProps {
  isOpen: boolean;
  onClose: () => void;
  paiement: Paiement | null;
  etudiant: Etudiant | null;
  groupe: Groupe | null;
}

export function FactureModal({
  isOpen,
  onClose,
  paiement,
  etudiant,
  groupe,
}: FactureModalProps) {
  if (!isOpen || !paiement) return null;

  const handlePrint = () => {
    window.print();
  };

  const recuNum = paiement.recuNumero || `REC-2026-${paiement.id.slice(-4)}`;
  const dateFormatted = paiement.datePaiement ? formatDate(paiement.datePaiement) : formatDate(new Date().toISOString());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto print:p-0 print:bg-white print:static print:inset-auto">
      {/* Container */}
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6 print:border-none print:shadow-none print:my-0 print:max-w-none print:w-full">
        {/* Top Control Bar (Hidden on print) */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <FaReceipt className="w-4 h-4 text-teal-400" />
            <span className="font-bold text-sm">Aperçu du Reçu de Paiement / Facture</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimer la Facture</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Sheet */}
        <div id="printable-receipt" className="p-8 sm:p-10 space-y-6 text-slate-800 bg-white print:p-8">
          {/* Header with Logo & Center Info */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b-2 border-slate-200">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-xl border border-slate-200 p-1 flex items-center justify-center shrink-0 bg-white">
                <Image
                  src="/logo.png"
                  alt="Novelys Academy"
                  width={64}
                  height={64}
                  className="object-contain w-full h-full"
                  priority
                />
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-slate-950 uppercase tracking-wide">
                  Novelys Academy
                </h1>
                <p className="text-xs font-bold text-teal-700 tracking-wider">
                  GRANDIR • APPRENDRE • RÉUSSIR
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Centre de Soutien Scolaire & Perfectionnement
                </p>
              </div>
            </div>

            {/* Receipt Number & Date */}
            <div className="text-left sm:text-right space-y-1">
              <div className="inline-block px-3 py-1 bg-slate-100 border border-slate-200 rounded-md">
                <p className="text-xs font-bold text-slate-900 font-mono tracking-wider">
                  N° {recuNum}
                </p>
              </div>
              <p className="text-xs text-slate-500">
                Date d'émission : <span className="font-semibold text-slate-800">{dateFormatted}</span>
              </p>
              <p className="text-xs text-slate-500">
                Mode : <span className="font-semibold text-slate-800">{paiement.modePaiement}</span>
              </p>
            </div>
          </div>

          {/* Client / Student Information Card */}
          <div className="bg-slate-50/80 p-5 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Informations du Client / Élève
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200">
                Élève Inscrit
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Nom & Prénom de l'élève :</span>
                <span className="font-bold text-slate-900 text-sm">
                  {etudiant ? `${etudiant.nom} ${etudiant.prenom}` : 'Élève'}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">Niveau Scolaire :</span>
                <span className="font-semibold text-slate-800">
                  {etudiant?.niveau || groupe?.niveau || '2ème Bac'}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">Téléphone Élève :</span>
                <span className="font-medium text-slate-700 font-mono">
                  {etudiant?.telephone || 'Non renseigné'}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">Contact Parent / Tuteur :</span>
                <span className="font-bold text-slate-900 font-mono">
                  {etudiant?.telephoneParent || 'Non renseigné'}
                </span>
              </div>
            </div>
          </div>

          {/* Table of Charges */}
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-3">Désignation</th>
                  <th className="p-3">Matière</th>
                  <th className="p-3">Période</th>
                  <th className="p-3 text-right">Montant</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="p-3 font-semibold text-slate-900">
                    Cotisation Mensuelle de Soutien
                    <span className="block text-[11px] font-normal text-slate-500">
                      Groupe : {groupe?.nom || 'Groupe Standard'}
                    </span>
                  </td>
                  <td className="p-3 font-medium text-slate-700">
                    {groupe?.matiere || 'Matière'}
                  </td>
                  <td className="p-3 font-semibold text-slate-700">
                    {paiement.mois}
                  </td>
                  <td className="p-3 text-right font-extrabold text-slate-900 font-mono text-sm">
                    {formatDH(paiement.montant)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Totals & Status Stamp */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2">
            {/* Stamp */}
            <div className="border-2 border-dashed border-emerald-500 rounded-xl px-4 py-2.5 text-center bg-emerald-50/50 rotate-[-2deg]">
              <div className="flex items-center justify-center gap-1.5 text-emerald-700 font-extrabold text-sm uppercase tracking-wider">
                <FaCheck className="w-4 h-4 text-emerald-600" />
                <span>RÉGLÉ - REÇU OFFICIEL</span>
              </div>
              <p className="text-[10px] text-emerald-600 font-medium">
                Paiement validé par l'administration
              </p>
            </div>

            {/* Total Box */}
            <div className="w-full sm:w-64 space-y-1.5 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex justify-between text-slate-600">
                <span>Total Facturé :</span>
                <span className="font-bold">{formatDH(paiement.montant)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Montant Réglé :</span>
                <span className="font-bold text-emerald-600">{formatDH(paiement.montant)}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-1.5 font-bold text-slate-900 text-sm">
                <span>Reste à Payer :</span>
                <span className="text-slate-900">0.00 DH</span>
              </div>
            </div>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-200 text-xs">
            <div className="text-center space-y-8">
              <p className="font-semibold text-slate-600">Signature de l'Élève / Parent</p>
              <div className="h-10 border-b border-dashed border-slate-300 w-32 mx-auto" />
            </div>

            <div className="text-center space-y-8">
              <p className="font-semibold text-slate-600">Cachet & Signature du Centre</p>
              <div className="h-10 border-b border-dashed border-slate-300 w-32 mx-auto" />
            </div>
          </div>

          {/* Legal mentions / Footer */}
          <div className="text-center text-[10px] text-slate-400 pt-4 border-t border-slate-100 leading-relaxed">
            <p className="font-semibold text-slate-500">NOVELYS ACADEMY — Centre de Soutien Scolaire</p>
            <p>Avenue Hassan II, Rabat • Téléphone : 0537-889900 • contact@novelys.ma</p>
            <p className="mt-0.5 italic">Ce reçu fait foi de paiement. Merci pour votre confiance.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

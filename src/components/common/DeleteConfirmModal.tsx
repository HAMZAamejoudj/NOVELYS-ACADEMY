'use client';

import React from 'react';
import { FaTrashCan, FaTriangleExclamation, FaXmark } from 'react-icons/fa6';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  title?: string;
  itemName?: string;
  itemType?: string;
  onConfirm: () => void;
  onClose: () => void;
}

export function DeleteConfirmModal({
  isOpen,
  title = 'Confirmer la suppression',
  itemName,
  itemType = 'cet élément',
  onConfirm,
  onClose,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            <FaTrashCan className="w-6 h-6" />
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <FaXmark className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
          <p className="text-sm text-slate-500 mt-1 leading-relaxed">
            Êtes-vous sûr de vouloir supprimer définitivement {itemType}{' '}
            {itemName && <strong className="text-slate-800">« {itemName} »</strong>} ?
          </p>
          <div className="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-800 text-xs flex items-center gap-2">
            <FaTriangleExclamation className="w-4 h-4 shrink-0 text-amber-600" />
            <span>Cette action retirera l'élément de la liste et des statistiques.</span>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <FaTrashCan className="w-3.5 h-3.5" />
            <span>Supprimer définitivement</span>
          </button>
        </div>
      </div>
    </div>
  );
}

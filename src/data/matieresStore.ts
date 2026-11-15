import { useState, useEffect } from 'react';

export const DEFAULT_MATIERES: string[] = [
  'Mathématiques',
  'Physique-Chimie',
  'SVT (Sciences de la Vie et de la Terre)',
  'Français',
  'Philosophie',
  'Anglais',
  'Arabe',
  'Économie & Organisation',
  'Informatique',
];

const STORAGE_KEY = 'novelys_matieres_list';

export function getStoredMatieres(): string[] {
  if (typeof window === 'undefined') return DEFAULT_MATIERES;
  try {
    const item = localStorage.getItem(STORAGE_KEY);
    if (!item) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_MATIERES));
      return DEFAULT_MATIERES;
    }
    const parsed = JSON.parse(item);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_MATIERES;
  } catch {
    return DEFAULT_MATIERES;
  }
}

export function saveStoredMatieres(list: string[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event('matieres_updated'));
  } catch (err) {
    console.error('Failed to save matieres to localStorage', err);
  }
}

export function useMatieres() {
  const [matieres, setMatieres] = useState<string[]>(DEFAULT_MATIERES);

  useEffect(() => {
    setMatieres(getStoredMatieres());

    const handleUpdate = () => {
      setMatieres(getStoredMatieres());
    };

    window.addEventListener('matieres_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('matieres_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const addMatiere = (nom: string): boolean => {
    const trimmed = nom.trim();
    if (!trimmed) return false;
    if (matieres.some((m) => m.toLowerCase() === trimmed.toLowerCase())) return false;

    const updated = [...matieres, trimmed];
    saveStoredMatieres(updated);
    setMatieres(updated);
    return true;
  };

  const updateMatiere = (oldNom: string, newNom: string): boolean => {
    const trimmed = newNom.trim();
    if (!trimmed) return false;
    if (
      trimmed.toLowerCase() !== oldNom.toLowerCase() &&
      matieres.some((m) => m.toLowerCase() === trimmed.toLowerCase())
    ) {
      return false;
    }

    const updated = matieres.map((m) => (m === oldNom ? trimmed : m));
    saveStoredMatieres(updated);
    setMatieres(updated);
    return true;
  };

  const deleteMatiere = (nom: string): void => {
    const updated = matieres.filter((m) => m !== nom);
    saveStoredMatieres(updated);
    setMatieres(updated);
  };

  const resetToDefault = (): void => {
    saveStoredMatieres(DEFAULT_MATIERES);
    setMatieres(DEFAULT_MATIERES);
  };

  return {
    matieres,
    addMatiere,
    updateMatiere,
    deleteMatiere,
    resetToDefault,
  };
}

import { useState, useEffect } from 'react';
import {
  mockEtudiants,
  mockProfesseurs,
  mockGroupes,
  mockSalles,
  mockPaiements,
} from './mockData';
import { Etudiant, Professeur, Groupe, Salle, Paiement } from '../types';

// ==========================================
// 1. ÉTUDIANTS STORE
// ==========================================
const ETUDIANTS_KEY = 'novelys_etudiants_data_v1';

export function getStoredEtudiants(): Etudiant[] {
  if (typeof window === 'undefined') return mockEtudiants;
  try {
    const raw = localStorage.getItem(ETUDIANTS_KEY);
    if (!raw) {
      localStorage.setItem(ETUDIANTS_KEY, JSON.stringify(mockEtudiants));
      return mockEtudiants;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : mockEtudiants;
  } catch {
    return mockEtudiants;
  }
}

export function saveStoredEtudiants(list: Etudiant[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ETUDIANTS_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event('etudiants_updated'));
  } catch (err) {
    console.error('Erreur sauvegarde etudiantsStore:', err);
  }
}

export function useEtudiants() {
  const [etudiants, setEtudiants] = useState<Etudiant[]>(mockEtudiants);

  useEffect(() => {
    setEtudiants(getStoredEtudiants());
    const onUpdate = () => setEtudiants(getStoredEtudiants());
    window.addEventListener('etudiants_updated', onUpdate);
    return () => window.removeEventListener('etudiants_updated', onUpdate);
  }, []);

  const addEtudiant = (newEt: Etudiant) => {
    const updated = [newEt, ...etudiants];
    saveStoredEtudiants(updated);
    setEtudiants(updated);
  };

  const updateEtudiant = (id: string, updates: Partial<Etudiant>) => {
    const updated = etudiants.map((e) => (e.id === id ? { ...e, ...updates } : e));
    saveStoredEtudiants(updated);
    setEtudiants(updated);
  };

  const deleteEtudiant = (id: string) => {
    const updated = etudiants.filter((e) => e.id !== id);
    saveStoredEtudiants(updated);
    setEtudiants(updated);
  };

  const resetEtudiants = () => {
    saveStoredEtudiants(mockEtudiants);
    setEtudiants(mockEtudiants);
  };

  return { etudiants, addEtudiant, updateEtudiant, deleteEtudiant, resetEtudiants };
}

// ==========================================
// 2. PROFESSEURS STORE
// ==========================================
const PROFESSEURS_KEY = 'novelys_professeurs_data_v1';

export function getStoredProfesseurs(): Professeur[] {
  if (typeof window === 'undefined') return mockProfesseurs;
  try {
    const raw = localStorage.getItem(PROFESSEURS_KEY);
    if (!raw) {
      localStorage.setItem(PROFESSEURS_KEY, JSON.stringify(mockProfesseurs));
      return mockProfesseurs;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : mockProfesseurs;
  } catch {
    return mockProfesseurs;
  }
}

export function saveStoredProfesseurs(list: Professeur[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PROFESSEURS_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event('professeurs_updated'));
  } catch (err) {
    console.error('Erreur sauvegarde professeursStore:', err);
  }
}

export function useProfesseurs() {
  const [professeurs, setProfesseurs] = useState<Professeur[]>(mockProfesseurs);

  useEffect(() => {
    setProfesseurs(getStoredProfesseurs());
    const onUpdate = () => setProfesseurs(getStoredProfesseurs());
    window.addEventListener('professeurs_updated', onUpdate);
    return () => window.removeEventListener('professeurs_updated', onUpdate);
  }, []);

  const addProfesseur = (newProf: Professeur) => {
    const updated = [newProf, ...professeurs];
    saveStoredProfesseurs(updated);
    setProfesseurs(updated);
  };

  const updateProfesseur = (id: string, updates: Partial<Professeur>) => {
    const updated = professeurs.map((p) => (p.id === id ? { ...p, ...updates } : p));
    saveStoredProfesseurs(updated);
    setProfesseurs(updated);
  };

  const deleteProfesseur = (id: string) => {
    const updated = professeurs.filter((p) => p.id !== id);
    saveStoredProfesseurs(updated);
    setProfesseurs(updated);
  };

  const resetProfesseurs = () => {
    saveStoredProfesseurs(mockProfesseurs);
    setProfesseurs(mockProfesseurs);
  };

  return { professeurs, addProfesseur, updateProfesseur, deleteProfesseur, resetProfesseurs };
}

// ==========================================
// 3. GROUPES STORE
// ==========================================
const GROUPES_KEY = 'novelys_groupes_data_v1';

export function getStoredGroupes(): Groupe[] {
  if (typeof window === 'undefined') return mockGroupes;
  try {
    const raw = localStorage.getItem(GROUPES_KEY);
    if (!raw) {
      localStorage.setItem(GROUPES_KEY, JSON.stringify(mockGroupes));
      return mockGroupes;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : mockGroupes;
  } catch {
    return mockGroupes;
  }
}

export function saveStoredGroupes(list: Groupe[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(GROUPES_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event('groupes_updated'));
  } catch (err) {
    console.error('Erreur sauvegarde groupesStore:', err);
  }
}

export function useGroupes() {
  const [groupes, setGroupes] = useState<Groupe[]>(mockGroupes);

  useEffect(() => {
    setGroupes(getStoredGroupes());
    const onUpdate = () => setGroupes(getStoredGroupes());
    window.addEventListener('groupes_updated', onUpdate);
    return () => window.removeEventListener('groupes_updated', onUpdate);
  }, []);

  const addGroupe = (newGrp: Groupe) => {
    const updated = [newGrp, ...groupes];
    saveStoredGroupes(updated);
    setGroupes(updated);
  };

  const updateGroupe = (id: string, updates: Partial<Groupe>) => {
    const updated = groupes.map((g) => (g.id === id ? { ...g, ...updates } : g));
    saveStoredGroupes(updated);
    setGroupes(updated);
  };

  const deleteGroupe = (id: string) => {
    const updated = groupes.filter((g) => g.id !== id);
    saveStoredGroupes(updated);
    setGroupes(updated);
  };

  const resetGroupes = () => {
    saveStoredGroupes(mockGroupes);
    setGroupes(mockGroupes);
  };

  return { groupes, addGroupe, updateGroupe, deleteGroupe, resetGroupes };
}

// ==========================================
// 4. SALLES STORE
// ==========================================
const SALLES_KEY = 'novelys_salles_data_v1';

export function getStoredSalles(): Salle[] {
  if (typeof window === 'undefined') return mockSalles;
  try {
    const raw = localStorage.getItem(SALLES_KEY);
    if (!raw) {
      localStorage.setItem(SALLES_KEY, JSON.stringify(mockSalles));
      return mockSalles;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : mockSalles;
  } catch {
    return mockSalles;
  }
}

export function saveStoredSalles(list: Salle[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SALLES_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event('salles_updated'));
  } catch (err) {
    console.error('Erreur sauvegarde sallesStore:', err);
  }
}

export function useSalles() {
  const [salles, setSalles] = useState<Salle[]>(mockSalles);

  useEffect(() => {
    setSalles(getStoredSalles());
    const onUpdate = () => setSalles(getStoredSalles());
    window.addEventListener('salles_updated', onUpdate);
    return () => window.removeEventListener('salles_updated', onUpdate);
  }, []);

  const addSalle = (newSalle: Salle) => {
    const updated = [...salles, newSalle];
    saveStoredSalles(updated);
    setSalles(updated);
  };

  const updateSalle = (id: string, updates: Partial<Salle>) => {
    const updated = salles.map((s) => (s.id === id ? { ...s, ...updates } : s));
    saveStoredSalles(updated);
    setSalles(updated);
  };

  const deleteSalle = (id: string) => {
    const updated = salles.filter((s) => s.id !== id);
    saveStoredSalles(updated);
    setSalles(updated);
  };

  const resetSalles = () => {
    saveStoredSalles(mockSalles);
    setSalles(mockSalles);
  };

  return { salles, addSalle, updateSalle, deleteSalle, resetSalles };
}

// ==========================================
// 5. PAIEMENTS STORE
// ==========================================
const PAIEMENTS_KEY = 'novelys_paiements_data_v1';

export function getStoredPaiements(): Paiement[] {
  if (typeof window === 'undefined') return mockPaiements;
  try {
    const raw = localStorage.getItem(PAIEMENTS_KEY);
    if (!raw) {
      localStorage.setItem(PAIEMENTS_KEY, JSON.stringify(mockPaiements));
      return mockPaiements;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : mockPaiements;
  } catch {
    return mockPaiements;
  }
}

export function saveStoredPaiements(list: Paiement[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PAIEMENTS_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event('paiements_updated'));
  } catch (err) {
    console.error('Erreur sauvegarde paiementsStore:', err);
  }
}

export function usePaiements() {
  const [paiements, setPaiements] = useState<Paiement[]>(mockPaiements);

  useEffect(() => {
    setPaiements(getStoredPaiements());
    const onUpdate = () => setPaiements(getStoredPaiements());
    window.addEventListener('paiements_updated', onUpdate);
    return () => window.removeEventListener('paiements_updated', onUpdate);
  }, []);

  const addPaiement = (newPay: Paiement) => {
    const updated = [newPay, ...paiements];
    saveStoredPaiements(updated);
    setPaiements(updated);
  };

  const updatePaiement = (id: string, updates: Partial<Paiement>) => {
    const updated = paiements.map((p) => (p.id === id ? { ...p, ...updates } : p));
    saveStoredPaiements(updated);
    setPaiements(updated);
  };

  const deletePaiement = (id: string) => {
    const updated = paiements.filter((p) => p.id !== id);
    saveStoredPaiements(updated);
    setPaiements(updated);
  };

  const resetPaiements = () => {
    saveStoredPaiements(mockPaiements);
    setPaiements(mockPaiements);
  };

  return { paiements, addPaiement, updatePaiement, deletePaiement, resetPaiements };
}

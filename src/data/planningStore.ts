import { mockGroupes, mockProfesseurs, mockSalles } from './mockData';

export interface PlanningSeance {
  id: string;
  groupeId: string;
  groupeNom: string;
  matiere: string;
  professeurId: string;
  professeurNom: string;
  salleId: string;
  salleNom: string;
  jour: 'Lundi' | 'Mardi' | 'Mercredi' | 'Jeudi' | 'Vendredi' | 'Samedi' | 'Dimanche';
  heureDebut: string;
  heureFin: string;
}

const STORAGE_KEY = 'novelys_planning_seances_v1';

// Initial sessions derived from mockGroupes
function getInitialSeances(): PlanningSeance[] {
  return mockGroupes.flatMap((grp) => {
    const prof = mockProfesseurs.find((p) => p.id === grp.professeurId);
    return grp.horaires.map((h) => {
      const salle = mockSalles.find((s) => s.id === h.salleId) || mockSalles.find((s) => s.id === grp.salleDefautId);
      return {
        id: `${grp.id}-${h.jour}-${h.heureDebut}`,
        groupeId: grp.id,
        groupeNom: grp.nom,
        matiere: grp.matiere,
        professeurId: grp.professeurId,
        professeurNom: prof ? `Pr. ${prof.prenom} ${prof.nom}` : 'Professeur',
        salleId: salle?.id || '',
        salleNom: salle?.nom || 'Salle Non Définie',
        jour: h.jour as PlanningSeance['jour'],
        heureDebut: h.heureDebut,
        heureFin: h.heureFin,
      };
    });
  });
}

export function getPlanningSeances(): PlanningSeance[] {
  if (typeof window === 'undefined') {
    return getInitialSeances();
  }
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      const initial = getInitialSeances();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(stored);
  } catch (err) {
    console.error('Erreur lecture planningStore:', err);
    return getInitialSeances();
  }
}

export function savePlanningSeances(seances: PlanningSeance[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seances));
    window.dispatchEvent(new Event('planningStoreUpdated'));
  } catch (err) {
    console.error('Erreur sauvegarde planningStore:', err);
  }
}

// Convert "17:30" to minutes from midnight
export function timeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

// Check time overlap between two intervals [startA, endA] and [startB, endB]
export function isOverlapping(
  startA: string,
  endA: string,
  startB: string,
  endB: string
): boolean {
  const sA = timeToMinutes(startA);
  const eA = timeToMinutes(endA);
  const sB = timeToMinutes(startB);
  const eB = timeToMinutes(endB);
  return Math.max(sA, sB) < Math.min(eA, eB);
}

export interface ConflictResult {
  hasConflict: boolean;
  type?: 'salle' | 'professeur';
  conflictingSeance?: PlanningSeance;
  message?: string;
}

// Verify if a session causes a conflict with existing sessions
export function detectConflict(
  seance: {
    id?: string;
    jour: PlanningSeance['jour'];
    heureDebut: string;
    heureFin: string;
    salleId: string;
    professeurId: string;
  },
  existingSeances: PlanningSeance[]
): ConflictResult {
  for (const s of existingSeances) {
    if (seance.id && s.id === seance.id) continue; // skip self when updating
    if (s.jour !== seance.jour) continue;

    if (isOverlapping(seance.heureDebut, seance.heureFin, s.heureDebut, s.heureFin)) {
      // Check salle conflict
      if (seance.salleId && s.salleId && seance.salleId === s.salleId) {
        return {
          hasConflict: true,
          type: 'salle',
          conflictingSeance: s,
          message: `Conflit de Salle : La salle "${s.salleNom}" est déjà occupée par le groupe "${s.groupeNom}" de ${s.heureDebut} à ${s.heureFin}.`,
        };
      }
      // Check professeur conflict
      if (seance.professeurId && s.professeurId && seance.professeurId === s.professeurId) {
        return {
          hasConflict: true,
          type: 'professeur',
          conflictingSeance: s,
          message: `Conflit d'Enseignant : Le ${s.professeurNom} anime déjà un cours avec "${s.groupeNom}" de ${s.heureDebut} à ${s.heureFin}.`,
        };
      }
    }
  }

  return { hasConflict: false };
}

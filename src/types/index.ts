export type StatutEtudiant = 'actif' | 'suspendu' | 'inactif';
export type StatutPaiement = 'paye' | 'en_retard' | 'en_attente';
export type StatutSalle = 'disponible' | 'occupee' | 'maintenance';
export type StatutPresence = 'present' | 'absent' | 'retard' | 'excuse';

export interface Etudiant {
  id: string;
  nom: string;
  prenom: string;
  telephone: string;
  telephoneParent: string;
  email?: string;
  niveau: string; // ex: 2ème Bac PC, 1ère Bac SM, 3ème Collège
  groupesIds: string[];
  dateInscription: string;
  statut: StatutEtudiant;
  avatarUrl?: string;
  adresse?: string;
}

export interface Professeur {
  id: string;
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  matieres: string[]; // ex: ['Mathématiques', 'Physique-Chimie']
  statut: 'actif' | 'inactif';
  pourcentage: number; // ex: 60% (% perçu sur les cotisations des élèves de ses groupes)
  experience?: string;
  groupesIds: string[];
}

export interface Salle {
  id: string;
  nom: string; // ex: 'Salle 101 (Ibn Sina)', 'Labo Physique'
  etage: string;
  capacite: number;
  equipements: string[]; // ['Vidéoprojecteur', 'Climatisation', 'Tableau Blanc']
  statut: StatutSalle;
}

export interface SeanceHebdo {
  jour: 'Lundi' | 'Mardi' | 'Mercredi' | 'Jeudi' | 'Vendredi' | 'Samedi' | 'Dimanche';
  heureDebut: string; // '17:00'
  heureFin: string; // '19:00'
  salleId: string;
}

export interface Groupe {
  id: string;
  nom: string; // ex: '2 Bac PC - Groupe A'
  code: string; // ex: '2BAC-PC-A'
  matiere: string; // ex: 'Mathématiques'
  niveau: string; // ex: '2ème Bac SM'
  professeurId: string;
  salleDefautId: string;
  capaciteMax: number;
  tarifMensuel: number; // ex: 350 DH
  statut: 'ouvert' | 'complet' | 'archive';
  horaires: SeanceHebdo[];
}

export interface Paiement {
  id: string;
  etudiantId: string;
  groupeId: string;
  mois: string; // 'Novembre 2026'
  montant: number;
  datePaiement: string;
  modePaiement: 'Espèces' | 'Virement' | 'Chèque' | 'Application';
  statut: StatutPaiement;
  recuNumero: string;
  remarque?: string;
}

export interface PointagePresence {
  id: string;
  seanceId: string;
  groupeId: string;
  etudiantId: string;
  date: string;
  statut: StatutPresence;
  remarque?: string;
}

export interface SeanceDuJour {
  id: string;
  groupeId: string;
  groupeNom: string;
  matiere: string;
  professeurId: string;
  professeurNom: string;
  salleId: string;
  salleNom: string;
  heureDebut: string;
  heureFin: string;
  totalEtudiants: number;
  statut: 'a_venir' | 'en_cours' | 'terminee';
}

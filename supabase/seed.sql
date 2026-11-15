-- =====================================================================
-- NOVELYS ACADEMY - Données Initiales (Seed Data)
-- =====================================================================

-- Insertion des Salles
insert into public.salles (id, nom, etage, capacite, equipements, statut) values
  ('b1111111-1111-1111-1111-111111111111', 'Salle 1 - Ibn Sina', '1er Étage', 25, array['Vidéoprojecteur', 'Climatisation', 'Tableau Blanc magnétique'], 'occupee'),
  ('b2222222-2222-2222-2222-222222222222', 'Salle 2 - Al-Khawarizmi', '1er Étage', 20, array['Climatisation', 'Grand Tableau Blanc'], 'disponible'),
  ('b3333333-3333-3333-3333-333333333333', 'Salle 3 - Ibn Rochd', '2ème Étage', 18, array['Vidéoprojecteur', 'Climatisation'], 'disponible'),
  ('b4444444-4444-4444-4444-444444444444', 'Labo Scientifique (S4)', 'RDC', 22, array['Vidéoprojecteur', 'Matériel de Chimie & Physique', 'Climatisation'], 'occupee'),
  ('b5555555-5555-5555-5555-555555555555', 'Salle VIP - Séminaire', '2ème Étage', 12, array['Écran Tactile Interactif', 'Climatisation', 'Tables modulables'], 'maintenance')
on conflict (id) do nothing;

-- Insertion des Professeurs
insert into public.professeurs (id, nom, prenom, telephone, email, matieres, pourcentage, experience, statut) values
  ('c1111111-1111-1111-1111-111111111111', 'Alami', 'Mohamed', '0661-123456', 'm.alami@novelys.ma', array['Mathématiques'], 60.00, '15 ans d''expérience en lycée public & CPGE', 'actif'),
  ('c2222222-2222-2222-2222-222222222222', 'Berrada', 'Kawtar', '0662-789012', 'k.berrada@novelys.ma', array['Physique-Chimie'], 55.00, 'Doctorante en Physique Appliquée, 8 ans en soutien', 'actif'),
  ('c3333333-3333-3333-3333-333333333333', 'Chraibi', 'Youssef', '0663-456789', 'y.chraibi@novelys.ma', array['SVT'], 50.00, 'Professeur agrégé en Sciences de la Vie et de la Terre', 'actif'),
  ('c4444444-4444-4444-4444-444444444444', 'Tazi', 'Amina', '0664-987654', 'a.tazi@novelys.ma', array['Français', 'Philosophie'], 50.00, 'Spécialiste préparation épreuves régionales 1ère Bac', 'actif'),
  ('c5555555-5555-5555-5555-555555555555', 'Mansour', 'Hassan', '0665-321654', 'h.mansour@novelys.ma', array['Anglais'], 50.00, 'Formateur certifié TOEFL/IELTS', 'inactif')
on conflict (id) do nothing;

-- Insertion des Groupes
insert into public.groupes (id, nom, matiere, niveau, professeur_id, salle_defaut_id, tarif_mensuel, capacite_max, statut, horaires) values
  ('d1111111-1111-1111-1111-111111111111', '2 Bac SM - Maths Groupe A', 'Mathématiques', '2ème Bac Sciences Maths', 'c1111111-1111-1111-1111-111111111111', 'b1111111-1111-1111-1111-111111111111', 400.00, 18, 'ouvert', '[{"jour": "Mercredi", "heureDebut": "17:30", "heureFin": "19:30", "salleId": "b1111111-1111-1111-1111-111111111111"}, {"jour": "Samedi", "heureDebut": "15:00", "heureFin": "17:00", "salleId": "b1111111-1111-1111-1111-111111111111"}]'::jsonb),
  ('d2222222-2222-2222-2222-222222222222', '2 Bac PC - Physique Groupe B', 'Physique-Chimie', '2ème Bac Sciences Physiques', 'c2222222-2222-2222-2222-222222222222', 'b4444444-4444-4444-4444-444444444444', 350.00, 20, 'ouvert', '[{"jour": "Mardi", "heureDebut": "18:00", "heureFin": "20:00", "salleId": "b4444444-4444-4444-4444-444444444444"}, {"jour": "Vendredi", "heureDebut": "18:00", "heureFin": "20:00", "salleId": "b4444444-4444-4444-4444-444444444444"}]'::jsonb),
  ('d3333333-3333-3333-3333-333333333333', '2 Bac SVT - Sciences Groupe A', 'SVT', '2ème Bac SVT', 'c3333333-3333-3333-3333-333333333333', 'b3333333-3333-3333-3333-333333333333', 350.00, 16, 'ouvert', '[{"jour": "Mercredi", "heureDebut": "15:00", "heureFin": "17:00", "salleId": "b3333333-3333-3333-3333-333333333333"}, {"jour": "Dimanche", "heureDebut": "10:00", "heureFin": "12:00", "salleId": "b3333333-3333-3333-3333-333333333333"}]'::jsonb),
  ('d4444444-4444-4444-4444-444444444444', '1 Bac - Français Examen Régional', 'Français', '1ère Bac', 'c4444444-4444-4444-4444-444444444444', 'b1111111-1111-1111-1111-111111111111', 300.00, 22, 'complet', '[{"jour": "Dimanche", "heureDebut": "14:00", "heureFin": "16:30", "salleId": "b1111111-1111-1111-1111-111111111111"}]'::jsonb),
  ('d5555555-5555-5555-5555-555555555555', 'Tronc Commun - PC Groupe A', 'Physique-Chimie', 'Tronc Commun Scientifique', 'c2222222-2222-2222-2222-222222222222', 'b4444444-4444-4444-4444-444444444444', 300.00, 18, 'ouvert', '[{"jour": "Samedi", "heureDebut": "10:00", "heureFin": "12:00", "salleId": "b4444444-4444-4444-4444-444444444444"}]'::jsonb),
  ('d6666666-6666-6666-6666-666666666666', '1 Bac SM - Maths Groupe C', 'Mathématiques', '1ère Bac Sciences Maths', 'c1111111-1111-1111-1111-111111111111', 'b2222222-2222-2222-2222-222222222222', 350.00, 20, 'ouvert', '[{"jour": "Lundi", "heureDebut": "17:30", "heureFin": "19:30", "salleId": "b2222222-2222-2222-2222-222222222222"}, {"jour": "Jeudi", "heureDebut": "17:30", "heureFin": "19:30", "salleId": "b2222222-2222-2222-2222-222222222222"}]'::jsonb)
on conflict (id) do nothing;

-- Insertion des Étudiants
insert into public.etudiants (id, nom, prenom, telephone, telephone_parent, niveau, date_inscription, statut) values
  ('e1111111-1111-1111-1111-111111111111', 'Bennani', 'Amine', '0671-112233', '0661-998877', '2ème Bac Sciences Maths', '2026-09-10', 'actif'),
  ('e2222222-2222-2222-2222-222222222222', 'Idrissi', 'Salma', '0672-223344', '0662-887766', '2ème Bac Sciences Physiques', '2026-09-12', 'actif'),
  ('e3333333-3333-3333-3333-333333333333', 'Mansouri', 'Yassine', '0673-334455', '0663-442211', '2ème Bac Sciences Maths', '2026-09-15', 'actif'),
  ('e4444444-4444-4444-4444-444444444444', 'Zahidi', 'Nour', '0674-445566', '0664-553322', '1ère Bac Sciences Maths', '2026-09-18', 'actif'),
  ('e5555555-5555-5555-5555-555555555555', 'Ouazzani', 'Hamza', '0675-556677', '0665-664433', '2ème Bac SVT', '2026-09-20', 'suspendu'),
  ('e6666666-6666-6666-6666-666666666666', 'El Fassi', 'Rim', '0676-667788', '0666-775544', 'Tronc Commun Scientifique', '2026-09-22', 'actif')
on conflict (id) do nothing;

-- Insertion des Paiements
insert into public.paiements (id, etudiant_id, groupe_id, mois, montant, date_paiement, mode_paiement, statut, recu_numero) values
  ('f1111111-1111-1111-1111-111111111111', 'e1111111-1111-1111-1111-111111111111', 'd1111111-1111-1111-1111-111111111111', 'Novembre 2026', 400.00, '2026-11-02', 'especes', 'paye', 'REC-2026-0142'),
  ('f2222222-2222-2222-2222-222222222222', 'e1111111-1111-1111-1111-111111111111', 'd2222222-2222-2222-2222-222222222222', 'Novembre 2026', 350.00, '2026-11-02', 'virement', 'paye', 'REC-2026-0143'),
  ('f3333333-3333-3333-3333-333333333333', 'e2222222-2222-2222-2222-222222222222', 'd2222222-2222-2222-2222-222222222222', 'Novembre 2026', 350.00, '2026-11-05', 'especes', 'paye', 'REC-2026-0158'),
  ('f4444444-4444-4444-4444-444444444444', 'e3333333-3333-3333-3333-333333333333', 'd1111111-1111-1111-1111-111111111111', 'Novembre 2026', 400.00, null, 'especes', 'en_retard', 'REC-2026-PENDING-01'),
  ('f5555555-5555-5555-5555-555555555555', 'e4444444-4444-4444-4444-444444444444', 'd6666666-6666-6666-6666-666666666666', 'Novembre 2026', 350.00, null, 'virement', 'en_attente', 'REC-2026-PENDING-02')
on conflict (id) do nothing;

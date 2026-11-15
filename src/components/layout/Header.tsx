'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  Bell,
  Plus,
  Calendar,
  X,
  Users,
  GraduationCap,
  Layers,
  DoorOpen,
  ArrowRight,
  Clock,
  ChevronDown,
  MessageCircle,
  Command,
} from 'lucide-react';
import { FaCheck, FaCircleCheck, FaTriangleExclamation } from 'react-icons/fa6';
import { mockEtudiants, mockProfesseurs, mockGroupes, mockSalles } from '../../data/mockData';
import { Etudiant } from '../../types';

export function Header() {
  const router = useRouter();

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Notifications State
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  const notifRef = useRef<HTMLDivElement>(null);

  // Academic Year State
  const [isYearOpen, setIsYearOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState('2026/2027');
  const yearRef = useRef<HTMLDivElement>(null);

  // New Student Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSuccess, setModalSuccess] = useState(false);
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [tel, setTel] = useState('');
  const [telParent, setTelParent] = useState('');
  const [niveau, setNiveau] = useState('2ème Bac Sciences Maths');
  const [groupeId, setGroupeId] = useState(mockGroupes[0]?.id || '');

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
      if (yearRef.current && !yearRef.current.contains(event.target as Node)) {
        setIsYearOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut Ctrl+K
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setIsNotifOpen(false);
        setIsYearOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filtered Search Results
  const query = searchQuery.trim().toLowerCase();
  const filteredEtudiants = query
    ? mockEtudiants.filter((e) =>
        `${e.nom} ${e.prenom} ${e.telephone} ${e.niveau}`.toLowerCase().includes(query)
      )
    : [];
  const filteredProfs = query
    ? mockProfesseurs.filter((p) =>
        `${p.nom} ${p.prenom} ${p.matieres.join(' ')}`.toLowerCase().includes(query)
      )
    : [];
  const filteredGroupes = query
    ? mockGroupes.filter((g) =>
        `${g.nom} ${g.matiere} ${g.niveau}`.toLowerCase().includes(query)
      )
    : [];
  const filteredSalles = query
    ? mockSalles.filter((s) => `${s.nom} ${s.etage}`.toLowerCase().includes(query))
    : [];

  const totalResults =
    filteredEtudiants.length +
    filteredProfs.length +
    filteredGroupes.length +
    filteredSalles.length;

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nom || !prenom || !tel) return;

    setModalSuccess(true);
    setTimeout(() => {
      setModalSuccess(false);
      setIsModalOpen(false);
      setNom('');
      setPrenom('');
      setTel('');
      setTelParent('');
    }, 1500);
  };

  return (
    <>
      <header className="h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-6 flex items-center justify-between sticky top-0 z-40 shadow-xs transition-all">
        {/* Search Bar with Spotlight dropdown */}
        <div ref={searchRef} className="relative flex items-center w-full max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              placeholder="Rechercher élève, prof, groupe, salle..."
              className="w-full pl-10 pr-20 py-2 bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-sm rounded-xl border border-transparent focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-slate-400 font-medium text-slate-800"
            />
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-md"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-200/70 text-[10px] font-bold text-slate-500 pointer-events-none border border-slate-300/60">
                <Command className="w-2.5 h-2.5" />
                <span>K</span>
              </div>
            )}
          </div>

          {/* Live Search Dropdown */}
          {isSearchOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden z-50 max-h-[460px] flex flex-col animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="p-3 bg-slate-50/90 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>
                  {searchQuery ? (
                    <>Résultats pour "<strong>{searchQuery}</strong>" ({totalResults})</>
                  ) : (
                    'Recherche rapide dans tout le centre'
                  )}
                </span>
                <span className="text-[10px] text-slate-400">Échap pour fermer</span>
              </div>

              <div className="p-2 overflow-y-auto space-y-3 divide-y divide-slate-100">
                {/* Students */}
                {filteredEtudiants.length > 0 && (
                  <div className="pt-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block mb-1">
                      Élèves ({filteredEtudiants.length})
                    </span>
                    {filteredEtudiants.map((et) => (
                      <Link
                        key={et.id}
                        href="/etudiants"
                        onClick={() => setIsSearchOpen(false)}
                        className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors group"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                            {et.prenom[0]}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                              {et.nom} {et.prenom}
                            </p>
                            <p className="text-[11px] text-slate-400">{et.niveau}</p>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-600 transition-colors" />
                      </Link>
                    ))}
                  </div>
                )}

                {/* Teachers */}
                {filteredProfs.length > 0 && (
                  <div className="pt-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block mb-1">
                      Professeurs ({filteredProfs.length})
                    </span>
                    {filteredProfs.map((pr) => (
                      <Link
                        key={pr.id}
                        href="/professeurs"
                        onClick={() => setIsSearchOpen(false)}
                        className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors group"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
                            <GraduationCap className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                              Pr. {pr.prenom} {pr.nom}
                            </p>
                            <p className="text-[11px] text-slate-400">
                              {pr.matieres.join(', ')} • {pr.pourcentage}%
                            </p>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-600 transition-colors" />
                      </Link>
                    ))}
                  </div>
                )}

                {/* Groups */}
                {filteredGroupes.length > 0 && (
                  <div className="pt-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block mb-1">
                      Groupes ({filteredGroupes.length})
                    </span>
                    {filteredGroupes.map((grp) => (
                      <Link
                        key={grp.id}
                        href="/groupes"
                        onClick={() => setIsSearchOpen(false)}
                        className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors group"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center">
                            <Layers className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                              {grp.nom}
                            </p>
                            <p className="text-[11px] text-slate-400">{grp.niveau}</p>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-600 transition-colors" />
                      </Link>
                    ))}
                  </div>
                )}

                {/* Rooms */}
                {filteredSalles.length > 0 && (
                  <div className="pt-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block mb-1">
                      Salles ({filteredSalles.length})
                    </span>
                    {filteredSalles.map((sl) => (
                      <Link
                        key={sl.id}
                        href="/salles"
                        onClick={() => setIsSearchOpen(false)}
                        className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors group"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 font-bold text-xs flex items-center justify-center">
                            <DoorOpen className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                              {sl.nom}
                            </p>
                            <p className="text-[11px] text-slate-400">
                              {sl.etage} • {sl.statut}
                            </p>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-600 transition-colors" />
                      </Link>
                    ))}
                  </div>
                )}

                {searchQuery && totalResults === 0 && (
                  <div className="p-6 text-center text-xs text-slate-400 space-y-1">
                    <p className="font-semibold text-slate-600">Aucun résultat trouvé pour "{searchQuery}"</p>
                    <p>Vérifiez l'orthographe du nom ou du groupe.</p>
                  </div>
                )}

                {!searchQuery && (
                  <div className="p-3 text-xs text-slate-400 text-center">
                    Tapez le nom d'un élève, professeur, matière ou salle...
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-3">
          {/* Interactive Academic Year Dropdown */}
          <div ref={yearRef} className="relative hidden md:block">
            <button
              onClick={() => setIsYearOpen((prev) => !prev)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100/70 hover:to-indigo-100/70 border border-blue-200/80 text-xs font-bold text-blue-800 shadow-2xs transition-all cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              <span>Année {selectedYear}</span>
              <ChevronDown className="w-3 h-3 text-blue-500" />
            </button>

            {isYearOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl border border-slate-200 shadow-xl p-1.5 z-50 animate-in fade-in slide-in-from-top-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1 block">
                  Changer de Session
                </span>
                {['2026/2027', '2025/2026', '2024/2025'].map((yr) => (
                  <button
                    key={yr}
                    onClick={() => {
                      setSelectedYear(yr);
                      setIsYearOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
                      selectedYear === yr
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>Session {yr}</span>
                    {selectedYear === yr && <FaCheck className="w-3 h-3" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Interactive Notifications Center */}
          <div ref={notifRef} className="relative">
            <button
              onClick={() => setIsNotifOpen((prev) => !prev)}
              title="Centre de notifications"
              className="relative p-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white animate-pulse" />
              )}
            </button>

            {/* Notification Dropdown Panel */}
            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl border border-slate-200 shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">Notifications & Alertes</h3>
                    {unreadCount > 0 && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                        {unreadCount} nouvelles
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={() => setUnreadCount(0)}
                      className="text-[11px] font-medium text-blue-600 hover:underline"
                    >
                      Tout marquer lu
                    </button>
                  )}
                </div>

                <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto mt-1 space-y-1">
                  {/* Item 1 */}
                  <div className="py-2.5 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                      <FaTriangleExclamation className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-slate-900">Retard de paiement</p>
                      <p className="text-[11px] text-slate-500">
                        Hamza Ouazzani (2 Bac SVT) • 2 mois impayés (300 DH).
                      </p>
                      <div className="mt-1.5 flex gap-2">
                        <Link
                          href="/paiements"
                          onClick={() => setIsNotifOpen(false)}
                          className="text-[10px] font-bold text-blue-600 hover:underline"
                        >
                          Voir dossier
                        </Link>
                        <a
                          href="https://wa.me/212665334455?text=Bonjour,%20Rappel%20de%20cotisation%20pour%20Hamza."
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] font-bold text-emerald-600 flex items-center gap-1 hover:underline"
                        >
                          <MessageCircle className="w-3 h-3" />
                          <span>Relancer WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Item 2 */}
                  <div className="py-2.5 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                      <DoorOpen className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-slate-900">Salle en Maintenance</p>
                      <p className="text-[11px] text-slate-500">
                        Salle VIP - Séminaire (2ème Étage) indisponible aujourd'hui.
                      </p>
                      <Link
                        href="/salles"
                        onClick={() => setIsNotifOpen(false)}
                        className="text-[10px] font-bold text-blue-600 hover:underline mt-1 inline-block"
                      >
                        Vérifier l'état
                      </Link>
                    </div>
                  </div>

                  {/* Item 3 */}
                  <div className="py-2.5 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-slate-900">Séance active en ce moment</p>
                      <p className="text-[11px] text-slate-500">
                        2 Bac SM Maths • Salle 1 (Ibn Sina) avec Pr. Alami.
                      </p>
                      <Link
                        href="/presence"
                        onClick={() => setIsNotifOpen(false)}
                        className="text-[10px] font-bold text-blue-600 hover:underline mt-1 inline-block"
                      >
                        Feuille de présence
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 text-center">
                  <Link
                    href="/parametres"
                    onClick={() => setIsNotifOpen(false)}
                    className="text-[11px] font-semibold text-slate-500 hover:text-slate-800"
                  >
                    Gérer les préférences de notifications
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Primary Action Button: Opens Inscription Modal from ANYWHERE */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-95 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-blue-500/25 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nouvelle Inscription</span>
          </button>
        </div>
      </header>

      {/* Global New Enrollment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Inscrire un nouvel élève</h3>
                  <p className="text-[11px] text-slate-500">Ajout immédiat dans le centre et assignation au groupe</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalSuccess ? (
              <div className="py-8 text-center space-y-2 animate-in zoom-in">
                <FaCircleCheck className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
                <h4 className="font-bold text-slate-900 text-base">Élève inscrit avec succès !</h4>
                <p className="text-xs text-slate-500">
                  {prenom} {nom} a été ajouté au groupe sélectionné.
                </p>
              </div>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Nom *</label>
                    <input
                      type="text"
                      required
                      value={nom}
                      onChange={(e) => setNom(e.target.value)}
                      placeholder="ex: Berrada"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Prénom *</label>
                    <input
                      type="text"
                      required
                      value={prenom}
                      onChange={(e) => setPrenom(e.target.value)}
                      placeholder="ex: Othmane"
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
                      value={tel}
                      onChange={(e) => setTel(e.target.value)}
                      placeholder="0612345678"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Tél Parent (WhatsApp)</label>
                    <input
                      type="text"
                      value={telParent}
                      onChange={(e) => setTelParent(e.target.value)}
                      placeholder="0661998877"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Niveau</label>
                    <select
                      value={niveau}
                      onChange={(e) => setNiveau(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 bg-white"
                    >
                      <option value="2ème Bac Sciences Maths">2ème Bac Sciences Maths</option>
                      <option value="2ème Bac Sciences Physiques">2ème Bac Sciences Physiques</option>
                      <option value="2ème Bac SVT">2ème Bac SVT</option>
                      <option value="1ère Bac Sciences Maths">1ère Bac Sciences Maths</option>
                      <option value="Tronc Commun">Tronc Commun</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Groupe d'étude</label>
                    <select
                      value={groupeId}
                      onChange={(e) => setGroupeId(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 bg-white"
                    >
                      {mockGroupes.map((grp) => (
                        <option key={grp.id} value={grp.id}>
                          {grp.nom} ({grp.tarifMensuel} DH)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200/80 text-xs text-blue-900 flex items-center justify-between">
                  <span>Année scolaire d'inscription :</span>
                  <strong className="font-bold">{selectedYear}</strong>
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
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-xs"
                  >
                    Valider l'inscription
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}

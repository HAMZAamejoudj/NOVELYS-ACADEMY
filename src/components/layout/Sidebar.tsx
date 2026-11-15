'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  FaHouse,
  FaUsers,
  FaUserGraduate,
  FaBookOpen,
  FaSchool,
  FaCalendarDays,
  FaReceipt,
  FaClipboardCheck,
  FaGear,
  FaChevronLeft,
  FaChevronRight,
  FaRightFromBracket,
  FaBookBookmark,
} from 'react-icons/fa6';
import { useSidebar } from './AppLayout';
import { createClient } from '../../lib/supabase/client';
import { useRouter } from 'next/navigation';

const navItems = [
  { name: 'Tableau de bord', href: '/', icon: FaHouse },
  { name: 'Étudiants', href: '/etudiants', icon: FaUsers },
  { name: 'Professeurs', href: '/professeurs', icon: FaUserGraduate },
  { name: 'Groupes & Classes', href: '/groupes', icon: FaBookOpen },
  { name: 'Matières', href: '/parametres#matieres', icon: FaBookBookmark },
  { name: 'Salles & Disponibilité', href: '/salles', icon: FaSchool },
  { name: 'Emploi du Temps', href: '/planning', icon: FaCalendarDays },
  { name: 'Paiements & Reçus', href: '/paiements', icon: FaReceipt },
  { name: 'Pointage Présence', href: '/presence', icon: FaClipboardCheck },
  { name: 'Paramètres', href: '/parametres', icon: FaGear },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isCollapsed, toggleSidebar } = useSidebar();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  return (
    <aside
      className={`bg-slate-900 text-slate-100 flex flex-col shrink-0 border-r border-slate-800/90 min-h-screen transition-all duration-300 ease-in-out relative z-30 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div
        className={`border-b border-slate-800/80 flex items-center transition-all ${
          isCollapsed ? 'p-3.5 flex-col gap-2 justify-center' : 'px-4 py-4 justify-between'
        }`}
      >
        <Link href="/" className="flex items-center gap-3 overflow-hidden group">
          <div className="relative w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform overflow-hidden">
            <Image
              src="/logo.png"
              alt="Novelys Academy"
              width={40}
              height={40}
              className="object-contain w-full h-full"
              priority
            />
          </div>

          {!isCollapsed && (
            <div className="truncate">
              <h2 className="font-extrabold text-sm text-white tracking-wide uppercase leading-tight">
                Novelys Academy
              </h2>
            </div>
          )}
        </Link>

        {/* Toggle Collapse Button */}
        <button
          onClick={toggleSidebar}
          title={isCollapsed ? 'Agrandir le menu' : 'Réduire le menu'}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/90 transition-colors cursor-pointer"
        >
          {isCollapsed ? (
            <FaChevronRight className="w-3.5 h-3.5" />
          ) : (
            <FaChevronLeft className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* Navigation items with standard FontAwesome library icons */}
      <div className="flex-1 px-3 py-5 space-y-1.5 overflow-y-auto overflow-x-hidden">
        {!isCollapsed && (
          <div className="px-3 pb-2.5 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
            Menu Principal
          </div>
        )}

        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              title={isCollapsed ? item.name : undefined}
              className={`flex items-center rounded-xl text-sm font-medium transition-all group ${
                isCollapsed
                  ? 'justify-center p-3.5'
                  : 'px-3.5 py-3 gap-3.5'
              } ${
                isActive
                  ? 'bg-teal-600 text-white font-semibold shadow-md shadow-teal-600/30'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <Icon
                className={`shrink-0 transition-transform group-hover:scale-110 text-base ${
                  isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
                }`}
              />
              {!isCollapsed && (
                <span className="truncate">{item.name}</span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Footer User Profile */}
      <div
        className={`border-t border-slate-800/80 transition-all ${
          isCollapsed ? 'p-3 flex justify-center' : 'p-4 flex items-center justify-between'
        }`}
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-teal-600 border border-teal-400/30 flex items-center justify-center font-extrabold text-xs text-white shrink-0 shadow-sm">
            NA
          </div>
          {!isCollapsed && (
            <div className="truncate">
              <p className="text-xs font-bold text-white truncate">Directeur Youssef</p>
              <p className="text-[10px] text-slate-400 truncate">admin@novelys.ma</p>
            </div>
          )}
        </div>

        {!isCollapsed && (
          <button
            onClick={handleLogout}
            title="Se déconnecter de la session"
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <FaRightFromBracket className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </aside>
  );
}

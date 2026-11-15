'use client';

import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: string;
  icon?: React.ComponentType<{ className?: string }>;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ComponentType<{ className?: string }>;
  };
  children?: React.ReactNode;
}

export function PageHeader({
  title,
  description,
  badge,
  icon: Icon,
  action,
  children,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200 w-full">
      <div className="flex items-start gap-3.5">
        {Icon && (
          <div className="w-11 h-11 rounded-xl bg-teal-50 border border-teal-200/60 flex items-center justify-center text-teal-600 shrink-0 mt-0.5 shadow-2xs">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h1>
            {badge && (
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800">
                {badge}
              </span>
            )}
          </div>
          {description && (
            <p className="text-sm text-slate-500 mt-1">{description}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {children}
        {action && (
          <button
            onClick={action.onClick}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold rounded-lg shadow-sm shadow-blue-500/20 transition-all hover:shadow-md cursor-pointer"
          >
            {action.icon && <action.icon className="w-4 h-4" />}
            <span>{action.label}</span>
          </button>
        )}
      </div>
    </div>
  );
}

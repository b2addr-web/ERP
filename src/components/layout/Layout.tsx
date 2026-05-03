import React from 'react';
import { Sidebar } from './Sidebar';
import { AIAnalyst } from '../AI/AIAnalyst';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex bg-[#F1F5F9] min-h-screen text-[#0F172A] font-sans" dir="rtl">
      <Sidebar />
      <main className="flex-1 h-screen flex flex-col overflow-hidden">
        <header className="h-14 bg-white border-b border-slate-200 px-6 shrink-0 z-10 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center text-white font-bold text-sm">ERP</div>
            <h1 className="text-lg font-bold tracking-tight">نظام الإدارة الموحد <span className="text-slate-400 font-normal text-xs uppercase ml-2 tracking-widest leading-none">V1.0</span></h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <div className="bg-emerald-100 text-emerald-700 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase">السيولة: آمنة</div>
              <div className="bg-amber-100 text-amber-700 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase">تحديث آلي</div>
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-5 pb-10">
          <div className="max-w-[1400px] mx-auto">
            {children}
          </div>
        </div>
        <AIAnalyst />
      </main>
    </div>
  );
};

import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  BarChart3, 
  ShoppingCart, 
  Users, 
  FileText, 
  Settings, 
  Home,
  LogOut,
  Wallet,
  Package,
  CircleDollarSign
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { logout } from '../../lib/firebase';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Sidebar: React.FC = () => {
  const { profile, isAdmin } = useAuth();

  const navItems = [
    { name: 'لوحة التحكم الشاملة', icon: Home, path: '/', show: true },
    { 
      name: 'الإدارة المالية', 
      icon: CircleDollarSign, 
      path: '/finance', 
      show: isAdmin || profile?.department === 'FINANCE' 
    },
    { 
      name: 'إدارة المشتريات', 
      icon: ShoppingCart, 
      path: '/procurement', 
      show: isAdmin || profile?.department === 'PROCUREMENT' 
    },
    { 
      name: 'المبيعات والعملاء', 
      icon: Users, 
      path: '/sales', 
      show: isAdmin || profile?.department === 'SALES' 
    },
    { 
      name: 'إدارة الصلاحيات', 
      icon: Settings, 
      path: '/admin', 
      show: isAdmin 
    },
  ];

  return (
    <aside className="w-56 bg-[#1E293B] text-slate-300 flex flex-col shrink-0 h-screen" dir="rtl">
      <div className="p-4 space-y-1">
        <div className="text-[10px] uppercase font-bold text-slate-500 px-2 mb-2 tracking-wider">الأقسام الرئيسية</div>
        <nav className="space-y-0.5">
          {navItems.filter(item => item.show).map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium",
                isActive 
                  ? "bg-indigo-600/20 text-indigo-400 border-r-4 border-indigo-500" 
                  : "hover:bg-slate-800 text-slate-300"
              )}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-4 bg-slate-900/50 border-t border-slate-700/50">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-bold border border-slate-600">
            {profile?.displayName?.charAt(0) || 'U'}
          </div>
          <div className="overflow-hidden">
            <p className="text-[11px] font-bold text-white truncate leading-tight">{profile?.displayName}</p>
            <p className="text-[9px] text-slate-500 truncate uppercase tracking-tighter">{profile?.role}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 w-full px-2 py-1.5 rounded text-[11px] font-bold text-slate-500 hover:bg-rose-900/10 hover:text-rose-400 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>خروج</span>
        </button>
      </div>
    </aside>
  );
};

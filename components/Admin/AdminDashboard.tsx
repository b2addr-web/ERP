import React, { useEffect, useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, query, getDocs, updateDoc, doc } from 'firebase/firestore';
import { UserProfile, Role, Department } from '../../types';
import { ShieldCheck, UserCog, Check, X, ShieldAlert } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const q = query(collection(db, 'users'));
    const snapshot = await getDocs(q);
    const usersList = snapshot.docs.map(doc => doc.data() as UserProfile);
    setUsers(usersList);
    setLoading(false);
  };

  const updateUser = async (uid: string, updates: Partial<UserProfile>) => {
    await updateDoc(doc(db, 'users', uid), updates);
    fetchUsers();
  };

  if (loading) return <div>جاري التحميل...</div>;

  return (
    <div className="space-y-5" dir="rtl">
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <h3 className="text-xs font-bold flex items-center gap-2 uppercase tracking-wide">
            <UserCog className="w-4 h-4 text-indigo-500" />
            إدارة المستخدمين والصلاحيات
          </h3>
          <span className="text-[10px] font-bold text-slate-400 uppercase">
            إجمالي السجلات: {users.length}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                <th className="px-6 py-3">المستخدم</th>
                <th className="px-6 py-3">القسم</th>
                <th className="px-6 py-3">الصلاحية</th>
                <th className="px-6 py-3">الحالة</th>
                <th className="px-6 py-3 text-left">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {users.map((user) => (
                <tr key={user.uid} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-3">
                    <p className="font-bold text-slate-900 leading-none">{user.displayName}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{user.email}</p>
                  </td>
                  <td className="px-6 py-3">
                    <select 
                      value={user.department}
                      onChange={(e) => updateUser(user.uid, { department: e.target.value as Department })}
                      className="text-[10px] font-bold border-slate-200 rounded p-1 bg-white focus:ring-1 focus:ring-indigo-500 outline-none uppercase"
                    >
                      <option value="GENERAL">عام</option>
                      <option value="FINANCE">المالية</option>
                      <option value="PROCUREMENT">المشتريات</option>
                      <option value="SALES">المبيعات</option>
                    </select>
                  </td>
                  <td className="px-6 py-3">
                    <select 
                      value={user.role}
                      onChange={(e) => updateUser(user.uid, { role: e.target.value as Role })}
                      className="text-[10px] font-bold border-slate-200 rounded p-1 bg-white focus:ring-1 focus:ring-indigo-500 outline-none uppercase"
                    >
                      <option value="STAFF">Staff</option>
                      <option value="HEAD">Head</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </td>
                  <td className="px-6 py-3">
                    {user.isApproved ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase">
                        <ShieldCheck className="w-2.5 h-2.5" /> مفعّل
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 uppercase">
                        <ShieldAlert className="w-2.5 h-2.5" /> معلّق
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-3 text-left">
                    <button
                      onClick={() => updateUser(user.uid, { isApproved: !user.isApproved })}
                      className={`p-1.5 rounded transition-colors ${
                        user.isApproved 
                          ? 'text-rose-600 hover:bg-rose-50' 
                          : 'text-emerald-600 hover:bg-emerald-50'
                      }`}
                    >
                      {user.isApproved ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

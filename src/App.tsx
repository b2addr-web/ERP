import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Layout } from './components/layout/Layout';
import { signInWithGoogle, loginWithEmail, signUpWithEmail, updateProfile } from './lib/firebase';
import { Package, Lock, ShieldCheck, Mail, Key, UserPlus, LogIn, Users } from 'lucide-react';
import { motion } from 'motion/react';

import { FinanceDashboard } from './components/Finance/FinanceDashboard';
import { ProcurementDashboard } from './components/Procurement/ProcurementDashboard';
import { SalesDashboard } from './components/Sales/SalesDashboard';
import { AdminDashboard } from './components/Admin/AdminDashboard';

// Placeholder Pages
const Dashboard = () => {
  return (
    <div className="space-y-6" dir="rtl">
      <div className="bg-[#1E293B] p-6 rounded-lg text-white border border-slate-700 shadow-xl relative overflow-hidden flex justify-between items-center">
        <div className="relative z-10">
          <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">لوحة التحكم الشاملة</div>
          <h1 className="text-2xl font-bold">أهلاً بك في نظام الإدارة الموحد</h1>
          <p className="mt-1 text-slate-400 text-[11px] max-w-md">
            نظام متكامل لإدارة العمليات المالية والمشتريات والمبيعات مع تحليل فوري للبيانات.
          </p>
        </div>
        <div className="hidden md:flex gap-2 relative z-10">
          <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700 text-center min-w-[100px]">
            <p className="text-[9px] text-slate-500 font-bold uppercase">العمليات اليوم</p>
            <p className="text-lg font-bold">24</p>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700 text-center min-w-[100px]">
            <p className="text-[9px] text-slate-500 font-bold uppercase">المستخدمين</p>
            <p className="text-lg font-bold">12</p>
          </div>
        </div>
        <Package className="absolute -left-4 -bottom-4 w-32 h-32 text-indigo-500/10 rotate-12" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">الإدارة المالية</div>
            <div className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[9px] font-bold rounded uppercase">نشط</div>
          </div>
          <div className="text-xl font-bold text-slate-900">1.42M ر.س</div>
          <p className="text-[10px] text-slate-400 mt-1">إجمالي التدفق النقدي الحالي</p>
          <div className="mt-4 w-full bg-slate-100 h-1 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full w-2/3"></div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">إدارة المشتريات</div>
            <div className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[9px] font-bold rounded uppercase">تنبيه</div>
          </div>
          <div className="text-xl font-bold text-slate-900">284k ر.س</div>
          <p className="text-[10px] text-slate-400 mt-1">مستحقات واجبة السداد</p>
          <div className="mt-4 w-full bg-slate-100 h-1 rounded-full overflow-hidden">
            <div className="bg-amber-500 h-full w-1/2"></div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">المبيعات والعملاء</div>
            <div className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[9px] font-bold rounded uppercase">مستهدف</div>
          </div>
          <div className="text-xl font-bold text-slate-900">3.10M ر.س</div>
          <p className="text-[10px] text-slate-400 mt-1">مبيعات الربع الحالي</p>
          <div className="mt-4 w-full bg-slate-100 h-1 rounded-full overflow-hidden">
            <div className="bg-blue-500 h-full w-4/5"></div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">آخر العمليات وتنبيهات التحصيل</h3>
          <button className="text-[10px] text-indigo-600 font-bold hover:underline">مشاهدة السجلات</button>
        </div>
        <table className="w-full text-right text-xs">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
              <th className="p-3">رقم العملية</th>
              <th className="p-3">القسم</th>
              <th className="p-3">البيان</th>
              <th className="p-3">المبلغ</th>
              <th className="p-3">الحالة</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            <tr className="hover:bg-slate-50 transition-colors">
              <td className="p-3 font-mono text-slate-400">#INV-9022</td>
              <td className="p-3">المبيعات</td>
              <td className="p-3 font-bold">شركة التوريدات الوطنية (آجل)</td>
              <td className="p-3 font-bold">12,500 <span className="text-[10px] font-normal">ر.س</span></td>
              <td className="p-3"><span className="bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase">تجاوز السداد</span></td>
            </tr>
            <tr className="hover:bg-slate-50 transition-colors">
              <td className="p-3 font-mono text-slate-400">#PO-4551</td>
              <td className="p-3">المشتريات</td>
              <td className="p-3 font-bold">شراء مواد خام - مستودع ب</td>
              <td className="p-3 font-bold">45,000 <span className="text-[10px] font-normal">ر.س</span></td>
              <td className="p-3"><span className="bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase">معلق</span></td>
            </tr>
            <tr className="hover:bg-slate-50 transition-colors">
              <td className="p-3 font-mono text-slate-400">#PAY-1002</td>
              <td className="p-3">المالية</td>
              <td className="p-3 font-bold">تحويل رواتب - الموقع الرئيسي</td>
              <td className="p-3 font-bold">155,000 <span className="text-[10px] font-normal">ر.س</span></td>
              <td className="p-3"><span className="bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase">تم التنفيذ</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Login = () => {
  const [isSignUp, setIsSignUp] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [displayName, setDisplayName] = React.useState('');
  const [error, setError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isSignUp) {
        const userCredential = await signUpWithEmail(email, password);
        if (displayName) {
          await updateProfile(userCredential.user, { displayName });
        }
      } else {
        await loginWithEmail(email, password);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'حدث خطأ ما، يرجى المحاولة مرة أخرى');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
        dir="rtl"
      >
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200">
            <Package className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">نظام ERP الموحد</h1>
          <p className="text-slate-500 text-sm mt-1">
            {isSignUp ? 'إنشاء حساب جديد للوصول للنظام' : 'تسجيل الدخول للوصول إلى لوحة التحكم'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-rose-50 border border-rose-100 text-rose-600 text-xs rounded-lg font-bold flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mr-1">الاسم الكامل</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="أدخل اسمك"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 py-2.5 px-4 pr-10 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                />
                <Users className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mr-1">البريد الإلكتروني</label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 py-2.5 px-4 pr-10 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-mono"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mr-1">كلمة المرور</label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 py-2.5 px-4 pr-10 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-mono"
              />
              <Key className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : isSignUp ? (
              <>
                <UserPlus className="w-4 h-4" />
                <span>إنشاء حساب</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>تسجيل الدخول</span>
              </>
            )}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-100"></div>
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-bold">
            <span className="bg-white px-4 text-slate-400 tracking-widest">أو عبر</span>
          </div>
        </div>

        <button
          onClick={signInWithGoogle}
          type="button"
          className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 py-2.5 px-4 rounded-xl font-bold text-xs text-slate-600 hover:bg-slate-50 transition-all hover:shadow-sm mb-4 uppercase tracking-tighter"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-4 h-4" />
          <span>الدخول بواسطة Google</span>
        </button>

        <div className="mt-8 text-center space-y-4">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-[11px] font-bold text-indigo-600 hover:underline block w-full"
          >
            {isSignUp ? 'لديك حساب بالفعل؟ سجل الدخول الآن' : 'ليس لديك حساب؟ أنشئ حساباً جديداً'}
          </button>
          
          <p className="text-[10px] text-slate-400 bg-slate-50 p-2 rounded border border-slate-100">
            ملاحظة: إذا واجهت مشكلة في تسجيل الدخول، يرجى فتح التطبيق في 
            <a href={window.location.href} target="_blank" rel="noreferrer" className="text-indigo-600 font-bold mx-1 underline">نافذة جديدة</a>
             لتفادي حظر النوافذ المنبثقة.
          </p>
        </div>

        <div className="flex items-center gap-2 justify-center text-[10px] uppercase font-bold text-slate-300 mt-6 tracking-widest leading-none">
          <Lock className="w-2.5 h-2.5" />
          <span>تشفير عالي الأمان بنظام AES-256</span>
        </div>
      </motion.div>
    </div>
  );
};

const ProtectedRoute = ({ children, requireAdmin = false, department = '' }: { children: React.ReactNode, requireAdmin?: boolean, department?: string }) => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" />;

  if (!profile?.isApproved) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4" dir="rtl">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md text-center">
          <ShieldCheck className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900">في انتظار الموافقة</h2>
          <p className="text-slate-500 mt-4 leading-relaxed">
            تم تسجيل طلبك بنجاح. يرجى الانتظار لحين قيام مدير النظام بتفعيل حسابك وتحديد صلاحياتك.
          </p>
        </div>
      </div>
    );
  }

  if (requireAdmin && profile.role !== 'ADMIN') {
    return <Navigate to="/" />;
  }

  if (department && profile.role !== 'ADMIN' && profile.department !== department) {
    return <Navigate to="/" />;
  }

  return <Layout>{children}</Layout>;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/finance" element={<ProtectedRoute department="FINANCE"><FinanceDashboard /></ProtectedRoute>} />
          <Route path="/procurement" element={<ProtectedRoute department="PROCUREMENT"><ProcurementDashboard /></ProtectedRoute>} />
          <Route path="/sales" element={<ProtectedRoute department="SALES"><SalesDashboard /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute requireAdmin={true}><AdminDashboard /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

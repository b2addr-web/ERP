import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { Wallet, TrendingUp, TrendingDown, Users } from 'lucide-react';
import { motion } from 'motion/react';

const payrollData = [
  { name: 'المصنع', value: 45000, color: '#6366f1' },
  { name: 'المستودع', value: 25000, color: '#8b5cf6' },
  { name: 'المبنى الرئيسي', value: 35000, color: '#ec4899' },
];

const cashFlowData = [
  { name: 'يناير', inflows: 4000, outflows: 2400 },
  { name: 'فبراير', inflows: 3000, outflows: 1398 },
  { name: 'مارس', inflows: 2000, outflows: 9800 },
  { name: 'أبريل', inflows: 2780, outflows: 3908 },
  { name: 'مايو', inflows: 1890, outflows: 4800 },
  { name: 'يونيو', inflows: 2390, outflows: 3800 },
];

export const FinanceDashboard: React.FC = () => {
  return (
    <div className="space-y-5" dir="rtl">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'إجمالي التدفق النقدي', value: '450,000 ر.س', change: '+12.4% عن الشهر الماضي', color: 'text-indigo-600' },
          { label: 'مستحقات الموردين', value: '88,200 ر.س', change: '12 فاتورة معلقة', color: 'text-rose-600' },
          { label: 'متوقع تحصيله', value: '125,500 ر.س', change: '+5.2% نمو آجل', color: 'text-emerald-600' },
          { label: 'تكلفة الرواتب', value: '105,000 ر.س', change: 'توزيع حسب 3 مواقع', color: 'text-slate-900' },
        ].map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            key={stat.label} 
            className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm"
          >
            <div className="text-xs text-slate-500 font-bold mb-1 uppercase tracking-wider">{stat.label}</div>
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className={`text-[10px] mt-1 font-bold ${stat.color.includes('rose') ? 'text-rose-500' : 'text-emerald-600'}`}>
              {stat.change}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-5">
        {/* Payroll Cost Analysis */}
        <div className="col-span-1 lg:col-span-2 bg-white rounded-lg border border-slate-200 flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h3 className="text-sm font-bold">تحليل تكلفة الرواتب الجغرافي</h3>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">بيانات حية</span>
          </div>
          <div className="flex-1 p-4">
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={payrollData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {payrollData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-2">
              {payrollData.map((item) => (
                <div key={item.name} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[10px] text-slate-600 font-bold uppercase">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cash Flow Analysis */}
        <div className="col-span-1 lg:col-span-3 bg-white rounded-lg border border-slate-200 flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h3 className="text-sm font-bold">التدفق النقدي (Cash Flow)</h3>
          </div>
          <div className="h-64 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cashFlowData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ fontSize: '10px', borderRadius: '8px' }} />
                <Bar dataKey="inflows" fill="#10b981" radius={[2, 2, 0, 0]} name="داخل" barSize={16} />
                <Bar dataKey="outflows" fill="#f43f5e" radius={[2, 2, 0, 0]} name="خارج" barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { ShoppingBag, FileText, CheckCircle, Clock } from 'lucide-react';

const poStatusData = [
  { name: 'يناير', count: 12 },
  { name: 'فبراير', count: 18 },
  { name: 'مارس', count: 15 },
  { name: 'أبريل', count: 22 },
  { name: 'مايو', count: 30 },
];

export const ProcurementDashboard: React.FC = () => {
  return (
    <div className="space-y-5" dir="rtl">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'طلبات احتياج معلقة', count: '5', color: 'text-amber-600' },
          { label: 'أوامر شراء نشطة', count: '12', color: 'text-indigo-600' },
          { label: 'إشعارات استلام اليوم', count: '3', color: 'text-emerald-600' },
          { label: 'إجمالي الموردين', count: '84', color: 'text-slate-500' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
            <div className="text-[10px] text-slate-400 font-bold mb-1 uppercase tracking-wider">{stat.label}</div>
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.count}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-5">
        <div className="col-span-3 bg-white rounded-lg border border-slate-200 flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h3 className="text-xs font-bold uppercase tracking-wide">نشاط المشتريات الشهري</h3>
          </div>
          <div className="h-64 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={poStatusData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ fontSize: '10px' }} />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#6366f1" 
                  strokeWidth={2} 
                  dot={{ r: 3, fill: '#6366f1', strokeWidth: 0 }} 
                  activeDot={{ r: 5 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-span-2 bg-white rounded-lg border border-slate-200 flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
            <h3 className="text-xs font-bold uppercase tracking-wide">أوامر الشراء الأخيرة</h3>
          </div>
          <div className="p-1">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">
                  <th className="p-3">المعرف</th>
                  <th className="p-3">المورد</th>
                  <th className="p-3">المبلغ</th>
                  <th className="p-3">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {[
                  { id: '#PO-9020', supplier: 'شركة الأفق', amount: '12.5k', status: 'Approved' },
                  { id: '#PO-9021', supplier: 'توريدات الخليج', amount: '4.8k', status: 'Pending' },
                  { id: '#PO-9022', supplier: 'مصنع الشرق', amount: '35k', status: 'Received' },
                  { id: '#PO-9023', supplier: 'الوطنية للمواد', amount: '8.2k', status: 'Received' },
                ].map((po) => (
                  <tr key={po.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-mono text-slate-500">{po.id}</td>
                    <td className="p-3 font-bold truncate max-w-[100px]">{po.supplier}</td>
                    <td className="p-3 font-bold text-indigo-600">{po.amount}</td>
                    <td className="p-3">
                      <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                        po.status === 'Received' ? 'bg-emerald-100 text-emerald-700' : 
                        po.status === 'Approved' ? 'bg-indigo-100 text-indigo-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {po.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

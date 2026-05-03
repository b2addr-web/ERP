import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Users, CreditCard, MapPin, AlertCircle } from 'lucide-react';

const regionData = [
  { region: 'المنطقة الوسطى', sales: 120000, color: '#6366f1' },
  { region: 'المنطقة الغربية', sales: 95000, color: '#8b5cf6' },
  { region: 'المنطقة الشرقية', sales: 78000, color: '#ec4899' },
  { region: 'المنطقة الشمالية', sales: 45000, color: '#f59e0b' },
];

export const SalesDashboard: React.FC = () => {
  return (
    <div className="space-y-5" dir="rtl">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'إجمالي المبيعات', value: '338,000 ر.س', icon: CreditCard, color: 'text-indigo-600' },
          { label: 'العملاء النشطون', value: '45', icon: Users, color: 'text-blue-600' },
          { label: 'فواتير معلقة', value: '18', icon: AlertCircle, color: 'text-rose-600' },
          { label: 'المتوسط', value: '7,500 ر.س', icon: BarChart, color: 'text-emerald-600' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
            <div className="text-[10px] text-slate-500 font-bold mb-1 uppercase tracking-wider">{stat.label}</div>
            <div className="text-2xl font-bold text-slate-900 leading-none">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-5">
        <div className="col-span-3 bg-white rounded-lg border border-slate-200 flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h3 className="text-sm font-bold">التوزيع الجغرافي للمبيعات</h3>
          </div>
          <div className="p-4 flex flex-col gap-4">
            {regionData.map((region) => (
              <div key={region.region} className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold">
                  <span>{region.region}</span>
                  <span className="text-slate-500">{(region.sales / 1000).toFixed(0)}k ر.س</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500" 
                    style={{ 
                      width: `${(region.sales / 120000) * 100}%`,
                      backgroundColor: region.color 
                    }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-2 bg-white rounded-lg border border-slate-200 flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
            <h3 className="text-sm font-bold uppercase tracking-wide">تنبيهات التحصيل</h3>
          </div>
          <div className="flex-1 p-2 space-y-1.5 overflow-y-auto">
            {[
              { client: 'شركة الإعمار', amount: '15,000 ر.س', days: 'متأخر 12 يوم', severity: 'high' },
              { client: 'مؤسسة الصفوة', amount: '8,200 ر.س', days: 'متأخر 5 أيام', severity: 'med' },
              { client: 'التجهيزات الفنية', amount: '22,000 ر.س', days: 'متأخر 20 يوم', severity: 'high' },
              { client: 'المقاولات العامة', amount: '11,400 ر.س', days: 'يستحق اليوم', severity: 'low' },
            ].map((alert, i) => (
              <div key={i} className="p-2.5 bg-slate-50 border border-slate-100 rounded-md flex items-center justify-between">
                <div>
                  <p className="font-bold text-[11px] text-slate-900">{alert.client}</p>
                  <p className="text-[10px] font-bold text-indigo-600">{alert.amount}</p>
                </div>
                <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                  alert.severity === 'high' ? 'bg-rose-100 text-rose-700' : 
                  alert.severity === 'med' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {alert.days}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

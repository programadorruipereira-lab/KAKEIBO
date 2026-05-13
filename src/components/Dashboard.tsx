import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell, PieChart, Pie 
} from 'recharts';
import { TrendingUp, TrendingDown, Wallet, PieChart as PieChartIcon } from 'lucide-react';
import { Transaction, TransactionType } from '../types';

interface DashboardProps {
  transactions: Transaction[];
}

export default function Dashboard({ transactions }: DashboardProps) {
  const totalIncome = transactions
    .filter(t => t.type === TransactionType.INCOME)
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === TransactionType.EXPENSE)
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = totalIncome - totalExpense;

  // Prepare chart data by category (for expenses)
  const categoryData = transactions
    .filter(t => t.type === TransactionType.EXPENSE)
    .reduce((acc: any[], t) => {
      const existing = acc.find(item => item.name === t.category);
      if (existing) {
        existing.value += t.amount;
      } else {
        acc.push({ name: t.category, value: t.amount });
      }
      return acc;
    }, [])
    .sort((a, b) => b.value - a.value);

  // Colors for pie chart
  const COLORS = ['#171717', '#404040', '#737373', '#a3a3a3', '#d4d4d4'];

  const stats = [
    {
      label: 'Saldo Geral',
      value: balance,
      icon: <Wallet size={24} />,
      color: 'text-[#6B7280]',
      bg: 'bg-white',
      accent: 'border-[#60A5FA]',
    },
    {
      label: 'Receitas',
      value: totalIncome,
      icon: <TrendingUp size={24} />,
      color: 'text-[#059669]',
      bg: 'bg-[#ECFDF5]',
      accent: 'border-[#10B981]',
    },
    {
      label: 'Despesas',
      value: totalExpense,
      icon: <TrendingDown size={24} />,
      color: 'text-[#DC2626]',
      bg: 'bg-[#FEF2F2]',
      accent: 'border-[#EF4444]',
    },
  ];

  return (
    <div className="space-y-12">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat, i) => (
          <div key={i} className={`anime-card p-8 ${stat.bg}`}>
            <div className="flex justify-between items-start mb-6">
              <span className="text-xs font-black text-neutral-400 uppercase tracking-widest">{stat.label}</span>
              <div className={stat.color}>{stat.icon}</div>
            </div>
            <div className={`text-4xl font-display font-black tracking-tight ${stat.color}`}>
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stat.value)}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Expenses by Category */}
        <div className="anime-card p-8 bg-white">
          <div className="flex items-center gap-3 mb-10">
            <div className="p-2 bg-[#FBBF24] border-2 border-neutral-900 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <PieChartIcon size={18} className="text-white" />
            </div>
            <h3 className="text-lg font-display font-bold text-neutral-800">Categorias Favoritas</h3>
          </div>
          
          <div className="h-[300px] w-full">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-neutral-400 italic">
                Sem dados para exibir
              </div>
            )}
          </div>
          
          {/* Legend */}
          <div className="mt-4 grid grid-cols-2 gap-2">
            {categoryData.slice(0, 4).map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span className="text-xs text-neutral-500 truncate">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Trend (Placeholder for now, could be improved with real dates) */}
        <div className="anime-card p-8 bg-white">
          <div className="flex items-center gap-3 mb-10">
            <div className="p-2 bg-[#60A5FA] border-2 border-neutral-900 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <TrendingUp size={18} className="text-white" />
            </div>
            <h3 className="text-lg font-display font-bold text-neutral-800">Fluxo de Caixa</h3>
          </div>
          
          <div className="h-[300px] w-full">
            {transactions.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData.slice(0, 6)}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 11, fill: '#666', fontWeight: 600 }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 11, fill: '#666', fontWeight: 600 }}
                  />
                  <Tooltip 
                    cursor={{ fill: '#FEF2F2' }}
                    contentStyle={{ borderRadius: '16px', border: '3px solid #171717', boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)' }}
                    formatter={(value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}
                  />
                  <Bar dataKey="value" fill="#F472B6" radius={[8, 8, 0, 0]} stroke="#171717" strokeWidth={3} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-neutral-400 font-display italic gap-2">
                <span className="text-4xl">(=^･ω･^=)</span>
                <p>Nenhum dado encontrado!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

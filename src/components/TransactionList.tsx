import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Trash2, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { Transaction, TransactionType } from '../types';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

export default function TransactionList({ transactions, onDelete }: TransactionListProps) {
  const sortedTransactions = [...transactions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (transactions.length === 0) {
    return (
      <div className="anime-card flex flex-col items-center justify-center py-24 text-neutral-400 bg-white gap-4">
        <span className="text-6xl opacity-20">(=^･ω･^=)</span>
        <p className="font-display text-lg italic uppercase font-bold tracking-widest">O deserto financeiro está vazio...</p>
      </div>
    );
  }

  return (
    <div className="anime-card bg-white overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#60A5FA]/10">
              <th className="px-6 py-5 text-xs font-black text-neutral-500 uppercase tracking-widest border-b-[3px] border-neutral-900 italic font-display">Data</th>
              <th className="px-6 py-5 text-xs font-black text-neutral-500 uppercase tracking-widest border-b-[3px] border-neutral-900 italic font-display">Conceito</th>
              <th className="px-6 py-5 text-xs font-black text-neutral-500 uppercase tracking-widest border-b-[3px] border-neutral-900 italic font-display">Etiqueta</th>
              <th className="px-6 py-5 text-xs font-black text-neutral-500 uppercase tracking-widest border-b-[3px] border-neutral-900 italic font-display text-right">Montante</th>
              <th className="px-6 py-5 text-xs font-black text-neutral-500 uppercase tracking-widest border-b-[3px] border-neutral-900 italic font-display text-center">X</th>
            </tr>
          </thead>
          <tbody className="divide-y-[3px] divide-neutral-900/10">
            {sortedTransactions.map((tx) => (
              <tr key={tx.id} className="group hover:bg-[#FBBF24]/5 transition-colors">
                <td className="px-6 py-5 font-mono text-sm text-neutral-500">
                  {format(new Date(tx.date), 'dd/MM/yy', { locale: ptBR })}
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl border-2 border-neutral-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                      tx.type === TransactionType.INCOME 
                        ? 'bg-emerald-400 text-white' 
                        : 'bg-rose-400 text-white'
                    }`}>
                      {tx.type === TransactionType.INCOME ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />}
                    </div>
                    <span className="font-display font-bold text-lg text-neutral-800">{tx.description}</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className="px-3 py-1 rounded-lg text-xs font-black bg-neutral-900 text-white uppercase tracking-tighter">
                    {tx.category}
                  </span>
                </td>
                <td className={`px-6 py-5 text-right font-display font-black text-xl tracking-tighter ${
                  tx.type === TransactionType.INCOME ? 'text-emerald-600' : 'text-rose-600'
                }`}>
                  {tx.type === TransactionType.EXPENSE ? '-' : '+'}
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(tx.amount)}
                </td>
                <td className="px-6 py-5 text-center">
                  <button
                    onClick={() => onDelete(tx.id)}
                    className="p-2 text-neutral-400 hover:text-white hover:bg-rose-500 rounded-xl transition-all border-2 border-transparent hover:border-neutral-900 shadow-sm active:scale-90"
                    title="Excluir"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

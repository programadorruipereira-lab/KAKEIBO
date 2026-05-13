import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Transaction, TransactionType, CATEGORIES } from '../types';

interface TransactionFormProps {
  onAdd: (transaction: Omit<Transaction, 'id'>) => void;
}

export default function TransactionForm({ onAdd }: TransactionFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORIES[TransactionType.EXPENSE][0]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;

    onAdd({
      amount: parseFloat(amount),
      description,
      category,
      type,
      date: new Date(date).toISOString(),
    });

    setAmount('');
    setDescription('');
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-10 right-10 anime-btn bg-[#F472B6] text-white flex items-center gap-3 z-40 text-xl"
        id="add-transaction-btn"
      >
        <Plus size={28} strokeWidth={3} />
        <span className="hidden md:inline">NOVA TRANSAÇÃO!</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.9, rotate: 2 }}
              className="relative bg-[#FFF7ED] w-full max-w-md anime-card overflow-hidden"
            >
              <div className="p-8 border-b-[3px] border-neutral-900 flex justify-between items-center bg-[#FBBF24]/10">
                <h2 className="text-2xl font-display font-black tracking-tight">ADICIONAR ITEM ★</h2>
                <button onClick={() => setIsOpen(false)} className="bg-white p-2 border-[3px] border-neutral-900 rounded-xl hover:bg-neutral-100 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <X size={20} strokeWidth={3} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="flex gap-4 p-1.5 bg-neutral-900 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => {
                      setType(TransactionType.EXPENSE);
                      setCategory(CATEGORIES[TransactionType.EXPENSE][0]);
                    }}
                    className={`flex-1 py-3 text-sm font-black rounded-xl transition-all uppercase tracking-widest ${
                      type === TransactionType.EXPENSE 
                        ? 'bg-rose-400 text-white shadow-inner' 
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    Gastos
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setType(TransactionType.INCOME);
                      setCategory(CATEGORIES[TransactionType.INCOME][0]);
                    }}
                    className={`flex-1 py-3 text-sm font-black rounded-xl transition-all uppercase tracking-widest ${
                      type === TransactionType.INCOME 
                        ? 'bg-emerald-400 text-white shadow-inner' 
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    Receitas
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-black text-neutral-500 uppercase tracking-[0.2em] mb-2 font-display">
                    VALOR TOTAL (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-5 py-4 bg-white border-[3px] border-neutral-900 rounded-2xl focus:outline-none focus:bg-[#FBBF24]/5 transition-all text-3xl font-display font-black placeholder-neutral-200"
                    placeholder="0,00"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-neutral-500 uppercase tracking-[0.2em] mb-2 font-display">
                    O QUE É?
                  </label>
                  <input
                    type="text"
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-5 py-3 bg-white border-[3px] border-neutral-900 rounded-2xl focus:outline-none focus:bg-[#FBBF24]/5 transition-all font-display font-bold"
                    placeholder="Ex: Ramen, Aluguel..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-black text-neutral-500 uppercase tracking-[0.2em] mb-2 font-display">
                      TIPO
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-5 py-3 bg-white border-[3px] border-neutral-900 rounded-2xl focus:outline-none appearance-none cursor-pointer font-display font-bold uppercase text-xs tracking-wider"
                    >
                      {CATEGORIES[type].map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-neutral-500 uppercase tracking-[0.2em] mb-2 font-display">
                      QUANDO?
                    </label>
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-5 py-3 bg-white border-[3px] border-neutral-900 rounded-2xl focus:outline-none font-display font-bold text-xs"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-5 bg-neutral-900 text-white rounded-2xl font-display font-black text-xl hover:bg-neutral-800 transition-all shadow-[6px_6px_0px_0px_rgba(244,114,182,1)] active:shadow-none translate-y-[-2px] uppercase tracking-widest mt-6"
                >
                  REGISTRAR!
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

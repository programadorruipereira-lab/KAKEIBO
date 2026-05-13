/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { LayoutDashboard, ReceiptText, PieChart, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Dashboard from './components/Dashboard';
import TransactionList from './components/TransactionList';
import TransactionForm from './components/TransactionForm';
import { Transaction, loadTransactions, saveTransactions } from './types';

export default function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'transactions'>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Load data on mount
  useEffect(() => {
    setTransactions(loadTransactions());
  }, []);

  // Save data whenever transactions change
  useEffect(() => {
    saveTransactions(transactions);
  }, [transactions]);

  const addTransaction = (newTx: Omit<Transaction, 'id'>) => {
    const transaction: Transaction = {
      ...newTx,
      id: crypto.randomUUID(),
    };
    setTransactions(prev => [transaction, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const NavItem = ({ id, icon: Icon, label }: { id: typeof activeTab; icon: any; label: string }) => (
    <button
      onClick={() => {
        setActiveTab(id);
        setIsSidebarOpen(false);
      }}
      className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all w-full text-left border-[3px] ${
        activeTab === id 
          ? 'bg-[#60A5FA] text-white border-neutral-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' 
          : 'text-neutral-500 border-transparent hover:bg-[#60A5FA15] hover:text-neutral-900'
      }`}
    >
      <Icon size={22} strokeWidth={activeTab === id ? 3 : 2} />
      <span className="font-display font-bold text-lg">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen flex bg-[#FFF5F7]">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-72 bg-white border-r-[3px] border-neutral-900 p-8 fixed inset-y-0 z-20">
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="p-2.5 bg-[#F472B6] border-[3px] border-neutral-900 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-white">
            <PieChart size={28} />
          </div>
          <h1 className="text-2xl font-display font-black tracking-tighter text-neutral-900">
            KAKEIBO<span className="text-[#F472B6]">!</span>
          </h1>
        </div>

        <nav className="space-y-4 flex-1">
          <NavItem id="dashboard" icon={LayoutDashboard} label="Painel" />
          <NavItem id="transactions" icon={ReceiptText} label="Histórico" />
        </nav>

        <div className="mt-auto p-5 bg-[#FBBF24]/20 rounded-3xl border-[3px] border-neutral-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-[10px] font-black text-[#B45309] uppercase tracking-widest mb-1">Membro Premium ★</p>
          <p className="text-sm font-display text-neutral-700 italic">"Economize como um mestre!"</p>
        </div>
      </aside>

      {/* Mobile Nav */}
      <div className="lg:hidden fixed top-0 inset-x-0 bg-white border-b-[3px] border-neutral-900 p-4 z-30 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-[#F472B6] border-2 border-neutral-900 rounded-xl text-white">
            <PieChart size={20} />
          </div>
          <h1 className="font-display font-black tracking-tight text-neutral-900">KAKEIBO!</h1>
        </div>
        <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-neutral-900">
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className="relative bg-white w-72 h-full p-6 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-12 px-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-neutral-900 rounded-lg text-white">
                    <PieChart size={20} />
                  </div>
                  <h1 className="font-bold tracking-tight">Finanças</h1>
                </div>
                <button onClick={() => setIsSidebarOpen(false)} className="text-neutral-400">
                  <X size={24} />
                </button>
              </div>
              <nav className="space-y-2">
                <NavItem id="dashboard" icon={LayoutDashboard} label="Dashboard" />
                <NavItem id="transactions" icon={ReceiptText} label="Transações" />
              </nav>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-6 lg:p-12 pt-24 lg:pt-12">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="max-w-6xl mx-auto"
        >
          <header className="mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 mb-2">
              {activeTab === 'dashboard' ? 'Métricas Gerais' : 'Histórico de Transações'}
            </h2>
            <p className="text-neutral-500 italic">
              {activeTab === 'dashboard' 
                ? 'Monitore seu desempenho financeiro em tempo real.' 
                : 'Ponto a ponto de suas movimentações financeiras.'}
            </p>
          </header>

          {activeTab === 'dashboard' ? (
            <Dashboard transactions={transactions} />
          ) : (
            <TransactionList 
              transactions={transactions} 
              onDelete={deleteTransaction} 
            />
          )}
        </motion.div>
      </main>

      <TransactionForm onAdd={addTransaction} />
    </div>
  );
}

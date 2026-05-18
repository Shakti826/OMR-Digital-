/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ClipboardCopy, 
  Trash2, 
  CheckCircle2, 
  Settings2, 
  ChevronRight,
  Info
} from 'lucide-react';

type Option = 'A' | 'B' | 'C' | 'D';

export default function App() {
  const [questionsCount, setQuestionsCount] = useState<number | ''>(20);
  const [answers, setAnswers] = useState<Record<number, Option | null>>({});
  const [showToast, setShowToast] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const OPTIONS: Option[] = ['A', 'B', 'C', 'D'];

  const toggleOption = (qNum: number, option: Option) => {
    setAnswers(prev => ({
      ...prev,
      [qNum]: prev[qNum] === option ? null : option
    }));
  };

  const clearAll = () => {
    if (confirm('Are you sure you want to clear all answers?')) {
      setAnswers({});
    }
  };

  const copyToClipboard = async () => {
    let text = '';
    const total = Number(questionsCount) || 0;
    for (let i = 1; i <= total; i++) {
      const selected = answers[i];
      const row = OPTIONS.map(opt => (selected === opt ? '(●)' : '(○)')).join(' ');
      text += `Q${i}: ${row}\n`;
    }

    try {
      await navigator.clipboard.writeText(text);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (err) {
      console.error('Failed to copy!', err);
    }
  };

  const filledCount = Object.values(answers).filter(val => val !== null).length;

  return (
    <div className="min-h-screen bg-gray-50 pb-20 sm:pb-8" id="app_root">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3 sm:py-4 shadow-sm" id="main_header">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold" id="logo_icon">
              O
            </div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900" id="app_title">OMR Digital</h1>
          </div>
          
          <div className="flex items-center gap-2">
             <button 
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
              title="Settings"
              id="settings_toggle"
            >
              <Settings2 size={20} />
            </button>
            <button 
              onClick={clearAll}
              className="p-2 text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-full transition-colors"
              title="Clear All"
              id="clear_all_btn"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4 sm:p-6 space-y-6" id="main_content">
        {/* Settings Panel */}
        <AnimatePresence>
          {isSettingsOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden bg-white border border-gray-100 rounded-2xl shadow-sm"
              id="settings_panel"
            >
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700" htmlFor="q_count_input">
                    Number of Questions
                  </label>
                  <div className="flex items-center gap-2">
                    <input 
                      id="q_count_input"
                      type="number" 
                      min="1" 
                      max="1000"
                      value={questionsCount}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '') {
                          setQuestionsCount('');
                        } else {
                          const num = parseInt(val, 10);
                          if (!isNaN(num)) {
                            setQuestionsCount(Math.min(1000, Math.max(1, num)));
                          }
                        }
                      }}
                      className="w-20 px-3 py-1 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-right"
                    />
                  </div>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg flex gap-3 text-xs text-blue-700 items-start">
                  <Info size={16} className="shrink-0 mt-0.5" />
                  <p>Changes will preserve current input but questions beyond the new limit will be hidden.</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 gap-4" id="stats_container">
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Total</span>
            <span className="text-2xl font-bold text-gray-900">{questionsCount || 0}</span>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Filled</span>
            <span className="text-2xl font-bold text-indigo-600">{filledCount}</span>
          </div>
        </div>

        {/* OMR Sheet Grid */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50 overflow-hidden" id="omr_grid">
          {Array.from({ length: Number(questionsCount) || 0 }).map((_, i) => {
            const qNum = i + 1;
            return (
              <motion.div 
                layout
                key={qNum}
                className="flex items-center gap-4 p-3 sm:p-4 hover:bg-gray-50/50 transition-colors"
                id={`row_${qNum}`}
              >
                <div className="w-8 h-8 flex items-center justify-center bg-gray-50 rounded-lg text-xs font-bold text-gray-400" id={`qnum_${qNum}`}>
                  {qNum}
                </div>
                
                <div className="flex-1 flex justify-around sm:justify-center sm:gap-8 items-center" id={`options_container_${qNum}`}>
                  {OPTIONS.map((opt) => {
                    const isSelected = answers[qNum] === opt;
                    return (
                      <button
                        key={opt}
                        onClick={() => toggleOption(qNum, opt)}
                        className={`
                          relative w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 flex items-center justify-center
                          text-sm font-bold transition-all duration-200 active:scale-90
                          ${isSelected 
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200' 
                            : 'bg-white border-gray-200 text-gray-400 hover:border-indigo-300 hover:text-indigo-500'
                          }
                        `}
                        id={`btn_${qNum}_${opt}`}
                      >
                        {opt}
                        {isSelected && (
                          <motion.div 
                            layoutId={`check_${qNum}`}
                            className="absolute -top-1 -right-1 bg-white rounded-full text-indigo-600"
                          >
                            <CheckCircle2 size={16} fill="currentColor" className="text-white" />
                          </motion.div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>

      {/* Floating Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-gray-50 via-gray-50/90 to-transparent pointer-events-none" id="action_bar_container">
        <div className="max-w-2xl mx-auto flex justify-center pointer-events-auto">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={copyToClipboard}
            className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-4 px-8 rounded-2xl shadow-xl shadow-gray-200 font-bold tracking-wide transition-all"
            id="copy_answers_btn"
          >
            <ClipboardCopy size={20} />
            Copy Answers
          </motion.button>
        </div>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-black text-white px-6 py-3 rounded-full flex items-center gap-3 shadow-2xl"
            id="toast_notification"
          >
            <div className="bg-green-500 p-1 rounded-full">
              <CheckCircle2 size={16} className="text-white" />
            </div>
            <span className="text-sm font-medium">Copied to Clipboard!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

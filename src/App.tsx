import React, { useState, useEffect } from 'react';
import { Mistake, ExamMaterial } from './types';
import { MistakeForm } from './components/MistakeForm';
import { MistakeList } from './components/MistakeList';
import { AnalysisReport } from './components/AnalysisReport';
import { ExamManager } from './components/ExamManager';
import { BookOpenCheck, Download, Upload } from 'lucide-react';
import { PWAInstallButton } from './components/PWAInstallButton';

export default function App() {
  const [mistakes, setMistakes] = useState<Mistake[]>(() => {
    const saved = localStorage.getItem('kaoyan_mistakes');
    return saved ? JSON.parse(saved) : [];
  });

  const [exams, setExams] = useState<ExamMaterial[]>(() => {
    const saved = localStorage.getItem('kaoyan_exams');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('kaoyan_mistakes', JSON.stringify(mistakes));
  }, [mistakes]);

  useEffect(() => {
    localStorage.setItem('kaoyan_exams', JSON.stringify(exams));
  }, [exams]);

  const handleAddMistake = (mistake: Mistake) => {
    setMistakes((prev) => [mistake, ...prev]);
  };

  const handleDeleteMistake = (id: string) => {
    setMistakes((prev) => prev.filter((m) => m.id !== id));
  };

  const handleAddExam = (exam: ExamMaterial) => {
    setExams((prev) => [...prev, exam]);
  };

  const handleDeleteExam = (id: string) => {
    setExams((prev) => prev.filter((e) => e.id !== id));
  };

  const handleExportData = () => {
    const reports = localStorage.getItem('kaoyan_analysis_reports');
    const data = { 
      mistakes, 
      exams, 
      reports: reports ? JSON.parse(reports) : [] 
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `考研错题本备份_${new Date().toLocaleDateString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.mistakes) setMistakes(data.mistakes);
        if (data.exams) setExams(data.exams);
        if (data.reports) localStorage.setItem('kaoyan_analysis_reports', JSON.stringify(data.reports));
        alert('✅ 数据导入成功！');
        window.location.reload();
      } catch (err) {
        alert('❌ 文件格式错误，无法导入！');
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // reset
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:flex w-10 h-10 bg-indigo-600 text-white rounded-xl items-center justify-center shadow-sm shrink-0">
              <BookOpenCheck className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <h1 className="font-bold text-lg sm:text-xl leading-tight truncate">考研英语错题复盘神器</h1>
              <p className="text-xs text-slate-500 hidden md:block">专属提分笔记本 & AI 深度诊断</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input 
              type="file" 
              accept=".json" 
              onChange={handleImportData} 
              className="hidden" 
              id="import-file" 
            />
            <label 
              htmlFor="import-file"
              className="cursor-pointer flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition"
              title="导入备份数据"
            >
              <Upload className="w-4 h-4" />
            </label>
            <button 
              onClick={handleExportData}
              className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition"
              title="备份导出数据"
            >
              <Download className="w-4 h-4" />
            </button>
            <div className="w-px h-6 bg-slate-200 mx-1"></div>
            <PWAInstallButton />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Form and AI Analysis */}
          <div className="lg:col-span-7 space-y-8">
            <section>
              <ExamManager exams={exams} onAddExam={handleAddExam} onDeleteExam={handleDeleteExam} />
            </section>

            <section>
              <MistakeForm onAddMistake={handleAddMistake} />
            </section>
            
            <section>
              <AnalysisReport mistakes={mistakes} exams={exams} />
            </section>
          </div>

          {/* Right Column: Mistake List */}
          <div className="lg:col-span-5">
            <div className="bg-slate-100/50 p-6 rounded-3xl border border-slate-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg text-slate-800">错题本</h3>
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full">
                  共 {mistakes.length} 题
                </span>
              </div>
              
              <div className="max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
                <MistakeList mistakes={mistakes} onDelete={handleDeleteMistake} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}


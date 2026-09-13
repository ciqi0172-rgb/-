import React, { useState } from 'react';
import { Mistake, ExamMaterial, AnalysisResponse } from '../types';
import { BrainCircuit, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import Markdown from 'react-markdown';

interface Props {
  mistakes: Mistake[];
  exams: ExamMaterial[];
}

export function AnalysisReport({ mistakes, exams }: Props) {
  const [reports, setReports] = useState<AnalysisResponse[]>(() => {
    const saved = localStorage.getItem('kaoyan_analysis_reports');
    return saved ? JSON.parse(saved) : [];
  });
  const [expandedReports, setExpandedReports] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Save reports to localStorage whenever they change
  React.useEffect(() => {
    localStorage.setItem('kaoyan_analysis_reports', JSON.stringify(reports));
  }, [reports]);

  const handleGenerate = async () => {
    if (mistakes.length === 0) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mistakes, exams }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '分析生成失败，请检查 API 配置');
      }
      
      const uniqueYears = Array.from(new Set(mistakes.map(m => String(m.year || '').trim()))).filter(Boolean).sort();

      const newReport: AnalysisResponse = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        analysis: data.analysis,
        mistakeCount: mistakes.length,
        years: uniqueYears,
      };

      // Add the new report to the top of the history list
      setReports(prev => [newReport, ...prev]);
      // Auto expand the newly generated report
      setExpandedReports(prev => {
        const next = new Set(prev);
        next.add(newReport.id);
        return next;
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleReport = (id: string) => {
    setExpandedReports(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleDeleteReport = (id: string) => {
    if (window.confirm('确定要删除这份诊断报告吗？')) {
      setReports(prev => prev.filter(report => report.id !== id));
    }
  };

  if (mistakes.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 bg-white rounded-3xl p-8 shadow-sm border border-slate-200 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-5">
        <BrainCircuit className="w-48 h-48" />
      </div>

      <div className="relative z-10">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">名师 AI 深度诊断</h2>
        <p className="text-slate-500 mb-8 max-w-xl">
          一键将您的所有复盘记录发送给 AI，深度分析您的思维误区，量身定制考研提分策略。
        </p>

        {!loading && (
          <button
            onClick={handleGenerate}
            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-md shadow-indigo-200 mb-8"
          >
            <BrainCircuit className="w-5 h-5" />
            基于当前 {mistakes.length} 道错题生成新诊断
          </button>
        )}

        {loading && (
          <div className="flex items-center gap-3 text-indigo-600 font-medium mb-8">
            <Loader2 className="w-5 h-5 animate-spin" />
            正在分析中，请稍候...
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100 mb-8">
            {error}
          </div>
        )}

        {/* History of Reports */}
        {reports.length > 0 && (
          <div className="space-y-8 mt-4">
            <h3 className="font-bold text-lg text-slate-700 border-b pb-2">历史诊断记录</h3>
            {reports.map((report) => {
              const isExpanded = expandedReports.has(report.id);
              return (
                <div key={report.id} className="prose prose-slate prose-indigo max-w-none relative bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden transition-all duration-200">
                   <div 
                     className="flex justify-between items-center p-4 sm:p-5 bg-slate-100/50 cursor-pointer hover:bg-slate-100 transition"
                     onClick={() => toggleReport(report.id)}
                   >
                      <div className="flex items-center gap-3">
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-slate-500" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-slate-500" />
                        )}
                        <span className="text-sm font-medium text-slate-800">
                          {report.years && report.years.length > 0 
                            ? `${report.years.join('、')}年真题诊断` 
                            : '综合深度诊断'}
                          <span className="text-slate-400 font-normal ml-2">
                            ({new Date(report.timestamp).toLocaleDateString()} · 基于 {report.mistakeCount} 道错题)
                          </span>
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteReport(report.id);
                        }}
                        className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition"
                      >
                        删除记录
                      </button>
                   </div>
                  {isExpanded && (
                    <div className="p-6 sm:p-8 border-t border-slate-200 markdown-body bg-white">
                      <Markdown>{report.analysis}</Markdown>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

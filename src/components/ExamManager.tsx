import React, { useState } from 'react';
import { ExamMaterial } from '../types';
import { BookOpen, Upload, Trash2, FileText, Loader2 } from 'lucide-react';

interface Props {
  exams: ExamMaterial[];
  onAddExam: (exam: ExamMaterial) => void;
  onDeleteExam: (id: string) => void;
}

export function ExamManager({ exams, onAddExam, onDeleteExam }: Props) {
  const [year, setYear] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!year.trim()) {
      setError("请先填写真题年份！");
      e.target.value = ''; // clear file input
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/extract-text', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '提取文件文本失败');
      }

      onAddExam({
        id: Date.now().toString(),
        year: year.trim(),
        fileName: file.name,
        content: data.text,
      });

      setYear('');
      e.target.value = '';
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <div className="flex items-center gap-2 mb-4 text-slate-800">
        <BookOpen className="w-5 h-5 text-indigo-600" />
        <h2 className="text-xl font-semibold">真题原文库</h2>
      </div>
      
      <p className="text-sm text-slate-500 mb-6">
        上传真题原文 (支持 PDF/TXT)，AI 分析时会自动参考原文内容，定位陷阱，提供更精准的诊断！
      </p>

      <div className="flex flex-col sm:flex-row items-end gap-4 mb-6">
        <div className="w-full sm:w-1/3">
          <label className="block text-sm font-medium text-slate-700 mb-1">真题年份</label>
          <input 
            type="text" 
            placeholder="如: 2019"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            value={year}
            onChange={e => setYear(e.target.value)}
          />
        </div>
        
        <div className="w-full sm:w-auto relative">
          <input 
            type="file" 
            accept=".pdf,.txt"
            onChange={handleFileUpload}
            disabled={loading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />
          <button 
            type="button"
            disabled={loading}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {loading ? '正在解析文件...' : '选择文件上传'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
          {error}
        </div>
      )}

      {exams.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-700">已上传的真题：</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {exams.map((exam) => (
              <div key={exam.id} className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200 group">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="p-2 bg-white rounded shadow-sm border border-slate-100 flex-shrink-0">
                    <FileText className="w-4 h-4 text-indigo-500" />
                  </div>
                  <div className="truncate">
                    <div className="text-sm font-bold text-slate-700">{exam.year} 年真题</div>
                    <div className="text-xs text-slate-500 truncate">{exam.fileName} ({Math.round(exam.content.length / 1024)}KB 文本)</div>
                  </div>
                </div>
                <button 
                  onClick={() => onDeleteExam(exam.id)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                  title="删除原文"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

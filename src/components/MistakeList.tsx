import React from 'react';
import { Mistake } from '../types';
import { FileText, Trash2 } from 'lucide-react';

interface Props {
  mistakes: Mistake[];
  onDelete: (id: string) => void;
}

export function MistakeList({ mistakes, onDelete }: Props) {
  if (mistakes.length === 0) {
    return (
      <div className="bg-slate-50 border border-slate-200 border-dashed rounded-2xl p-12 text-center text-slate-500">
        <FileText className="w-12 h-12 mx-auto mb-3 text-slate-400" />
        <p>还没有记录任何错题，快去添加吧！</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {mistakes.map((mistake) => (
        <div key={mistake.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 group relative">
          <button 
            onClick={() => onDelete(mistake.id)}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
            title="删除错题"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-3 mb-3">
            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm font-semibold rounded-full">
              {mistake.year} {mistake.textType}
            </span>
            <span className="text-slate-600 font-medium">第 {mistake.questionNum} 题</span>
            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded border border-slate-200">
              {mistake.questionType}
            </span>
          </div>

          <div className="flex items-center gap-4 mb-4 text-sm">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">我的答案:</span>
              <span className="font-bold text-red-500">{mistake.myAnswer}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">正确答案:</span>
              <span className="font-bold text-emerald-600">{mistake.correctAnswer}</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <h4 className="text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">我的复盘思路</h4>
              <p className="text-slate-700 text-sm">{mistake.myThoughtProcess}</p>
            </div>
            
            {mistake.coreWeakness && (
              <div className="bg-amber-50 p-3 rounded-lg border border-amber-100/50">
                <h4 className="text-xs font-semibold text-amber-700/70 mb-1 uppercase tracking-wider">核心盲区</h4>
                <p className="text-amber-900 text-sm">{mistake.coreWeakness}</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

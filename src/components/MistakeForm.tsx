import React, { useState } from 'react';
import { Mistake } from '../types';
import { PlusCircle, Save } from 'lucide-react';

interface Props {
  onAddMistake: (mistake: Mistake) => void;
}

const QUESTION_TYPES = [
  '细节事实题 (Detail)',
  '主旨大意题 (Main Idea)',
  '词义句意题 (Vocabulary/Sentence)',
  '推理判断题 (Inference)',
  '态度方向题 (Attitude)',
  '篇章结构题 (Structure)'
];

export function MistakeForm({ onAddMistake }: Props) {
  const [formData, setFormData] = useState<Partial<Mistake>>({
    year: '2019',
    textType: 'Text 2',
    questionType: QUESTION_TYPES[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.questionNum || !formData.myAnswer || !formData.myThoughtProcess) return;
    
    onAddMistake({
      ...formData,
      id: Date.now().toString(),
    } as Mistake);
    
    // Reset form but keep year and text type for convenience
    setFormData(prev => ({
      year: prev.year,
      textType: prev.textType,
      questionType: QUESTION_TYPES[0],
      questionNum: '',
      myAnswer: '',
      correctAnswer: '',
      myThoughtProcess: '',
      coreWeakness: ''
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <div className="flex items-center gap-2 mb-6 text-slate-800">
        <PlusCircle className="w-5 h-5 text-indigo-600" />
        <h2 className="text-xl font-semibold">录入新错题</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">年份</label>
          <input 
            type="text" 
            placeholder="如: 2019"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            value={formData.year || ''}
            onChange={e => setFormData({...formData, year: e.target.value})}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">篇章</label>
          <input 
            type="text" 
            placeholder="如: Text 2"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            value={formData.textType || ''}
            onChange={e => setFormData({...formData, textType: e.target.value})}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">题号</label>
          <input 
            type="text" 
            placeholder="如: 30"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            value={formData.questionNum || ''}
            onChange={e => setFormData({...formData, questionNum: e.target.value})}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">题型归类</label>
          <select 
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            value={formData.questionType}
            onChange={e => setFormData({...formData, questionType: e.target.value})}
          >
            {QUESTION_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">我的答案</label>
          <input 
            type="text" 
            placeholder="如: C"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none uppercase"
            value={formData.myAnswer || ''}
            onChange={e => setFormData({...formData, myAnswer: e.target.value})}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">正确答案</label>
          <input 
            type="text" 
            placeholder="如: B"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none uppercase"
            value={formData.correctAnswer || ''}
            onChange={e => setFormData({...formData, correctAnswer: e.target.value})}
            required
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 mb-1">当时做题的复盘思路 (越详细越好)</label>
        <textarea 
          rows={3}
          placeholder="回忆一下，当时为什么觉得自己的答案是对的？哪里犹豫了？"
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
          value={formData.myThoughtProcess || ''}
          onChange={e => setFormData({...formData, myThoughtProcess: e.target.value})}
          required
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 mb-1">总结的核心盲区</label>
        <textarea 
          rows={2}
          placeholder="如: 偷换概念、没注意到代词、不认识关键连词..."
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
          value={formData.coreWeakness || ''}
          onChange={e => setFormData({...formData, coreWeakness: e.target.value})}
        />
      </div>

      <div className="flex justify-end">
        <button 
          type="submit"
          className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Save className="w-4 h-4" />
          保存至错题本
        </button>
      </div>
    </form>
  );
}

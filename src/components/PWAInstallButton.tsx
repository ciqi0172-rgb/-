import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [showFallbackGuide, setShowFallbackGuide] = useState(false);

  // If already running as an installed PWA, hide the button
  if (isInstalled) {
    return null;
  }

  const handleClick = () => {
    if (isIOS) {
      setShowIOSGuide(true);
      return;
    }
    
    if (isInstallable) {
      install();
    } else {
      setShowFallbackGuide(true);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-indigo-700 transition"
      >
        <Download className="w-4 h-4" />
        <span className="hidden sm:inline">安装到桌面</span>
        <span className="sm:hidden">安装</span>
      </button>

      {showIOSGuide && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl text-center">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">安装到苹果主屏幕</h3>
            <p className="text-sm text-slate-600 mb-6 text-left space-y-2">
              <span className="block">1. 请确保您在 <strong>Safari 浏览器</strong> 中打开此网页</span>
              <span className="block">2. 点击浏览器底部的 <strong>分享</strong> 图标 (带向上箭头的方块)</span>
              <span className="block">3. 向下滑动并选择 <strong>添加到主屏幕</strong></span>
            </p>
            <button
              onClick={() => setShowIOSGuide(false)}
              className="w-full rounded-lg bg-slate-100 py-2.5 text-sm font-medium text-slate-800 hover:bg-slate-200 transition"
            >
              我知道了
            </button>
          </div>
        </div>
      )}

      {showFallbackGuide && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl text-center">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">安装说明</h3>
            <p className="text-sm text-slate-600 mb-6 text-left space-y-2">
              浏览器拦截了自动安装。您可以手动添加：<br/><br/>
              请点击浏览器右上角的 <strong>菜单 (三个点/三条杠)</strong>，然后手动选择 <strong>「添加到主屏幕」</strong> 或 <strong>「安装应用」</strong>。
            </p>
            <button
              onClick={() => setShowFallbackGuide(false)}
              className="w-full rounded-lg bg-slate-100 py-2.5 text-sm font-medium text-slate-800 hover:bg-slate-200 transition"
            >
              我知道了
            </button>
          </div>
        </div>
      )}
    </>
  );
};

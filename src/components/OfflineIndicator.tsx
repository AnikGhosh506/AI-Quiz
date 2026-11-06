import React, { useState, useEffect } from 'react';
import { WifiOff, Database, CheckCircle2, RefreshCw, CloudCheck } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'offline'>(
    typeof navigator !== 'undefined' && !navigator.onLine ? 'offline' : 'synced'
  );
  const [showSyncBanner, setShowSyncBanner] = useState<boolean>(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setSyncStatus('syncing');
      setShowSyncBanner(true);

      // Simulate real-time Firestore background sync completion
      const timer = setTimeout(() => {
        setSyncStatus('synced');
        setTimeout(() => setShowSyncBanner(false), 3500);
      }, 2000);

      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setSyncStatus('offline');
      setShowSyncBanner(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showSyncBanner && isOnline && syncStatus === 'synced') return null;

  return (
    <div className="fixed bottom-5 left-5 z-50 aurix-glass-card bg-[#0d160f]/95 border border-[#a3e635]/40 text-neutral-200 py-2.5 px-4 rounded-2xl shadow-[0_10px_35px_rgba(0,0,0,0.85)] flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 text-left">
      {syncStatus === 'offline' && (
        <>
          <div className="w-8 h-8 rounded-full bg-amber-400/20 border border-amber-400 flex items-center justify-center text-amber-300 shrink-0">
            <WifiOff className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>Offline Mode Active</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 font-mono">
                🔴 PWA CACHED
              </span>
            </div>
            <span className="text-[11px] text-amber-200/90 block">
              Test results &amp; progress reports served from local cache.
            </span>
          </div>
        </>
      )}

      {syncStatus === 'syncing' && (
        <>
          <div className="w-8 h-8 rounded-full bg-[#142316] border border-[#a3e635] flex items-center justify-center text-[#a3e635] shrink-0">
            <RefreshCw className="w-4 h-4 animate-spin" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>Syncing Local Cache</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#a3e635]/20 text-[#bef264] font-mono">
                🟡 SYNCING WITH FIRESTORE
              </span>
            </div>
            <span className="text-[11px] text-neutral-300 block">
              Re-establishing cloud connection &amp; writing offline entries...
            </span>
          </div>
        </>
      )}

      {syncStatus === 'synced' && isOnline && (
        <>
          <div className="w-8 h-8 rounded-full bg-emerald-950/80 border border-emerald-400 flex items-center justify-center text-emerald-400 shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>Connection Restored</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                🟢 FIRESTORE SYNCED
              </span>
            </div>
            <span className="text-[11px] text-emerald-200 block">
              All cached local test data successfully synchronized with database.
            </span>
          </div>
        </>
      )}
    </div>
  );
};

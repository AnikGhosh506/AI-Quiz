import React, { useState } from 'react';
import { Download, Smartphone, X, Check, Sparkles } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { playHoverSound } from '../utils/audioEffects';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed standalone PWA, hide the button
  if (isInstalled) {
    return (
      <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#142316] border border-[#a3e635]/30 text-[11px] font-semibold text-[#bef264]">
        <Check className="w-3.5 h-3.5 text-[#a3e635]" />
        <span>AURIX App Installed</span>
      </div>
    );
  }

  const handleInstallClick = async () => {
    playHoverSound('pop');
    if (isInstallable) {
      await install();
    } else if (isIOS) {
      setShowIOSGuide(true);
    } else {
      // Fallback prompt for desktop/browsers prior to beforeinstallprompt event trigger
      alert("To install AURIX on your desktop or device: Click the install icon (⊕ or 📥) in your browser address bar.");
    }
  };

  return (
    <>
      <button
        onClick={handleInstallClick}
        onMouseEnter={() => playHoverSound('hiss')}
        className="aurix-3d-button px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold text-[#040604] flex items-center gap-1.5 shadow-[0_0_15px_rgba(163,230,53,0.3)] active:scale-95 transition-all cursor-pointer whitespace-nowrap shrink-0 group"
        title="Install AURIX as Desktop / Mobile App"
      >
        <Download className="w-3.5 h-3.5 text-[#040604] group-hover:translate-y-0.5 transition-transform" />
        <span className="hidden sm:inline">Install App</span>
        <span className="sm:hidden">App</span>
      </button>

      {/* iOS Safari Guided Install Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm aurix-3d-card bg-[#0c140e] border border-[#a3e635]/40 rounded-3xl p-6 text-left space-y-4 shadow-2xl">
            <button
              onClick={() => setShowIOSGuide(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-[#142316] border border-[#a3e635]/40 flex items-center justify-center text-[#a3e635]">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">Install on iPhone / iPad</h3>
                <span className="text-[11px] text-[#bef264]">Safari Progressive Web App</span>
              </div>
            </div>

            <ol className="space-y-2.5 text-xs text-neutral-300 border-t border-white/10 pt-3">
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-[#142316] text-[#a3e635] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">1</span>
                <span>Tap the <strong>Share</strong> button at the bottom of your Safari browser window.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-[#142316] text-[#a3e635] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">2</span>
                <span>Scroll down and tap <strong>Add to Home Screen</strong>.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-[#142316] text-[#a3e635] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">3</span>
                <span>Tap <strong>Add</strong> to launch AURIX as a full-screen app icon.</span>
              </li>
            </ol>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="w-full aurix-3d-button py-2.5 px-4 rounded-xl text-xs font-bold text-[#040604] cursor-pointer"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};

import { Link } from 'react-router-dom';
import { Typewriter } from '../ui/Typewriter';
import { Info, ArrowRight } from 'lucide-react';

export function GlobalFooter() {
    return (
        <footer id="global-footer" className="bg-transparent px-4 md:px-6 py-4 w-full relative z-10 flex flex-col gap-4">
            <div className="max-w-[1200px] mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-3">

                {/* Tile 1: Skitech Info & Mission */}
                <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[#0F3D91] flex items-center justify-center text-white">
                            <Info className="w-4 h-4" />
                        </div>
                        <h3 className="font-heading font-black text-[#0F3D91] tracking-tight text-base">
                            Skitech mission
                        </h3>
                    </div>
                    <p className="text-slate-500 text-[11px] font-medium leading-relaxed">
                        Redefining house-hunting and marketplace interactions with transparency, safety, and verified listings. Skitech connects you to quality spaces and shared resources through a trusted digital ecosystem.
                    </p>
                    <div className="flex items-center gap-3 mt-auto">
                        <Link to="/legal?tab=terms" className="text-[9px] font-black text-slate-400 hover:text-[#0F3D91] tracking-wide transition-colors">
                            Terms of service
                        </Link>
                        <div className="w-1 h-1 rounded-full bg-slate-200" />
                        <Link to="/legal?tab=privacy" className="text-[9px] font-black text-slate-400 hover:text-[#0F3D91] tracking-wide transition-colors">
                            Privacy policy
                        </Link>
                    </div>
                </div>

                {/* Tile 2: Blue Help Section (Typewriter) */}
                <div className="bg-[#0F3D91] rounded-2xl p-5 shadow-xl shadow-blue-900/10 flex flex-col justify-between gap-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl" />

                    <div className="relative z-10">
                        <div className="text-white font-heading font-black text-xl md:text-2xl tracking-tighter italic leading-none">
                            <Typewriter
                                texts={[
                                    "Need a system guide?",
                                    "Safety concerns?",
                                    "Looking for verified houses?",
                                    "Got something to sell?"
                                ]}
                                delay={120}
                            />
                        </div>
                    </div>

                    <div className="relative z-10">
                        <Link
                            to="/help"
                            className="inline-flex items-center gap-2 bg-[#FF7A00] hover:bg-white hover:text-[#0F3D91] text-white font-black text-[10px] tracking-wide px-6 py-3 rounded-xl transition-all duration-300 shadow-lg shadow-black/10"
                        >
                            Go to help center <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Bottom Info Bar */}
            <div className="max-w-[1200px] mx-auto w-full flex items-center justify-between px-2 pt-2 border-t border-slate-100/50">
                <div className="flex items-center gap-3">
                    <span className="text-[9px] font-black text-[#0F3D91] bg-[#0F3D91]/5 px-2 py-0.5 rounded-full tracking-wide border border-[#0F3D91]/10">
                        v.1.1.1
                    </span>
                    <span className="text-[8px] font-bold text-slate-400 tracking-wide">
                        Stable build
                    </span>
                </div>
                <p className="text-[8px] font-extrabold text-slate-400 tracking-wide">
                    © 2026 Skitech Solutions Ltd.
                </p>
            </div>
        </footer>
    );
}

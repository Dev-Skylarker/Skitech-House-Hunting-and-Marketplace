import { Link } from 'react-router-dom';
import { HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export function GlobalFooter() {
    return (
        /*
         * LAYOUT STRATEGY
         * ───────────────
         * The footer is always in-flow inside the white sheet (AppLayout).
         * On mobile the outer wrapper has pb-[calc(64px+env(safe-area-inset-bottom,0px))]
         * so the sheet bottom clears the fixed BottomNav.  The footer itself
         * needs no positioning tricks — it scrolls into view naturally.
         *
         * The small "Help" lead chip animates in on mount to draw the eye.
         */
        <footer
            id="global-footer"
            className="
                bg-transparent
                px-5 md:px-8 py-4
                w-full relative z-10
            "
        >
            <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">

                {/* ── Brand column ─────────────────────────────────── */}
                <div className="flex flex-col gap-1 items-center sm:items-start text-center sm:text-left">
                    <div className="flex items-center gap-2">
                        <span
                            className="
                                font-black tracking-[-0.02em] text-[1.1rem] md:text-xl
                                text-[#0F3D91] hover:text-[#FF7A00]
                                transition-colors duration-200 cursor-pointer
                                select-none uppercase
                            "
                            style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                            SKITECH HOUSE-HUNTING & MARKETPLACE
                        </span>
                    </div>
                    <p
                        className="text-[10px] sm:text-xs text-slate-500 font-bold leading-tight"
                        style={{ fontFamily: "'Inter', sans-serif", letterSpacing: '0.01em' }}
                    >
                        Managed By Skitech Solutions
                    </p>
                </div>

                {/* ── Nav links + Help Centre lead chip ─────────────── */}
                <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-end">

                    {/* "Need help?" animated chip — the "lead section" */}
                    <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15, duration: 0.4, ease: 'easeOut' }}
                    >
                        <Link
                            to="/help"
                            className="
                                inline-flex items-center gap-1.5
                                bg-white/60 backdrop-blur-md shadow-sm
                                border border-white/40 hover:border-white/80
                                text-[#0F3D91] hover:bg-white/90
                                px-4 py-2 rounded-full
                                transition-all duration-300
                                group
                            "
                        >
                            <HelpCircle
                                className="
                                    w-3 h-3 shrink-0
                                    text-[#0F3D91] group-hover:text-[#FF7A00]
                                    transition-colors duration-200
                                "
                            />
                            <span
                                className="text-[9.5px] font-extrabold uppercase tracking-[0.14em]"
                                style={{ fontFamily: "'Poppins', sans-serif" }}
                            >
                                Help Center
                            </span>
                            {/* Pulse dot — live indicator */}
                            <span className="w-1.5 h-1.5 rounded-full bg-[#FF7A00] animate-pulse" />
                        </Link>
                    </motion.div>

                    {/* Divider */}
                    <div className="h-3.5 w-px bg-slate-200 hidden sm:block" />

                    <Link
                        to="/legal?tab=terms"
                        className="
                            text-[9.5px] font-bold text-slate-500
                            hover:text-[#0F3D91]
                            uppercase tracking-[0.14em]
                            transition-colors duration-200
                        "
                        style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                        Terms
                    </Link>

                    <Link
                        to="/legal?tab=privacy"
                        className="
                            text-[9.5px] font-bold text-slate-400
                            hover:text-[#0F3D91]
                            uppercase tracking-[0.14em]
                            transition-colors duration-200
                        "
                        style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                        Privacy
                    </Link>

                    <span className="
                            text-[8.5px] font-extrabold text-slate-500
                            uppercase tracking-[0.18em]
                            bg-white/50 backdrop-blur-sm border border-white/30
                            px-1.5 py-0.5 rounded-full
                        ">
                        V.1.1.1
                    </span>

                    <span
                        className="text-[9.5px] font-bold text-slate-400 uppercase tracking-[0.14em]"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                        © {new Date().getFullYear()}
                    </span>
                </div>
            </div>
        </footer>
    );
}

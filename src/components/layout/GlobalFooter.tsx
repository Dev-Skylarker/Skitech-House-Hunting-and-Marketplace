import { Link } from 'react-router-dom';
import { ExternalLink, MessageCircle } from 'lucide-react';

export function GlobalFooter() {
    return (
        <footer className="bg-transparent text-[#0F3D91] pt-8 pb-32 md:pb-12 px-6">
            <div className="max-w-[1200px] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* Brand Column */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-heading font-black tracking-tight leading-tight uppercase text-[#0F3D91]">
                            SKITECH HOUSE-HUNTING<br />
                            <span className="text-[#FF7A00]">& MARKETPLACE</span>
                        </h2>
                        <p className="text-slate-500 text-xs leading-relaxed max-w-xs font-medium">
                            Finding your perfect home in Embu made simple. Verified listings, secure transitions, and local marketplace deals.
                        </p>
                        <div className="pt-2">
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Managed By</span>
                            <p className="font-bold text-[#0F3D91] group flex items-center gap-2 text-xs">
                                Skitech Solutions
                                <a
                                    href="https://skitechsolutions.vercel.app"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-[#FF7A00] transition-colors"
                                >
                                    <ExternalLink className="w-3 h-3" />
                                </a>
                            </p>
                        </div>
                    </div>

                    {/* Links Column */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                            <h3 className="text-[#FF7A00] font-black uppercase text-[9px] tracking-widest">System Guide</h3>
                            <ul className="space-y-2 text-xs text-slate-500 font-bold">
                                <li><Link to="/guide" className="hover:text-[#0F3D91] transition-colors">How it Works</Link></li>
                                <li><Link to="/guide" className="hover:text-[#0F3D91] transition-colors">Become a Landlord</Link></li>
                                <li><Link to="/faq" className="hover:text-[#0F3D91] transition-colors">FAQs</Link></li>
                            </ul>
                        </div>
                        <div className="space-y-3">
                            <h3 className="text-[#FF7A00] font-black uppercase text-[9px] tracking-widest">Essential Hub</h3>
                            <ul className="space-y-2 text-xs text-slate-500 font-bold">
                                <li><Link to="/privacy" className="hover:text-[#0F3D91] transition-colors">Privacy Policy</Link></li>
                                <li><Link to="/terms" className="hover:text-[#0F3D91] transition-colors">Terms of Service</Link></li>
                                <li><Link to="/faq" className="hover:text-[#0F3D91] transition-colors">About Us</Link></li>
                            </ul>
                        </div>
                    </div>

                    {/* Support Column */}
                    <div className="bg-white/40 p-6 rounded-[32px] border border-slate-100 backdrop-blur-md flex flex-col justify-between shadow-sm">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <h3 className="text-base font-heading font-black text-[#0F3D91] uppercase tracking-tight">Online Support</h3>
                            </div>
                            <p className="text-xs text-slate-500 mb-4 leading-relaxed font-medium">
                                Have any queries? Our team is ready to help.
                            </p>
                        </div>
                        <a
                            href="https://wa.me/254741909607"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center justify-center gap-2 w-full bg-[#0F3D91] hover:bg-[#FF7A00] text-white font-black uppercase text-[10px] tracking-widest py-3 rounded-2xl transition-all shadow-lg active:scale-95"
                        >
                            <MessageCircle className="w-4 h-4" />
                            Talk to Us Now
                        </a>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-6 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-[9px] font-black uppercase tracking-widest text-slate-400">
                    <p>© 2026 Skitech Solutions. All rights reserved.</p>
                    <div className="flex items-center gap-3">
                        <span className="px-2 py-1 bg-slate-50 rounded-full border border-slate-100">Built by Skitech Solutions</span>
                        <span className="font-mono opacity-60">V.1.1.1</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

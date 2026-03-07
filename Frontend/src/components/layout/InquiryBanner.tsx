import { Link } from 'react-router-dom';
import { ArrowRight, Home, ShoppingBag } from 'lucide-react';

export function InquiryBanner() {
    return (
        <section className="px-4 md:px-6 py-4">
            <Link
                to="/inquiry"
                className="
                    block relative overflow-hidden rounded-[28px] md:rounded-[32px]
                    bg-white border border-slate-100/80
                    shadow-[0_4px_24px_rgb(15,61,145,0.06)]
                    hover:shadow-[0_8px_32px_rgb(15,61,145,0.12)]
                    hover:border-[#0F3D91]/10
                    transition-all duration-300 ease-out
                    active:scale-[0.99] group
                    p-5 md:p-6
                "
            >
                {/* Ambient glow orbs */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#FF7A00]/8 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-500 pointer-events-none" />
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-[#0F3D91]/6 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-700 pointer-events-none" />

                <div className="relative z-10 flex items-center justify-between gap-4">
                    {/* Text block */}
                    <div className="flex flex-col gap-1 min-w-0">
                        {/* Label pill */}
                        <span className="inline-flex w-fit items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.18em] text-[#FF7A00] bg-[#FF7A00]/8 px-2.5 py-1 rounded-full mb-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#FF7A00] animate-pulse" />
                            Personalised Request
                        </span>

                        <h3 className="font-heading font-extrabold text-[#0F3D91] text-base md:text-lg leading-snug">
                            Tell us what you{' '}
                            <span className="text-[#FF7A00] relative">
                                need
                                {/* Underline accent */}
                                <span className="absolute -bottom-0.5 left-0 right-0 h-[2px] bg-[#FF7A00]/30 rounded-full" />
                            </span>
                        </h3>
                        <p className="text-slate-500 text-[11px] md:text-xs font-medium leading-relaxed max-w-[320px]">
                            Not finding the perfect home or item? Let us help you find it. Submit a request and we'll get back to you.
                        </p>

                        {/* Mini category chips */}
                        <div className="flex items-center gap-2 mt-2">
                            <span className="inline-flex items-center gap-1 text-[9px] font-bold text-slate-400 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full">
                                <Home className="w-2.5 h-2.5" /> Houses
                            </span>
                            <span className="inline-flex items-center gap-1 text-[9px] font-bold text-slate-400 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full">
                                <ShoppingBag className="w-2.5 h-2.5" /> Items
                            </span>
                        </div>
                    </div>

                    {/* CTA icon button */}
                    <div className="
                        shrink-0 w-11 h-11 md:w-12 md:h-12 rounded-2xl
                        bg-[#0F3D91] text-white
                        flex items-center justify-center
                        shadow-lg shadow-[#0F3D91]/20
                        group-hover:bg-[#FF7A00] group-hover:shadow-[#FF7A00]/20
                        group-hover:scale-105
                        transition-all duration-300
                    ">
                        <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </div>
                </div>
            </Link>
        </section>
    );
}

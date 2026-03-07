import { Download, Smartphone } from 'lucide-react';

export function DownloadBanner() {
    return (
        <section className="px-4 md:px-6 py-4">
            <div className="
        max-w-[1200px] mx-auto
        bg-[#0F3D91] rounded-2xl p-6 md:p-8
        relative overflow-hidden
        flex flex-col md:flex-row items-center justify-between gap-6
        shadow-xl shadow-[#0F3D91]/20
      ">
                {/* Background Accents */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#FF7A00]/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />

                <div className="relative z-10 flex items-center gap-4 md:gap-6">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                        <Smartphone className="w-6 h-6 md:w-8 md:h-8 text-white" />
                    </div>
                    <div className="flex flex-col">
                        <h3 className="text-white font-heading font-black text-lg md:text-xl uppercase tracking-tight">
                            Get the Skitech Hub App
                        </h3>
                        <p className="text-white/70 text-sm md:text-base font-medium max-w-[400px]">
                            Access thousands of listings and marketplace items anywhere. Install as a PWA for the best experience.
                        </p>
                    </div>
                </div>

                <button className="
          relative z-10
          bg-[#FF7A00] hover:bg-orange-600
          text-white font-black px-8 py-4 rounded-2xl
          flex items-center gap-3
          transition-all duration-300
          shadow-lg shadow-[#FF7A00]/30
          whitespace-nowrap group
        ">
                    <Download className="w-5 h-5 group-hover:animate-bounce" />
                    INSTALL NOW
                </button>
            </div>
        </section>
    );
}

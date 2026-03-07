import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function BackButton() {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate(-1)}
            className="
        inline-flex items-center gap-2 
        bg-white/80 backdrop-blur-md 
        hover:bg-white border border-slate-100/50 
        hover:border-[#0F3D91]/20
        text-[#0F3D91] hover:text-[#0F3D91]
        px-4 py-2.5 rounded-xl
        transition-all duration-300
        font-black text-[10px] uppercase tracking-widest
        shadow-sm hover:shadow-md
        group mb-4
      "
        >
            <ChevronLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
            Go Back
        </button>
    );
}

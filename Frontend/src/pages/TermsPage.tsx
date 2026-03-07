import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Scale, CheckCircle2, AlertCircle, HelpCircle, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TermsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F7F9FC] pb-24">
      {/* Header */}
      <div className="bg-[#0F3D91] border-b border-blue-800/50 px-6 py-16 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF7A00]/10 rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mb-32 blur-2xl" />

        <div className="max-w-2xl mx-auto space-y-4 relative z-10">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-blue-200/60 hover:text-white transition-colors mb-4 group font-bold text-xs uppercase tracking-widest"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Go Back
          </button>

          <div className="flex justify-center mb-4">
            <div className="p-4 bg-white/10 rounded-[28px] backdrop-blur-md">
              <FileText className="w-10 h-10 text-white" />
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-heading font-black text-white tracking-tight leading-tight uppercase">
            Terms of <span className="text-[#FF7A00]">Service</span>
          </h1>
          <div className="flex items-center justify-center gap-4">
            <span className="h-[2px] w-12 bg-[#FF7A00]" />
            <p className="text-blue-200 font-bold text-[10px] uppercase tracking-[0.2em]">
              The Skitech Community Agreement
            </p>
            <span className="h-[2px] w-12 bg-[#FF7A00]" />
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-4xl mx-auto px-6 -mt-8 relative z-20">
        <div className="bg-white rounded-[40px] shadow-2xl shadow-blue-900/10 border border-slate-100 overflow-hidden">

          {/* Quick Notice */}
          <div className="bg-blue-50/50 px-8 py-6 border-b border-blue-50 flex items-start gap-4">
            <div className="p-2 bg-blue-100 rounded-xl">
              <Scale className="w-5 h-5 text-[#0F3D91]" />
            </div>
            <div>
              <h4 className="font-heading font-black text-slate-900 text-xs uppercase tracking-widest mb-1">Contract Notice</h4>
              <p className="text-[#0F3D91] text-sm font-medium leading-relaxed">
                By using Skitech Embu, you agree to these rules. We keep them simple so everyone can understand their rights and responsibilities.
              </p>
            </div>
          </div>

          <div className="p-8 md:p-12 space-y-12">

            {/* 1. Ownership */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-900 text-white font-black text-xs">01</span>
                <h2 className="text-2xl font-heading font-black text-slate-900 tracking-tight uppercase">Platform Ownership</h2>
              </div>
              <p className="text-slate-500 leading-relaxed font-medium pl-11">
                Skitech House Hunting and marketplace-Embu is an intellectual property managed and operated by{' '}
                <a href="https://skitechsolutions.vercel.app" target="_blank" rel="noopener noreferrer" className="text-[#0F3D91] font-bold hover:text-[#FF7A00] transition-colors underline decoration-2 underline-offset-4 decoration-blue-100">
                  Skitech Solutions
                </a>.
                All software, branding, and content are protected under Kenyan copyright laws.
              </p>
            </section>

            {/* 2. Usage Rules */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#FF7A00] text-white font-black text-xs">02</span>
                <h2 className="text-2xl font-heading font-black text-slate-900 tracking-tight uppercase">Community Guidelines</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-11">
                <TermItem icon={<CheckCircle2 className="w-4 h-4 text-emerald-500" />} text="Use the platform for legitimate housing & trade only." />
                <TermItem icon={<ShieldAlert className="w-4 h-4 text-red-500" />} text="No scraping, hacking, or automated data extraction." />
                <TermItem icon={<CheckCircle2 className="w-4 h-4 text-emerald-500" />} text="Respect other users in the Embu community." />
                <TermItem icon={<ShieldAlert className="w-4 h-4 text-red-500" />} text="Providing false information about properties is prohibited." />
              </div>
            </section>

            {/* 3. Liability */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#0F3D91] text-white font-black text-xs">03</span>
                <h2 className="text-2xl font-heading font-black text-slate-900 tracking-tight uppercase">Disclaimer</h2>
              </div>
              <div className="bg-slate-50 p-8 rounded-[32px] border-l-8 border-[#0F3D91] space-y-4">
                <p className="text-slate-700 font-bold text-sm leading-relaxed">
                  "THE SERVICE IS PROVIDED ON AN 'AS IS' BASIS. WE DO NOT GUARANTEE THAT ALL LISTINGS ARE 100% ACCURATE AT ALL TIMES."
                </p>
                <p className="text-slate-500 text-[13px] font-medium leading-relaxed">
                  While we vet landlords and verify listings, users are encouraged to perform their own due diligence before making payments. Skitech Solutions is not liable for transactions made outside our official protocols.
                </p>
              </div>
            </section>

            {/* 4. Updates */}
            <div className="bg-[#0F3D91] p-8 rounded-[40px] text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                <AlertCircle className="w-32 h-32" />
              </div>
              <div className="relative z-10 space-y-4">
                <h3 className="font-heading font-black uppercase text-lg tracking-tight">Terms Modifications</h3>
                <p className="text-blue-100/70 text-sm font-medium leading-relaxed max-w-xl">
                  We reserve the right to update these terms to reflect community feedback or technical changes. Continued use of the platform after updates implies agreement with the new terms.
                </p>
                <div className="pt-2 flex items-center gap-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#FF7A00]">Last Revision</span>
                  <span className="h-[1px] flex-1 bg-white/10" />
                  <span className="text-[10px] font-black uppercase tracking-widest">March 07, 2026</span>
                </div>
              </div>
            </div>

          </div>

          {/* Footer CTA */}
          <div className="p-8 md:p-12 bg-slate-50 border-t border-slate-100 flex flex-col items-center text-center space-y-6">
            <div className="p-4 bg-white rounded-2xl shadow-sm">
              <HelpCircle className="w-8 h-8 text-[#0F3D91]" />
            </div>
            <div className="space-y-2">
              <h3 className="font-heading font-black text-slate-900 uppercase tracking-tight text-xl">Need more clarity?</h3>
              <p className="text-slate-500 text-sm font-medium max-w-sm">
                Our team is happy to explain any section of this agreement to you.
              </p>
            </div>
            <Button
              className="bg-[#0F3D91] hover:bg-[#FF7A00] text-white rounded-xl h-14 px-12 font-black uppercase text-xs tracking-widest shadow-xl transition-all"
            >
              Contact Support
            </Button>
          </div>

        </div>

        {/* Ownership Copyright */}
        <div className="text-center mt-12">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.4em]">
            &copy; 2026 Skitech Solutions. Powered by Innovation.
          </p>
        </div>
      </div>
    </div>
  );
}

function TermItem({ icon, text }: { icon: React.ReactNode, text: string }) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-2xl border border-slate-50 bg-slate-50/30">
      <div className="mt-0.5">{icon}</div>
      <p className="text-[13px] font-bold text-slate-700 leading-snug">{text}</p>
    </div>
  );
}

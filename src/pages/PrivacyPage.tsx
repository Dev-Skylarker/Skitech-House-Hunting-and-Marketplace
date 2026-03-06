import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Mail, Lock, Eye, Database, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PrivacyPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F7F9FC] pb-24">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-6 py-12 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#0F3D91]/5 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#FF7A00]/5 rounded-full -ml-32 -mb-32 blur-3xl opacity-50" />

        <div className="max-w-2xl mx-auto space-y-4 relative z-10">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-slate-400 hover:text-[#0F3D91] transition-colors mb-4 group font-bold text-xs uppercase tracking-widest"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Go Back
          </button>

          <div className="flex justify-center mb-4">
            <div className="p-4 bg-blue-50 rounded-[28px]">
              <ShieldCheck className="w-10 h-10 text-[#0F3D91]" />
            </div>
          </div>

          <h1 className="text-4xl font-heading font-black text-slate-900 tracking-tight leading-tight uppercase">
            Privacy <span className="text-[#0F3D91]">Policy</span>
          </h1>
          <div className="flex items-center justify-center gap-2">
            <span className="h-[1px] w-8 bg-slate-200" />
            <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em]">
              Last Updated: March 2026
            </p>
            <span className="h-[1px] w-8 bg-slate-200" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 mt-12 space-y-8">
        <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-sm border border-slate-100 space-y-12">

          {/* Introduction */}
          <section className="space-y-4">
            <h2 className="text-2xl font-heading font-black text-slate-900 tracking-tight uppercase">
              1. Our <span className="text-[#FF7A00]">Commitment</span>
            </h2>
            <p className="text-slate-500 leading-relaxed font-medium">
              Skitech House Hunting and marketplace-Embu ("we" or "us" or "our") is owned and managed by{' '}
              <a href="https://skitechsolutions.vercel.app" target="_blank" rel="noopener noreferrer" className="text-[#0F3D91] font-bold decoration-blue-200 decoration-2 underline-offset-4 hover:underline">
                Skitech Solutions
              </a>.
              Your privacy is not just a policy for us; it's a fundamental commitment to the community of Embu. This document explains how we handle your digital footprints.
            </p>
          </section>

          {/* Data Icons Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DataCard
              icon={<Eye className="w-5 h-5 text-[#0F3D91]" />}
              title="Transparency"
              description="We are clear about what we collect and why we need it."
            />
            <DataCard
              icon={<Lock className="w-5 h-5 text-emerald-500" />}
              title="Security"
              description="Your data is encrypted and protected with industry-standard protocols."
            />
          </div>

          <section className="space-y-6">
            <h2 className="text-2xl font-heading font-black text-slate-900 tracking-tight uppercase border-l-4 border-[#0F3D91] pl-4">
              2. Information We Collect
            </h2>
            <div className="space-y-6">
              <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100">
                <div className="flex items-center gap-3 mb-3">
                  <Database className="w-5 h-5 text-[#FF7A00]" />
                  <h3 className="font-heading font-black text-slate-800 text-sm uppercase tracking-wider">Personal Data</h3>
                </div>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">
                  To provide a seamless house hunting experience, we collect your name, email address, phone number, and location. This allows landlords and sellers to reach you effectively.
                </p>
              </div>

              <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100">
                <div className="flex items-center gap-3 mb-3">
                  <Bell className="w-5 h-5 text-blue-500" />
                  <h3 className="font-heading font-black text-slate-800 text-sm uppercase tracking-wider">Usage Data</h3>
                </div>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">
                  We collect info on how you use Skitech: which houses you view, what you favorite, and technical details like IP addresses and browser types to improve our ecosystem.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-heading font-black text-slate-900 tracking-tight uppercase">
              3. Protection <span className="text-[#0F3D91]">Standards</span>
            </h2>
            <p className="text-slate-500 leading-relaxed font-medium">
              We do not sell your data to third parties. We comply with all local data protection regulations in Kenya to ensure your digital life in Embu is safe and respected.
            </p>
          </section>

          {/* Contact Support */}
          <div className="pt-8 border-t border-slate-100">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-1 text-center md:text-left">
                <h4 className="font-heading font-black text-slate-900 uppercase text-xs tracking-widest">Still have questions?</h4>
                <p className="text-slate-500 text-sm font-medium">Our legal team is here to help.</p>
              </div>
              <Button
                onClick={() => window.location.href = 'mailto:support@skitech.co.ke'}
                className="bg-[#0F3D91] hover:bg-[#FF7A00] text-white rounded-2xl h-12 px-8 font-black uppercase text-[10px] tracking-widest shadow-xl transition-all"
              >
                <Mail className="w-3 h-3 mr-2" />
                Email Support
              </Button>
            </div>
          </div>

        </div>

        {/* Managed By */}
        <div className="text-center pt-8">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em]">
            &copy; 2026 Skitech Solutions. All Rights Reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

function DataCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-6 rounded-[32px] bg-white border border-slate-100 shadow-sm space-y-2">
      <div className="p-2.5 bg-slate-50 rounded-2xl w-fit">
        {icon}
      </div>
      <h4 className="font-heading font-black text-slate-900 text-sm uppercase tracking-tighter">{title}</h4>
      <p className="text-slate-500 text-xs font-medium leading-relaxed">{description}</p>
    </div>
  );
}

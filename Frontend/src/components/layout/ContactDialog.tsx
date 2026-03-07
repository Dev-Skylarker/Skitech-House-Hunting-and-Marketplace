import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Mail, Phone, MapPin, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function ContactDialog({ children }: { children?: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setOpen(false);
            toast.success("Message sent! Our team will get back to you shortly.");
        }, 1500);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children || (
                    <Button className="bg-[#0F3D91] hover:bg-[#FF7A00] text-white rounded-xl h-11 font-bold text-xs gap-2 shadow-lg shadow-blue-900/10 hover:shadow-[#FF7A00]/20 transition-all duration-300">
                        <MessageSquare className="w-4 h-4" />
                        Talk to Us Now
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] rounded-[32px] border-none shadow-2xl p-0 overflow-hidden">
                <div className="bg-[#0F3D91] p-10 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <MessageSquare className="w-48 h-48" />
                    </div>
                    <DialogHeader className="relative z-10 text-left">
                        <DialogTitle className="text-3xl font-heading font-black tracking-tight mb-2">
                            TALK TO <br />
                            <span className="text-[#FF7A00]">SKITECH SUPPORT</span>
                        </DialogTitle>
                        <DialogDescription className="text-blue-100/70 text-sm leading-relaxed max-w-[300px]">
                            Have a question or feedback? We'd love to hear from you. We typically respond in under 2 hours.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="p-8 grid grid-cols-1 md:grid-cols-5 gap-8">
                    <div className="md:col-span-3 space-y-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Input
                                    placeholder="Your Name"
                                    required
                                    className="rounded-xl border-slate-100 bg-slate-50 h-10 text-xs font-medium focus:bg-white transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <Input
                                    type="email"
                                    placeholder="Email Address"
                                    required
                                    className="rounded-xl border-slate-100 bg-slate-50 h-10 text-xs font-medium focus:bg-white transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <Textarea
                                    placeholder="How can we help?"
                                    required
                                    className="rounded-xl border-slate-100 bg-slate-50 min-h-[100px] text-xs font-medium focus:bg-white transition-all resize-none"
                                />
                            </div>
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#0F3D91] hover:bg-[#FF7A00] text-white rounded-xl h-12 font-black uppercase text-[10px] tracking-widest shadow-xl transition-all"
                            >
                                {loading ? "Sending..." : (
                                    <>
                                        <Send className="w-3 h-3 mr-2" />
                                        Send Message
                                    </>
                                )}
                            </Button>
                        </form>
                    </div>

                    <div className="md:col-span-2 space-y-6 pt-2 border-t md:border-t-0 md:border-l border-slate-100 md:pl-8">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-[#FF7A00]">Direct Leads</h4>
                        <div className="space-y-4">
                            <ContactInfoItem icon={<Phone className="w-3 h-3" />} label="Call Us" value="+254 700 000 000" />
                            <ContactInfoItem icon={<Mail className="w-3 h-3" />} label="Email" value="support@skitech.co.ke" />
                            <ContactInfoItem icon={<MapPin className="w-3 h-3" />} label="Location" value="Embu, Kenya" />
                        </div>
                        <div className="pt-2">
                            <div className="w-full h-20 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center p-4">
                                <p className="text-[9px] text-center text-slate-400 font-bold leading-tight">
                                    WORKING HOURS <br />
                                    <span className="text-[#0F3D91]">MON - SAT: 8AM - 8PM</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function ContactInfoItem({ icon, label, value }: { icon: React.ReactNode, label: string; value: string }) {
    return (
        <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-slate-400">
                {icon}
                <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
            </div>
            <span className="text-[11px] font-bold text-slate-800">{value}</span>
        </div>
    );
}

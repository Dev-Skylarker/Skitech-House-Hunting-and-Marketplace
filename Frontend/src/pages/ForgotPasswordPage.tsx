import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) setSubmitted(true);
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-[#F7F9FC] px-4 py-12">
            <div className="w-full max-w-md">
                <Link to="/account" className="inline-flex items-center text-sm font-bold text-[#0F3D91] hover:text-[#FF7A00] mb-6 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Login
                </Link>
                <Card className="border-none shadow-xl shadow-blue-900/5 rounded-[32px] overflow-hidden">
                    <CardContent className="p-8 sm:p-10 space-y-6">
                        <div className="text-center space-y-2">
                            <div className="w-16 h-16 bg-[#0F3D91]/5 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <Mail className="w-8 h-8 text-[#0F3D91]" />
                            </div>
                            <h1 className="font-heading font-black text-2xl tracking-tight text-slate-900">Reset Password</h1>
                            <p className="text-sm text-slate-500 font-medium">
                                Enter your registered email address and we'll send you a link to reset your password.
                            </p>
                        </div>

                        {submitted ? (
                            <div className="bg-green-50 border border-green-100 rounded-2xl p-6 text-center space-y-4 animate-in fade-in slide-in-from-bottom-4">
                                <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto" />
                                <div className="space-y-1">
                                    <h3 className="font-bold text-green-900">Check Your Email</h3>
                                    <p className="text-sm text-green-800/80">
                                        We've sent password reset instructions to <strong>{email}</strong>
                                    </p>
                                </div>
                                <Button
                                    variant="outline"
                                    className="mt-4 w-full rounded-xl"
                                    onClick={() => setSubmitted(false)}
                                >
                                    Try another email
                                </Button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Email Address</Label>
                                    <Input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="john@example.com"
                                        className="h-12 rounded-xl bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                                    />
                                </div>
                                <Button type="submit" className="w-full h-12 rounded-xl bg-[#0F3D91] hover:bg-[#FF7A00] text-white font-heading font-bold transition-all duration-300 shadow-md">
                                    Send Reset Link
                                </Button>
                            </form>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

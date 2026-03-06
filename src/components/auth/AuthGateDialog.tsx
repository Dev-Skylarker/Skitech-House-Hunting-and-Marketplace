import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { LogIn, UserPlus } from "lucide-react";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    type?: 'house' | 'item';
}

export function AuthGateDialog({ isOpen, onClose, type = 'house' }: Props) {
    const navigate = useNavigate();
    const location = useLocation();

    const handleSignIn = () => {
        onClose();
        navigate('/account', { state: { from: location } });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[400px] rounded-3xl border-none shadow-2xl">
                <DialogHeader className="pt-4">
                    <DialogTitle className="font-heading font-bold text-xl text-center">
                        Sign in to Explore More
                    </DialogTitle>
                    <DialogDescription className="text-center pt-2 text-sm leading-relaxed">
                        {type === 'house'
                            ? "Join our community to view full property details, verified landlord contacts, and secure booking features."
                            : "Sign in to view product highlights, contact sellers directly, and manage your marketplace favorites."}
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-3 py-4">
                    <Button
                        onClick={handleSignIn}
                        className="w-full h-11 bg-[#0F3D91] hover:bg-[#0F3D91]/90 text-white font-heading font-bold rounded-xl flex items-center justify-center gap-2"
                    >
                        <LogIn className="w-4 h-4" />
                        Sign in / Register
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        className="w-full h-10 text-muted-foreground font-heading font-semibold hover:bg-muted/50 rounded-xl"
                    >
                        Continue as Guest
                    </Button>
                </div>
                <DialogFooter className="sm:justify-center border-t border-border/40 pt-4 pb-2">
                    <p className="text-[10px] text-muted-foreground text-center">
                        By joining, you agree to our Terms of Service and Privacy Policy.
                    </p>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

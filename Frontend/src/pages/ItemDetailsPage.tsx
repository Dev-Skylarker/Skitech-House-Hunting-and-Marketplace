import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Phone, MessageCircle, ChevronLeft, ChevronRight, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ItemCard } from '@/components/ItemCard';
import { useFavorites } from '@/hooks/useFavorites';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/apiService';
import { emailjsService } from '@/services/emailjsService';
import { mockItems } from '@/services/api';
import type { MarketplaceItem } from '@/types';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

export default function ItemDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState<MarketplaceItem | null>(null);
  const [imgIdx, setImgIdx] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactMessage, setContactMessage] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const { favoriteItems, toggleFavoriteItem } = useFavorites();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (id) {
      apiService.marketplace.getItem(id).then(response => {
        if (response.success) {
          setItem(response.item);
        }
      });
    }
  }, [id]);

  useEffect(() => {
    if (item && item.images.length > 1) {
      const interval = setInterval(() => {
        setImgIdx(i => (i + 1) % item.images.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [item]);

  const handleSendMarketplaceInquiry = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please login to send marketplace inquiries.",
        variant: "destructive",
      });
      navigate('/account');
      return;
    }

    if (!item || !contactMessage.trim()) {
      toast({
        title: "Message Required",
        description: "Please enter a message before sending.",
        variant: "destructive",
      });
      return;
    }

    setIsSendingEmail(true);
    
    try {
      const response = await emailjsService.sendMarketplaceOfferEmail(
        item.title,
        user?.name || 'Anonymous User',
        user?.email || 'no-email@example.com',
        contactMessage
      );

      if (response.success) {
        toast({
          title: "Inquiry Sent!",
          description: "Your marketplace inquiry has been sent to the seller.",
        });
        setContactMessage('');
        setShowContactForm(false);
      } else {
        toast({
          title: "Failed to Send",
          description: response.error || "Please try again later.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Email sending error:', error);
      toast({
        title: "Error",
        description: "Failed to send inquiry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSendingEmail(false);
    }
  };

  if (!item) return <div className="flex items-center justify-center h-64 text-muted-foreground">Loading...</div>;

  const related = mockItems.filter(i => i.id !== item.id && i.category === item.category).slice(0, 4);

  return (
    <div className="pb-4">
      {/* Smart Carousel */}
      <div className="relative group aspect-square w-full bg-slate-100 overflow-hidden shadow-inner">
        <div className="absolute inset-0 flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${imgIdx * 100}%)` }}>
          {item.images.map((img, i) => (
            <div key={i} className="min-w-full h-full">
              <img src={img} alt={`${item.title} - ${i + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>

        {/* Navigation Overlay */}
        {item.images.length > 1 && (
          <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <button
              onClick={(e) => { e.stopPropagation(); setImgIdx(i => (i - 1 + item.images.length) % item.images.length); }}
              className="p-2 rounded-full bg-white/90 shadow-lg text-[#0F3D91] hover:bg-white hover:scale-110 active:scale-95 transition-all pointer-events-auto"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setImgIdx(i => (i + 1) % item.images.length); }}
              className="p-2 rounded-full bg-white/90 shadow-lg text-[#0F3D91] hover:bg-white hover:scale-110 active:scale-95 transition-all pointer-events-auto"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="absolute top-4 left-4 right-4 flex justify-between pointer-events-none">
          <button
            onClick={() => window.history.length > 1 ? navigate(-1) : navigate('/marketplace')}
            className="p-2.5 rounded-2xl bg-black/30 backdrop-blur-md text-white border border-white/20 hover:bg-black/50 transition-all active:scale-90 pointer-events-auto"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => toggleFavoriteItem(item.id)}
            className="p-2.5 rounded-2xl bg-black/30 backdrop-blur-md text-white border border-white/20 hover:bg-black/50 transition-all active:scale-90 pointer-events-auto"
          >
            <Heart className={cn('w-5 h-5', favoriteItems.includes(item.id) ? 'fill-[#FF7A00] text-[#FF7A00]' : '')} />
          </button>
        </div>

        {/* Progress Indicators */}
        {item.images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 px-3 py-1.5 rounded-full bg-black/20 backdrop-blur-xl border border-white/10">
            {item.images.map((_, i) => (
              <button
                key={i}
                onClick={() => setImgIdx(i)}
                className={cn(
                  'h-1 rounded-full transition-all duration-300',
                  i === imgIdx ? 'w-4 bg-[#FF7A00]' : 'w-1 bg-white/50 hover:bg-white/80'
                )}
              />
            ))}
          </div>
        )}
      </div>

      <div className="px-4 space-y-4 mt-4">
        <div>
          <Badge className="mb-2">{item.condition === 'like-new' ? 'Like New' : item.condition.charAt(0).toUpperCase() + item.condition.slice(1)}</Badge>
          <h1 className="font-heading font-bold text-xl">{item.title}</h1>
          <p className="font-heading font-bold text-2xl text-primary mt-1">KSh {item.price.toLocaleString()}</p>
        </div>

        <div>
          <h2 className="font-heading font-semibold text-sm mb-2">Description</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
        </div>

        <div className="bg-muted rounded-lg p-4">
          <h2 className="font-heading font-semibold text-sm mb-2">Seller</h2>
          <p className="font-medium">{item.sellerName}</p>
          <div className="flex flex-col gap-2 mt-3">
            <Button 
              onClick={() => setShowContactForm(true)}
              className="w-full bg-[#0F3D91] hover:bg-[#0F3D91]/90"
            >
              <Send className="w-4 h-4 mr-1" /> Make Inquiry
            </Button>
            <div className="flex gap-2">
              <Button asChild className="flex-1 bg-secondary hover:bg-secondary/90">
                <a href={`https://wa.me/${item.whatsapp.replace('+', '')}?text=${encodeURIComponent(`Hello, I got your contact from Skitech, and would like more details about: ${item.title}`)}`} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-4 h-4 mr-1" /> WhatsApp
                </a>
              </Button>
              <Button asChild variant="outline" className="flex-1">
                <a href={`tel:${item.phone}`}><Phone className="w-4 h-4 mr-1" /> Call</a>
              </Button>
            </div>
          </div>
        </div>

        {/* Related Items Section */}
        {related.length > 0 && (
          <div className="pt-2">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-heading font-semibold text-base">Related Items</h2>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide">
              {related.map(i => (
                <div key={i.id} className="min-w-[260px] snap-start">
                  <ItemCard item={i} size="sm" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-bold text-lg">Make an Inquiry</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowContactForm(false)}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Item</p>
                <p className="font-medium">{item.title}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Seller</p>
                <p className="font-medium">{item.sellerName}</p>
              </div>

              <div>
                <label htmlFor="message" className="text-sm font-medium text-muted-foreground mb-1 block">
                  Your Message *
                </label>
                <Textarea
                  id="message"
                  placeholder="Hi, I'm interested in this item. Could you provide more details about its condition and availability?"
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setShowContactForm(false)}
                  className="flex-1"
                  disabled={isSendingEmail}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSendMarketplaceInquiry}
                  disabled={isSendingEmail || !contactMessage.trim()}
                  className="flex-1 bg-[#0F3D91] hover:bg-[#0F3D91]/90"
                >
                  {isSendingEmail ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-1" />
                      Send Inquiry
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

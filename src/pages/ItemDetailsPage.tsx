import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Phone, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ItemCard } from '@/components/ItemCard';
import { useFavorites } from '@/hooks/useFavorites';
import { api, mockItems } from '@/services/api';
import type { MarketplaceItem } from '@/types';
import { cn } from '@/lib/utils';

export default function ItemDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState<MarketplaceItem | null>(null);
  const [imgIdx, setImgIdx] = useState(0);
  const { favoriteItems, toggleFavoriteItem } = useFavorites();

  useEffect(() => {
    if (id) api.getItemById(id).then(setItem);
  }, [id]);

  useEffect(() => {
    if (item && item.images.length > 1) {
      const interval = setInterval(() => {
        setImgIdx(i => (i + 1) % item.images.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [item]);

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
          <div className="flex gap-2 mt-3">
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
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
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
  const [item, setItem] = useState<MarketplaceItem | null>(null);
  const [imgIdx, setImgIdx] = useState(0);
  const { favoriteItems, toggleFavoriteItem } = useFavorites();

  useEffect(() => {
    if (id) api.getItemById(id).then(setItem);
  }, [id]);

  if (!item) return <div className="flex items-center justify-center h-64 text-muted-foreground">Loading...</div>;

  const related = mockItems.filter(i => i.id !== item.id && i.category === item.category).slice(0, 4);

  return (
    <div className="pb-4">
      <div className="relative aspect-square bg-muted">
        <img src={item.images[imgIdx]} alt={item.title} className="w-full h-full object-cover" />
        <Link to="/marketplace" className="absolute top-3 left-3 p-2 rounded-full bg-card/80 backdrop-blur">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <button onClick={() => toggleFavoriteItem(item.id)} className="absolute top-3 right-3 p-2 rounded-full bg-card/80 backdrop-blur">
          <Heart className={cn('w-5 h-5', favoriteItems.includes(item.id) ? 'fill-accent text-accent' : '')} />
        </button>
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
              <a href={`https://wa.me/${item.whatsapp.replace('+', '')}`} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-4 h-4 mr-1" /> WhatsApp
              </a>
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <a href={`tel:${item.phone}`}><Phone className="w-4 h-4 mr-1" /> Call</a>
            </Button>
          </div>
        </div>

        {related.length > 0 && (
          <div>
            <h2 className="font-heading font-semibold mb-3">Related Items</h2>
            <div className="grid grid-cols-2 gap-3">
              {related.map(i => <ItemCard key={i.id} item={i} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

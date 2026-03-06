import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import type { MarketplaceItem } from '@/types';
import { cn } from '@/lib/utils';

interface Props {
  item: MarketplaceItem;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}

const conditionColors: Record<string, string> = {
  new: 'bg-secondary text-secondary-foreground',
  'like-new': 'bg-primary text-primary-foreground',
  used: 'bg-muted text-muted-foreground',
};

export function ItemCard({ item, isFavorite, onToggleFavorite }: Props) {
  return (
    <Link to={`/marketplace/${item.id}`} className="block group">
      <div className="bg-card rounded-lg border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <div className="relative aspect-square overflow-hidden">
          <img
            src={item.images[0]}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          <Badge className={cn('absolute top-2 left-2 text-[10px]', conditionColors[item.condition])}>
            {item.condition === 'like-new' ? 'Like New' : item.condition.charAt(0).toUpperCase() + item.condition.slice(1)}
          </Badge>
          {onToggleFavorite && (
            <button
              onClick={(e) => { e.preventDefault(); onToggleFavorite(item.id); }}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-card/80 backdrop-blur hover:bg-card transition-colors"
            >
              <Heart className={cn('w-4 h-4', isFavorite ? 'fill-accent text-accent' : 'text-muted-foreground')} />
            </button>
          )}
        </div>
        <div className="p-3">
          <h3 className="font-heading font-semibold text-sm text-card-foreground line-clamp-1">{item.title}</h3>
          <span className="font-heading font-bold text-primary mt-1 block">KSh {item.price.toLocaleString()}</span>
        </div>
      </div>
    </Link>
  );
}

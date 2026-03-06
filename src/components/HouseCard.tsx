import { Heart, MapPin, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import type { House } from '@/types';
import { cn } from '@/lib/utils';

interface Props {
  house: House;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}

export function HouseCard({ house, isFavorite, onToggleFavorite }: Props) {
  return (
    <Link to={`/houses/${house.id}`} className="block group">
      <div className="bg-card rounded-lg border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={house.images[0]}
            alt={house.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          <div className="absolute top-2 left-2 flex gap-1">
            {house.verified && <Badge className="bg-secondary text-secondary-foreground text-[10px]">Verified</Badge>}
            <Badge variant="outline" className="bg-card/80 backdrop-blur text-[10px]">{house.distance}km</Badge>
          </div>
          {onToggleFavorite && (
            <button
              onClick={(e) => { e.preventDefault(); onToggleFavorite(house.id); }}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-card/80 backdrop-blur hover:bg-card transition-colors"
            >
              <Heart className={cn('w-4 h-4', isFavorite ? 'fill-accent text-accent' : 'text-muted-foreground')} />
            </button>
          )}
        </div>
        <div className="p-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-heading font-semibold text-sm text-card-foreground line-clamp-1">{house.title}</h3>
          </div>
          <div className="flex items-center gap-1 mt-1 text-muted-foreground">
            <MapPin className="w-3 h-3" />
            <span className="text-xs">{house.location}</span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="font-heading font-bold text-primary">KSh {house.price.toLocaleString()}<span className="text-xs font-normal text-muted-foreground">/mo</span></span>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Eye className="w-3 h-3" />
              <span className="text-xs">{house.views}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

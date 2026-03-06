import { useState } from 'react';
import { Heart, MapPin, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { AuthGateDialog } from '@/components/auth/AuthGateDialog';
import type { House } from '@/types';
import { cn } from '@/lib/utils';

interface Props {
  house: House;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
  size?: 'sm' | 'base';
  layout?: 'grid' | 'list';
}

export function HouseCard({ house, isFavorite, onToggleFavorite, size = 'sm', layout = 'grid' }: Props) {
  const isBase = size === 'base';
  const isList = layout === 'list';
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [showAuthGate, setShowAuthGate] = useState(false);

  const handleDetailsClick = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();

    if (isAuthenticated) {
      navigate(`/houses/${house.id}`);
    } else {
      setShowAuthGate(true);
    }
  };

  return (
    <>
      <div
        onClick={() => handleDetailsClick()}
        className={cn("block group cursor-pointer h-full", isList ? "w-full" : "")}
      >
        <div className={cn(
          "bg-card rounded-xl border border-border/60 overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full flex",
          isList ? "flex-row gap-4" : "flex-col"
        )}>
          <div className={cn("relative overflow-hidden shrink-0", isList ? "w-32 sm:w-48 aspect-square" : "aspect-[4/3]")}>
            <img
              src={house.images[0]}
              alt={house.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            <div className="absolute top-2 left-2 flex gap-1">
              {house.verified && (
                <Badge className={cn('bg-[#0F3D91] text-white px-1.5 py-0.5 rounded-full shadow-sm', isBase ? 'text-[10px]' : 'text-[9px]')}>
                  Verified
                </Badge>
              )}
            </div>
            {onToggleFavorite && (
              <button
                onClick={(e) => { e.preventDefault(); onToggleFavorite(house.id); }}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-black/55 text-white backdrop-blur-sm hover:bg-black/70 transition-colors shadow-sm"
              >
                <Heart
                  className={cn(
                    isBase ? 'w-4.5 h-4.5' : 'w-4 h-4',
                    isFavorite ? 'fill-[#FF7A00] text-[#FF7A00]' : 'text-white/90'
                  )}
                />
              </button>
            )}
            {isList && (
              <Badge
                variant="outline"
                className="absolute bottom-2 right-2 bg-black/55 text-white border-transparent px-1.5 py-0.5 rounded-full backdrop-blur-sm shadow-sm text-[9px]"
              >
                {house.distance}km
              </Badge>
            )}
          </div>
          <div className={cn(isBase ? 'px-3 py-3' : 'px-2.5 py-2.5', 'flex-1 flex flex-col min-w-0')}>
            <div className="flex items-start justify-between gap-1.5">
              <h3 className={cn('font-heading font-semibold text-card-foreground line-clamp-1 leading-snug', isBase ? 'text-[14px]' : 'text-[13px]')}>
                {house.title}
              </h3>
            </div>
            {!isList && (
              <div className="flex items-center gap-1 mt-1 text-muted-foreground">
                <Badge
                  variant="outline"
                  className={cn('bg-muted/50 text-muted-foreground border-transparent px-1.5 py-0.5 rounded-full shadow-sm', isBase ? 'text-[9px]' : 'text-[8px]')}
                >
                  {house.distance}km from Campus
                </Badge>
              </div>
            )}
            <div className="flex items-center gap-1 mt-1 text-muted-foreground">
              <MapPin className={isBase ? 'w-3.5 h-3.5' : 'w-3 h-3'} />
              <span className={cn('line-clamp-1', isBase ? 'text-[12px]' : 'text-[11px]')}>{house.location}</span>
            </div>

            <div className={cn("flex items-center justify-between mt-auto pt-2", isList ? "" : "")}>
              <span className={cn('font-heading font-semibold text-[#0F3D91]', isBase ? 'text-[15px]' : 'text-[14px]')}>
                KSh {house.price.toLocaleString()}
                <span className={cn('font-normal text-muted-foreground ml-0.5', isBase ? 'text-[11px]' : 'text-[10px]')}>/mo</span>
              </span>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Eye className={isBase ? 'w-3.5 h-3.5' : 'w-3 h-3'} />
                <span className={cn(isBase ? 'text-[12px]' : 'text-[11px]')}>{house.views}</span>
              </div>
            </div>

            {isList && (
              <div className="mt-2 text-[11px] text-muted-foreground line-clamp-2 md:line-clamp-none">
                {house.description}
              </div>
            )}

            {!isList && (
              <div className="pt-2.5">
                <Button
                  onClick={handleDetailsClick}
                  className={cn(
                    'w-full h-8 text-[11px] font-heading font-bold rounded-lg transition-all',
                    'bg-[#0F3D91] hover:bg-[#0F3D91]/90 text-white shadow-sm'
                  )}
                >
                  View Details
                </Button>
              </div>
            )}
          </div>
          {isList && (
            <div className="pr-4 py-4 self-center hidden sm:block">
              <Button
                onClick={handleDetailsClick}
                className="h-9 px-6 text-[12px] font-heading font-bold rounded-xl bg-[#0F3D91] hover:bg-[#0F3D91]/90 text-white shadow-sm"
              >
                View Details
              </Button>
            </div>
          )}
        </div>
      </div>
      <AuthGateDialog
        isOpen={showAuthGate}
        onClose={() => setShowAuthGate(false)}
        type="house"
      />
    </>
  );
}

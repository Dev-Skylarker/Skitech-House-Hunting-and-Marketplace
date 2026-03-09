import { useState } from 'react';
import { Heart, Eye, Tag, MoreHorizontal, Edit, CheckCircle, EyeOff, Trash2, Share2, Flag, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { AuthGateDialog } from '@/components/auth/AuthGateDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { MarketplaceItem } from '@/types';
import { cn } from '@/lib/utils';

interface Props {
  item: MarketplaceItem;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
  size?: 'sm' | 'base';
  layout?: 'grid' | 'list';
  showDetails?: boolean;
  onEdit?: (item: MarketplaceItem) => void;
  onMarkSold?: (id: string) => void;
  onHide?: (id: string) => void;
  onDelete?: (id: string) => void;
  onShare?: (item: MarketplaceItem) => void;
  onReport?: (item: MarketplaceItem) => void;
  onContact?: (item: MarketplaceItem) => void;
}

const conditionColors: Record<string, string> = {
  new: 'bg-secondary text-secondary-foreground',
  'like-new': 'bg-[#0F3D91] text-white',
  used: 'bg-muted text-muted-foreground',
};

export function ItemCard({ 
  item, 
  isFavorite, 
  onToggleFavorite, 
  size = 'sm', 
  layout = 'grid', 
  showDetails = true,
  onEdit,
  onMarkSold,
  onHide,
  onDelete,
  onShare,
  onReport,
  onContact
}: Props) {
  const isBase = size === 'base';
  const isList = layout === 'list';
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [showAuthGate, setShowAuthGate] = useState(false);

  const handleDetailsClick = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();

    if (isAuthenticated) {
      navigate(`/marketplace/${item.id}`);
    } else {
      setShowAuthGate(true);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit?.(item);
  };

  const handleMarkSold = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onMarkSold?.(item.id);
  };

  const handleHide = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onHide?.(item.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete?.(item.id);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onShare?.(item);
  };

  const handleReport = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onReport?.(item);
  };

  const handleContact = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onContact?.(item);
  };

  // Check if user is seller or admin
  const isSeller = user?.email === item.sellerName.toLowerCase().replace(' ', '.');
  const isAdmin = user?.role === 'admin';
  const canManage = isSeller || isAdmin;

  return (
    <>
      <div
        onClick={showDetails ? handleDetailsClick : undefined}
        className={cn("block group h-full", showDetails ? "cursor-pointer" : "cursor-default", isList ? "w-full" : "")}
      >
        <div className={cn(
          "bg-card rounded-xl border border-border/60 overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full flex",
          isList ? "flex-row gap-4" : "flex-col"
        )}>
          <div className={cn("relative overflow-hidden shrink-0", isList ? "w-32 sm:w-48 aspect-square" : "aspect-video")}>
            <img
              src={item.images[0]}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            <Badge
              className={cn(
                'absolute top-2 left-2 px-1.5 py-0.5 rounded-full shadow-sm border-transparent',
                conditionColors[item.condition],
                isBase ? 'text-[10px]' : 'text-[9px]'
              )}
            >
              {item.condition === 'like-new' ? 'Like New' : item.condition.charAt(0).toUpperCase() + item.condition.slice(1)}
            </Badge>
            {onToggleFavorite && (
              <button
                onClick={(e) => { e.preventDefault(); onToggleFavorite(item.id); }}
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
            <div className="absolute top-2 right-12 flex gap-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    className="p-1.5 rounded-full bg-black/55 text-white backdrop-blur-sm hover:bg-black/70 transition-colors shadow-sm"
                  >
                    <MoreHorizontal className={cn(isBase ? 'w-4.5 h-4.5' : 'w-4 h-4')} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {canManage && (
                    <>
                      <DropdownMenuItem onClick={handleEdit}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Item
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleMarkSold}>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Mark as Sold
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleHide}>
                        <EyeOff className="mr-2 h-4 w-4" />
                        Hide Item
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem onClick={handleShare}>
                    <Share2 className="mr-2 h-4 w-4" />
                    Share Item
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleContact}>
                    <Phone className="mr-2 h-4 w-4" />
                    Contact Seller
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleReport} className="text-red-600">
                    <Flag className="mr-2 h-4 w-4" />
                    Report Item
                  </DropdownMenuItem>
                  {canManage && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Item
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className={cn(isBase ? 'px-3 py-3' : 'px-2.5 py-2.5', 'flex-1 flex flex-col min-w-0')}>
            <div className="flex items-start justify-between gap-1.5 border-none">
              <h3 className={cn('font-heading font-semibold text-card-foreground line-clamp-1 leading-snug', isBase ? 'text-[14px]' : 'text-[13px]')}>
                {item.title}
              </h3>
            </div>
            <div className="flex items-center gap-1 mt-1 text-muted-foreground">
              <Tag className={isBase ? 'w-3.5 h-3.5' : 'w-3 h-3'} />
              <span className={cn('capitalize', isBase ? 'text-[12px]' : 'text-[11px]')}>{item.category}</span>
            </div>

            <div className={cn("flex items-center justify-between mt-auto pt-2", isList ? "" : "")}>
              <span className={cn('font-heading font-semibold text-[#0F3D91]', isBase ? 'text-[15px]' : 'text-[14px]')}>
                KSh {item.price.toLocaleString()}
              </span>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Eye className={isBase ? 'w-3.5 h-3.5' : 'w-3 h-3'} />
                <span className={cn(isBase ? 'text-[12px]' : 'text-[11px]')}>{item.views}</span>
              </div>
            </div>

            {isList && (
              <div className="mt-2 text-[11px] text-muted-foreground line-clamp-2 md:line-clamp-none">
                {item.description}
              </div>
            )}

            {!isList && showDetails && (
              <div className="pt-2.5">
                <Button
                  onClick={handleDetailsClick}
                  className={cn(
                    'w-full h-8 text-[11px] font-heading font-bold rounded-xl transition-all',
                    'bg-[#0F3D91] hover:bg-[#FF7A00] text-white shadow-sm'
                  )}
                >
                  View Details
                </Button>
              </div>
            )}
          </div>
          {isList && showDetails && (
            <div className="pr-4 py-4 self-center hidden sm:block">
              <Button
                onClick={handleDetailsClick}
                className="h-9 px-6 text-[12px] font-heading font-bold rounded-xl bg-[#0F3D91] hover:bg-[#FF7A00] text-white shadow-sm transition-all"
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
        type="item"
      />
    </>
  );
}

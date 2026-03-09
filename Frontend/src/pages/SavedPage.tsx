import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Building2, ArrowRight, Heart, Trash2, CheckSquare, Square, ShoppingBag, Lock, Eye } from 'lucide-react';
import { HouseCard } from '@/components/HouseCard';
import { ItemCard } from '@/components/ItemCard';
import { Button } from '@/components/ui/button';
import { useFavorites } from '@/hooks/useFavorites';
import { useAuth } from '@/contexts/AuthContext';
import { mockHouses, mockItems } from '@/services/api';
import type { House, MarketplaceItem } from '@/types';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

import { BackButton } from '../components/ui/BackButton';

export default function WishlistPage() {
  const navigate = useNavigate();
  const { favoriteHouses, favoriteItems, toggleFavoriteHouse, toggleFavoriteItem } = useFavorites();
  const { isAuthenticated, user } = useAuth();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState('all');

  const savedHouses = mockHouses.filter(h => favoriteHouses.includes(h.id));
  const savedItems = mockItems.filter(i => favoriteItems.includes(i.id));
  const totalSaved = savedHouses.length + savedItems.length;

  const currentList = useMemo(() => {
    if (activeTab === 'houses') return savedHouses;
    if (activeTab === 'items') return savedItems;
    return [...savedHouses, ...savedItems];
  }, [activeTab, savedHouses, savedItems]);

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) newSelected.delete(id);
    else newSelected.add(id);
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === currentList.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(currentList.map(item => item.id)));
    }
  };

  const removeSelected = () => {
    if (!isAuthenticated) {
      navigate('/account');
      return;
    }
    selectedIds.forEach(id => {
      if (favoriteHouses.includes(id)) toggleFavoriteHouse(id);
      if (favoriteItems.includes(id)) toggleFavoriteItem(id);
    });
    setSelectedIds(new Set());
  };

  return (
    <div className="px-4 py-6 bg-[#F7F9FC] min-h-screen">
      <div className="flex items-center gap-3 mb-6">
        <BackButton />
        <h1 className="font-heading font-bold text-2xl">Wishlist</h1>
      </div>
      <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); setSelectedIds(new Set()); }}>
        <div className="flex items-center justify-between gap-2 mb-4">
          <TabsList className="bg-muted/50 p-1 h-11 flex-1">
            <TabsTrigger value="all" className="flex-1 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#FF7A00]">All ({totalSaved})</TabsTrigger>
            <TabsTrigger value="houses" className="flex-1 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#FF7A00]">Houses ({savedHouses.length})</TabsTrigger>
            <TabsTrigger value="items" className="flex-1 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#FF7A00]">Items ({savedItems.length})</TabsTrigger>
          </TabsList>

          {totalSaved > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSelectAll}
              className="text-xs font-bold text-[#0F3D91] gap-2 h-11 px-4 rounded-xl bg-white shadow-sm border border-slate-100"
            >
              {selectedIds.size === currentList.length && currentList.length > 0 ? (
                <CheckSquare className="w-4 h-4 text-[#FF7A00]" />
              ) : (
                <Square className="w-4 h-4" />
              )}
              {selectedIds.size === currentList.length && currentList.length > 0 ? 'Deselect' : 'Select All'}
            </Button>
          )}
        </div>

        {!isAuthenticated && totalSaved > 0 && (
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl mb-6 flex items-center gap-3">
            <Lock className="w-5 h-5 text-amber-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-900">Sign in to manage your wishlist</p>
              <p className="text-xs text-amber-700 mt-1">Login to view details and remove items from your wishlist</p>
            </div>
            <Button
              onClick={() => navigate('/account')}
              className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl h-9 px-4 font-medium text-sm"
            >
              Sign In
            </Button>
          </div>
        )}

        {selectedIds.size > 0 && isAuthenticated && (
          <div className="bg-[#0F3D91] text-white p-3 rounded-2xl mb-6 flex items-center justify-between shadow-lg shadow-blue-900/10 animate-in slide-in-from-top-2">
            <div className="flex items-center gap-3 ml-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm">
                {selectedIds.size}
              </div>
              <span className="font-heading font-bold text-sm tracking-tight">Items selected</span>
            </div>
            <Button
              onClick={removeSelected}
              className="bg-[#FF7A00] hover:bg-[#FF8A00] text-white rounded-xl h-10 px-6 font-bold gap-2 text-xs"
            >
              <Trash2 className="w-4 h-4" />
              Remove from Wishlist
            </Button>
          </div>
        )}

        <TabsContent value="all" className="mt-6">
          {totalSaved > 0 ? (
            <div className="space-y-8 pb-10">
              {savedHouses.length > 0 && (
                <div>
                  <h2 className="font-heading font-bold text-lg mb-4 flex items-center gap-2">
                    <div className="w-1.5 h-6 bg-[#0F3D91] rounded-full" />
                    Saved Houses
                  </h2>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                    {savedHouses.map(h => (
                      <div key={h.id} className="relative group">
                        {isAuthenticated && (
                          <div className="absolute top-3 left-3 z-10">
                            <Checkbox
                              checked={selectedIds.has(h.id)}
                              onCheckedChange={() => toggleSelect(h.id)}
                              className="w-5 h-5 rounded-md border-white/50 bg-white/20 backdrop-blur-md data-[state=checked]:bg-[#FF7A00] data-[state=checked]:border-[#FF7A00]"
                            />
                          </div>
                        )}
                        <div className={cn(!isAuthenticated && "relative")}>
                          <HouseCard
                            house={h}
                            isFavorite
                            onToggleFavorite={isAuthenticated ? toggleFavoriteHouse : undefined}
                            size="base"
                            showDetails={isAuthenticated}
                          />
                          {!isAuthenticated && (
                            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                              <div className="bg-white/95 rounded-xl p-3 flex items-center gap-2 shadow-lg">
                                <Eye className="w-4 h-4 text-amber-600" />
                                <span className="text-xs font-medium text-amber-900">Sign in to view</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {savedItems.length > 0 && (
                <div>
                  <h2 className="font-heading font-bold text-lg mb-4 flex items-center gap-2 pt-4">
                    <div className="w-1.5 h-6 bg-[#FF7A00] rounded-full" />
                    Marketplace Items
                  </h2>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                    {savedItems.map(i => (
                      <div key={i.id} className="relative group">
                        {isAuthenticated && (
                          <div className="absolute top-3 left-3 z-10">
                            <Checkbox
                              checked={selectedIds.has(i.id)}
                              onCheckedChange={() => toggleSelect(i.id)}
                              className="w-5 h-5 rounded-md border-white/50 bg-white/20 backdrop-blur-md data-[state=checked]:bg-[#FF7A00] data-[state=checked]:border-[#FF7A00]"
                            />
                          </div>
                        )}
                        <div className={cn(!isAuthenticated && "relative")}>
                          <ItemCard
                            item={i}
                            isFavorite
                            onToggleFavorite={isAuthenticated ? toggleFavoriteItem : undefined}
                            size="base"
                            showDetails={isAuthenticated}
                          />
                          {!isAuthenticated && (
                            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                              <div className="bg-white/95 rounded-xl p-3 flex items-center gap-2 shadow-lg">
                                <Eye className="w-4 h-4 text-amber-600" />
                                <span className="text-xs font-medium text-amber-900">Sign in to view</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <EmptyWishlistState type="all" />
          )}
        </TabsContent>
        <TabsContent value="houses" className="mt-2">
          {savedHouses.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              {savedHouses.map(h => (
                <div key={h.id} className="relative group">
                  {isAuthenticated && (
                    <div className="absolute top-3 left-3 z-10">
                      <Checkbox
                        checked={selectedIds.has(h.id)}
                        onCheckedChange={() => toggleSelect(h.id)}
                        className="w-5 h-5 rounded-md border-white/50 bg-white/20 backdrop-blur-md data-[state=checked]:bg-[#FF7A00] data-[state=checked]:border-[#FF7A00]"
                      />
                    </div>
                  )}
                  <div className={cn(!isAuthenticated && "relative")}>
                    <HouseCard
                      house={h}
                      isFavorite
                      onToggleFavorite={isAuthenticated ? toggleFavoriteHouse : undefined}
                      size="base"
                      showDetails={isAuthenticated}
                    />
                    {!isAuthenticated && (
                      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                        <div className="bg-white/95 rounded-xl p-3 flex items-center gap-2 shadow-lg">
                          <Eye className="w-4 h-4 text-amber-600" />
                          <span className="text-xs font-medium text-amber-900">Sign in to view</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyWishlistState type="houses" />
          )}
        </TabsContent>
        <TabsContent value="items" className="mt-2">
          {savedItems.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              {savedItems.map(i => (
                <div key={i.id} className="relative group">
                  {isAuthenticated && (
                    <div className="absolute top-3 left-3 z-10">
                      <Checkbox
                        checked={selectedIds.has(i.id)}
                        onCheckedChange={() => toggleSelect(i.id)}
                        className="w-5 h-5 rounded-md border-white/50 bg-white/20 backdrop-blur-md data-[state=checked]:bg-[#FF7A00] data-[state=checked]:border-[#FF7A00]"
                      />
                    </div>
                  )}
                  <div className={cn(!isAuthenticated && "relative")}>
                    <ItemCard
                      item={i}
                      isFavorite
                      onToggleFavorite={isAuthenticated ? toggleFavoriteItem : undefined}
                      size="base"
                      showDetails={isAuthenticated}
                    />
                    {!isAuthenticated && (
                      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                        <div className="bg-white/95 rounded-xl p-3 flex items-center gap-2 shadow-lg">
                          <Eye className="w-4 h-4 text-amber-600" />
                          <span className="text-xs font-medium text-amber-900">Sign in to view</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyWishlistState type="items" />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function EmptyWishlistState({ type }: { type: 'all' | 'houses' | 'items' }) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
        <Heart className="w-10 h-10 text-slate-300" />
      </div>
      <h3 className="font-heading font-bold text-xl text-slate-900 mb-2">Your wishlist is empty</h3>
      <p className="text-slate-500 mb-8 max-w-[280px]">
        Tap the heart icon on any listing to save it for later.
      </p>
      <div className="flex flex-col w-full gap-3 max-w-xs">
        {(type === 'all' || type === 'houses') && (
          <Button
            onClick={() => navigate('/houses')}
            className="h-12 bg-[#0F3D91] hover:bg-[#FF7A00] text-white rounded-xl font-heading font-bold shadow-lg shadow-blue-900/10 hover:shadow-[#FF7A00]/20 transition-all duration-300"
          >
            <Building2 className="w-4 h-4 mr-2" />
            Browse Houses
          </Button>
        )}
        {(type === 'all' || type === 'items') && (
          <Button
            onClick={() => navigate('/marketplace')}
            variant="outline"
            className="h-12 rounded-xl border-slate-200 font-heading font-bold"
          >
            <ArrowRight className="w-4 h-4 mr-2" />
            Browse Marketplace
          </Button>
        )}
      </div>
    </div>
  );
}

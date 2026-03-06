import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HouseCard } from '@/components/HouseCard';
import { ItemCard } from '@/components/ItemCard';
import { useFavorites } from '@/hooks/useFavorites';
import { mockHouses, mockItems } from '@/services/api';
import type { House, MarketplaceItem } from '@/types';

export default function SavedPage() {
  const { favoriteHouses, favoriteItems, toggleFavoriteHouse, toggleFavoriteItem } = useFavorites();
  const savedHouses = mockHouses.filter(h => favoriteHouses.includes(h.id));
  const savedItems = mockItems.filter(i => favoriteItems.includes(i.id));

  return (
    <div className="px-4 py-4">
      <h1 className="font-heading font-bold text-xl mb-4">Saved</h1>
      <Tabs defaultValue="houses">
        <TabsList className="w-full">
          <TabsTrigger value="houses" className="flex-1">Houses ({savedHouses.length})</TabsTrigger>
          <TabsTrigger value="items" className="flex-1">Items ({savedItems.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="houses" className="mt-4">
          {savedHouses.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {savedHouses.map(h => (
                <HouseCard key={h.id} house={h} isFavorite onToggleFavorite={toggleFavoriteHouse} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p className="font-heading font-semibold">No saved houses</p>
              <p className="text-sm mt-1">Tap the heart icon to save houses</p>
            </div>
          )}
        </TabsContent>
        <TabsContent value="items" className="mt-4">
          {savedItems.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {savedItems.map(i => (
                <ItemCard key={i.id} item={i} isFavorite onToggleFavorite={toggleFavoriteItem} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p className="font-heading font-semibold">No saved items</p>
              <p className="text-sm mt-1">Tap the heart icon to save items</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

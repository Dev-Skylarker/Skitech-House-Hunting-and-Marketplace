import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Building2, ChevronRight, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { HouseCard } from '@/components/HouseCard';
import { ItemCard } from '@/components/ItemCard';
import { useFavorites } from '@/hooks/useFavorites';
import { api } from '@/services/api';
import type { House, MarketplaceItem } from '@/types';

const categories = [
  { label: 'Bedsitter', value: 'bedsitter', icon: '🏠' },
  { label: 'Single', value: 'single', icon: '🚪' },
  { label: '1 Bedroom', value: '1br', icon: '🛏️' },
  { label: '2 Bedroom', value: '2br', icon: '🏢' },
];

const Index = () => {
  const [houses, setHouses] = useState<House[]>([]);
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [search, setSearch] = useState('');
  const { favoriteHouses, favoriteItems, toggleFavoriteHouse, toggleFavoriteItem } = useFavorites();

  useEffect(() => {
    api.getHouses().then(setHouses);
    api.getItems().then(setItems);
  }, []);

  return (
    <div className="space-y-6">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary to-secondary px-4 pt-8 pb-10 -mt-[1px]">
        <h1 className="font-heading font-bold text-2xl text-primary-foreground leading-tight">
          Find your perfect<br />student home near <span className="text-accent">UoEM</span>
        </h1>
        <p className="text-primary-foreground/80 text-sm mt-2">Browse verified houses and marketplace items</p>
        <div className="mt-4 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search houses, locations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-card border-0 shadow-md"
          />
        </div>
      </section>

      {/* Categories */}
      <section className="px-4">
        <h2 className="font-heading font-semibold text-lg mb-3">Browse by Type</h2>
        <div className="grid grid-cols-4 gap-2">
          {categories.map(cat => (
            <Link
              key={cat.value}
              to={`/houses?type=${cat.value}`}
              className="flex flex-col items-center gap-1.5 p-3 bg-card rounded-lg border border-border hover:border-primary/30 transition-colors"
            >
              <span className="text-2xl">{cat.icon}</span>
              <span className="text-xs font-medium text-card-foreground">{cat.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Houses */}
      <section className="px-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-heading font-semibold text-lg">Featured Houses</h2>
          <Link to="/houses" className="text-sm text-primary flex items-center gap-0.5">
            View all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory">
          {houses.slice(0, 4).map(house => (
            <div key={house.id} className="min-w-[260px] snap-start">
              <HouseCard house={house} isFavorite={favoriteHouses.includes(house.id)} onToggleFavorite={toggleFavoriteHouse} />
            </div>
          ))}
        </div>
      </section>

      {/* Marketplace Highlights */}
      <section className="px-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-heading font-semibold text-lg">Marketplace</h2>
          <Link to="/marketplace" className="text-sm text-primary flex items-center gap-0.5">
            View all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {items.slice(0, 4).map(item => (
            <ItemCard key={item.id} item={item} isFavorite={favoriteItems.includes(item.id)} onToggleFavorite={toggleFavoriteItem} />
          ))}
        </div>
      </section>

      {/* PWA Install CTA */}
      <section className="px-4 pb-4">
        <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-4 flex items-center gap-3">
          <div className="p-2 bg-primary-foreground/20 rounded-lg">
            <Download className="w-6 h-6 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <h3 className="font-heading font-semibold text-sm text-primary-foreground">Install Skitech App</h3>
            <p className="text-xs text-primary-foreground/80">Get quick access on your phone</p>
          </div>
          <Button size="sm" variant="secondary" className="shrink-0">
            Install
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;

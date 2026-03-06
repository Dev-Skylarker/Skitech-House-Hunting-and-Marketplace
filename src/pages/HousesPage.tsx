import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, LayoutGrid, List } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HouseCard } from '@/components/HouseCard';
import { useFavorites } from '@/hooks/useFavorites';
import { api } from '@/services/api';
import type { House } from '@/types';

export default function HousesPage() {
  const [searchParams] = useSearchParams();
  const [houses, setHouses] = useState<House[]>([]);
  const [search, setSearch] = useState('');
  const [type, setType] = useState(searchParams.get('type') || 'all');
  const [sort, setSort] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { favoriteHouses, toggleFavoriteHouse } = useFavorites();

  useEffect(() => {
    api.getHouses({ type: type !== 'all' ? type : undefined, search: search || undefined }).then(results => {
      const sorted = [...results];
      if (sort === 'price-low') sorted.sort((a, b) => a.price - b.price);
      else if (sort === 'price-high') sorted.sort((a, b) => b.price - a.price);
      else if (sort === 'distance') sorted.sort((a, b) => a.distance - b.distance);
      else sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setHouses(sorted);
    });
  }, [search, type, sort]);

  return (
    <div className="px-4 py-4 space-y-4">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search houses..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
        </div>
        <Button variant="outline" size="icon" onClick={() => setShowFilters(!showFilters)}>
          <SlidersHorizontal className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={() => setViewMode(v => v === 'grid' ? 'list' : 'grid')}>
          {viewMode === 'grid' ? <List className="w-4 h-4" /> : <LayoutGrid className="w-4 h-4" />}
        </Button>
      </div>

      {showFilters && (
        <div className="flex gap-2 flex-wrap">
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="w-[140px]"><SelectValue placeholder="House type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="bedsitter">Bedsitter</SelectItem>
              <SelectItem value="single">Single</SelectItem>
              <SelectItem value="1br">1 Bedroom</SelectItem>
              <SelectItem value="2br">2 Bedroom</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-[140px]"><SelectValue placeholder="Sort by" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price-low">Price: Low</SelectItem>
              <SelectItem value="price-high">Price: High</SelectItem>
              <SelectItem value="distance">Distance</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div className={viewMode === 'grid' ? 'grid grid-cols-2 gap-3' : 'space-y-3'}>
        {houses.map(house => (
          <HouseCard key={house.id} house={house} isFavorite={favoriteHouses.includes(house.id)} onToggleFavorite={toggleFavoriteHouse} />
        ))}
      </div>

      {houses.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p className="font-heading font-semibold">No houses found</p>
          <p className="text-sm mt-1">Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
}

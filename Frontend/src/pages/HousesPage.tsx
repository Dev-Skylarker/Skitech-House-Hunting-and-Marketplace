import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, SlidersHorizontal, LayoutGrid, List } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HouseCard } from '@/components/HouseCard';
import { useFavorites } from '@/hooks/useFavorites';
import { apiService } from '@/services/apiService';
import type { House } from '@/types';
import { cn } from '@/lib/utils';

export default function HousesPage() {
  const [searchParams] = useSearchParams();
  const [houses, setHouses] = useState<House[]>([]);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [type, setType] = useState(searchParams.get('type') || 'all');
  const [sort, setSort] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [placeholderText, setPlaceholderText] = useState('Search houses...');
  const { favoriteHouses, toggleFavoriteHouse } = useFavorites();

  useEffect(() => {
    const phrases = [
      'Search houses...',
      'Bedsitter in Kangaru',
      '1 Bedroom near Main Gate',
      'Apartments under 10k',
    ];
    let charIndex = 0;
    let timeoutId: any;
    const type = () => {
      const p = phrases[placeholderIndex];
      setPlaceholderText(p.slice(0, charIndex));
      if (charIndex < p.length) {
        charIndex++;
        timeoutId = setTimeout(type, 100);
      } else {
        timeoutId = setTimeout(() => {
          setPlaceholderIndex((v) => (v + 1) % phrases.length);
        }, 1500);
      }
    };
    type();
    return () => clearTimeout(timeoutId);
  }, [placeholderIndex]);

  useEffect(() => {
    apiService.houses.getHouses({ type: type !== 'all' ? type : undefined, location: search || undefined }).then(response => {
      if (response.success) {
        const sorted = [...response.listings];
        if (sort === 'price-low') sorted.sort((a, b) => a.price - b.price);
        else if (sort === 'price-high') sorted.sort((a, b) => b.price - a.price);
        else if (sort === 'distance') sorted.sort((a, b) => a.distance - b.distance);
        else sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setHouses(sorted);
      }
    });
  }, [search, type, sort]);

  return (
    <div className="px-4 py-4 space-y-4 bg-[#F7F9FC] min-h-[calc(100vh-4rem)] max-w-[1200px] mx-auto w-full">
      <div className="sticky top-2 z-40 flex flex-col gap-3">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={placeholderText}
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  // Search is already reactive, but this ensures a 'submit' feel
                }
              }}
              className="pl-10 pr-20 h-11 text-sm rounded-full shadow-md border-0 bg-white"
            />
            <button
              onClick={() => { }}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-7 px-3 rounded-full bg-[#FF7A00] text-white flex items-center justify-center text-[10px] font-medium"
            >
              SEARCH
            </button>
          </div>
          <div className="flex gap-1.5">
            <Button
              variant="outline"
              size="icon"
              className={cn(
                "h-11 w-11 rounded-full bg-white shadow-sm border border-slate-100 transition-all duration-300",
                showFilters ? "bg-[#0F3D91] text-white shadow-[#0F3D91]/20 scale-105" : "text-slate-600 hover:bg-slate-50"
              )}
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="w-4 h-4 shadow-sm" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={cn(
                "h-11 w-11 rounded-full bg-white shadow-sm border border-slate-100 transition-all duration-300",
                viewMode === 'list' ? "bg-[#0F3D91] text-white shadow-[#0F3D91]/20 scale-105" : "text-slate-600 hover:bg-slate-50"
              )}
              onClick={() => setViewMode(v => (v === 'grid' ? 'list' : 'grid'))}
            >
              {viewMode === 'grid' ? <List className="w-4 h-4" /> : <LayoutGrid className="w-4 h-4" />}
            </Button>
          </div>
        </div>
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

      <div className={cn(
        viewMode === 'grid'
          ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3'
          : 'flex flex-col gap-4 max-w-4xl mx-auto w-full'
      )}>
        {houses.map(house => (
          <HouseCard
            key={house.id}
            house={house}
            isFavorite={favoriteHouses.includes(house.id)}
            onToggleFavorite={toggleFavoriteHouse}
            size="base"
            layout={viewMode}
          />
        ))}
      </div>

      {houses.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p className="font-heading font-semibold">No houses found</p>
          <p className="text-sm mt-1">Try adjusting your filters</p>
        </div>
      )}

      {/* Inquiry Section */}
      <section className="pt-8 pb-12">
        <div className="block bg-white border border-slate-100 p-8 rounded-[40px] shadow-sm relative overflow-hidden group hover:shadow-md transition-all active:scale-[0.98]">
          <div className="absolute top-0 right-0 w-40 h-40 bg-[#0F3D91]/5 rounded-full -mr-20 -mt-20 blur-3xl group-hover:scale-110 transition-transform" />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10 text-center sm:text-left">
            <div className="space-y-2">
              <h3 className="font-heading font-semibold text-[#0F3D91] text-xl leading-tight">
                Did you miss your <span className="text-[#FF7A00]">desired home?</span>
              </h3>
              <p className="text-slate-500 text-sm font-medium">
                Tell us a house? Let us know the one you need.
              </p>
            </div>
            <Link to="/inquiry?tab=houses">
              <Button className="h-12 px-8 rounded-2xl bg-[#0F3D91] hover:bg-[#FF7A00] text-white font-semibold uppercase tracking-widest transition-all shadow-lg shadow-blue-900/10">
                Request House
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

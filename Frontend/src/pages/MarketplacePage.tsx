import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, List, LayoutGrid } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ItemCard } from '@/components/ItemCard';
import { useFavorites } from '@/hooks/useFavorites';
import { apiService } from '@/services/apiService';
import type { MarketplaceItem } from '@/types';
import { cn } from '@/lib/utils';

const categories = ['all', 'furniture', 'electronics', 'books', 'appliances', 'other'];

export default function MarketplacePage() {
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState('all');
  const [condition, setCondition] = useState('all');
  const [sort, setSort] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [placeholderText, setPlaceholderText] = useState('Search items...');
  const { favoriteItems, toggleFavoriteItem } = useFavorites();

  useEffect(() => {
    const phrases = [
      'Search items...',
      'Study desk',
      'Electric kettle',
      'Textbooks',
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
    apiService.marketplace.getItems({
      category: category !== 'all' ? category : undefined,
      condition: condition !== 'all' ? condition : undefined,
      search: search || undefined,
    }).then(response => {
      if (response.success) {
        setItems(response.items);
      }
    });
  }, [search, category, condition]);

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
          <div className="flex gap-1.5 h-11 shrink-0">
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

      <Tabs value={category} onValueChange={setCategory}>
        <TabsList className="w-full overflow-x-auto flex justify-start h-auto p-1">
          {categories.map(c => (
            <TabsTrigger key={c} value={c} className="text-xs capitalize shrink-0">
              {c === 'all' ? 'All' : c}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {showFilters && (
        <Select value={condition} onValueChange={setCondition}>
          <SelectTrigger className="w-[140px] bg-white border-0 shadow-sm rounded-xl h-10"><SelectValue placeholder="Condition" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Conditions</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="like-new">Like New</SelectItem>
            <SelectItem value="used">Used</SelectItem>
          </SelectContent>
        </Select>
      )}

      <div className={cn(
        viewMode === 'grid'
          ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3'
          : 'flex flex-col gap-4 max-w-4xl mx-auto w-full'
      )}>
        {items.map(item => (
          <ItemCard
            key={item.id}
            item={item}
            isFavorite={favoriteItems.includes(item.id)}
            onToggleFavorite={toggleFavoriteItem}
            size="base"
            layout={viewMode}
          />
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p className="font-heading font-semibold">No items found</p>
          <p className="text-sm mt-1">Try adjusting your filters</p>
        </div>
      )}


    </div>
  );
}

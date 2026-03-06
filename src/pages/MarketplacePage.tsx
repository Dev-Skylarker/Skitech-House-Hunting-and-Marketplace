import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ItemCard } from '@/components/ItemCard';
import { useFavorites } from '@/hooks/useFavorites';
import { api } from '@/services/api';
import type { MarketplaceItem } from '@/types';

const categories = ['all', 'furniture', 'electronics', 'books', 'appliances', 'other'];

export default function MarketplacePage() {
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [condition, setCondition] = useState('all');
  const { favoriteItems, toggleFavoriteItem } = useFavorites();

  useEffect(() => {
    api.getItems({
      category: category !== 'all' ? category : undefined,
      condition: condition !== 'all' ? condition : undefined,
      search: search || undefined,
    }).then(setItems);
  }, [search, category, condition]);

  return (
    <div className="px-4 py-4 space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search items..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
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

      <Select value={condition} onValueChange={setCondition}>
        <SelectTrigger className="w-[140px]"><SelectValue placeholder="Condition" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Conditions</SelectItem>
          <SelectItem value="new">New</SelectItem>
          <SelectItem value="like-new">Like New</SelectItem>
          <SelectItem value="used">Used</SelectItem>
        </SelectContent>
      </Select>

      <div className="grid grid-cols-2 gap-3">
        {items.map(item => (
          <ItemCard key={item.id} item={item} isFavorite={favoriteItems.includes(item.id)} onToggleFavorite={toggleFavoriteItem} />
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

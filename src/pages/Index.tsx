import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Building2, ChevronRight, Download, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { HouseCard } from '@/components/HouseCard';
import { ItemCard } from '@/components/ItemCard';
import { useFavorites } from '@/hooks/useFavorites';
import { api } from '@/services/api';
import { MarketingSlideshow } from '@/components/MarketingSlideshow';
import type { House, MarketplaceItem } from '@/types';

const categories = [
  { label: 'All', value: 'all', icon: '🏘️' },
  { label: 'Bedsitter', value: 'bedsitter', icon: '🏠' },
  { label: 'Single', value: 'single', icon: '🚪' },
  { label: '1 Bedroom', value: '1br', icon: '🛏️' },
  { label: '2 Bedroom', value: '2br', icon: '🏢' },
];

const Index = () => {
  const navigate = useNavigate();
  const [houses, setHouses] = useState<House[]>([]);
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState<{ houses: House[]; items: MarketplaceItem[] } | null>(null);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [placeholderText, setPlaceholderText] = useState('Looking for a house?');
  const [heroIndex, setHeroIndex] = useState(0);
  const [heroTitle, setHeroTitle] = useState('Find your perfect home near Embu');
  const [showInstallBanner, setShowInstallBanner] = useState(() => {
    if (typeof window === 'undefined') return true;
    return !window.localStorage.getItem('pwa-installed');
  });
  const { favoriteHouses, favoriteItems, toggleFavoriteHouse, toggleFavoriteItem } = useFavorites();

  useEffect(() => {
    api.getHouses().then(setHouses);
    api.getItems().then(setItems);
  }, []);

  useEffect(() => {
    const placeholderPhrases = [
      'Looking for a bedsitter?',
      'Search for 1 Bedroom...',
      'Find a Study Desk...',
      'Search for Electronics...',
    ];

    const typingInterval = 120;
    const holdDuration = 1500;

    let charIndex = 0;
    let timeoutId: number;

    const typePlaceholder = () => {
      const phrase = placeholderPhrases[placeholderIndex];
      if (charIndex <= phrase.length) {
        setPlaceholderText(phrase.slice(0, charIndex));
        charIndex += 1;
        timeoutId = window.setTimeout(typePlaceholder, typingInterval);
      } else {
        timeoutId = window.setTimeout(() => {
          setPlaceholderIndex((prev) => (prev + 1) % placeholderPhrases.length);
        }, holdDuration);
      }
    };

    typePlaceholder();

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [placeholderIndex]);

  // Typing effect for HERO TITLE
  useEffect(() => {
    const heroPhrases = [
      'Find your perfect student home near Embu',
      'Connect with local buyer/sellers, around Embu',
    ];

    const typingInterval = 60;
    const holdDuration = 2500;

    let charIndex = 0;
    let timeoutId: number;

    const typeHero = () => {
      const phrase = heroPhrases[heroIndex];
      if (charIndex <= phrase.length) {
        setHeroTitle(phrase.slice(0, charIndex));
        charIndex += 1;
        timeoutId = window.setTimeout(typeHero, typingInterval);
      } else {
        timeoutId = window.setTimeout(() => {
          setHeroIndex((prev) => (prev + 1) % heroPhrases.length);
        }, holdDuration);
      }
    };

    typeHero();

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [heroIndex]);

  const performSearch = (value: string) => {
    const q = value.trim().toLowerCase();
    if (!q) {
      setSearchResults(null);
      return;
    }

    // Comprehensive indexing for houses (title, description, type, location, amenities)
    const matchingHouses = houses.filter(h =>
      h.title.toLowerCase().includes(q) ||
      h.description.toLowerCase().includes(q) ||
      h.houseType?.toLowerCase().includes(q) ||
      h.location.toLowerCase().includes(q) ||
      (h.amenities && h.amenities.some(a => a.toLowerCase().includes(q)))
    );

    // Comprehensive indexing for marketplace items (title, description, category, condition)
    const matchingItems = items.filter(i =>
      i.title.toLowerCase().includes(q) ||
      i.description.toLowerCase().includes(q) ||
      i.category.toLowerCase().includes(q) ||
      i.condition?.toLowerCase().includes(q)
    );

    setSearchResults({ houses: matchingHouses, items: matchingItems });
  };

  const handleSearchSubmit = (value: string) => {
    const q = value.trim();
    if (!q) return;
    performSearch(q);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    if (value.trim()) {
      performSearch(value);
    } else {
      setSearchResults(null);
    }
  };

  const houseSlides = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&q=80&w=1200',
      title: 'Find Your Perfect Home Near Embu',
      subtitle: 'Browse hundreds of verified listings tailored for residents.'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200',
      title: 'Verified Landlords & Secure Bookings',
      subtitle: 'Peace of mind with our vetted property owners and secure processes.'
    }
  ];

  const marketplaceSlides = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&q=80&w=1200',
      title: 'Discover The Best Deals in Embu',
      subtitle: 'Everything you need at unbeatable prices.'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=1200',
      title: 'Sell Your Unused Items Instantly',
      subtitle: 'Turn your old gear into cash by selling to the local community.'
    }
  ];

  // Show search results view
  if (searchResults !== null && search.trim()) {
    const totalResults = searchResults.houses.length + searchResults.items.length;

    return (
      <div className="space-y-6 bg-[#F7F9FC] pb-4 px-2 sm:px-4">
        <section className="bg-gradient-to-br from-[#0F3D91] via-[#0A2560] to-[#0D47A1] rounded-[48px] px-8 pt-12 pb-8 mt-2 relative overflow-hidden shadow-2xl shadow-blue-900/10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#00B4D8]/10 rounded-full -mr-32 -mt-32 blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#FF7A00]/5 rounded-full -ml-24 -mb-24 blur-[80px]" />
          <h1 className="font-heading font-medium text-3xl sm:text-4xl text-white leading-[1.1] relative z-10 min-h-[80px]">
            {heroTitle}
            <span className="w-[3px] h-7 bg-[#FF7A00] inline-block ml-1 animate-pulse rounded-full align-middle" />
          </h1>
          <div className="mt-4 relative sticky top-2 z-40">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={placeholderText}
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSearchSubmit(search);
                }
              }}
              className="pl-10 pr-12 bg-card border-0 shadow-md rounded-full text-sm h-10"
            />
            <button
              type="button"
              onClick={() => handleSearchSubmit(search)}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-6 px-3 rounded-full bg-[#FF7A00] text-white flex items-center justify-center text-xs font-semibold hover:bg-[#FF7A00]/90 transition-colors"
            >
              Search
            </button>
          </div>
        </section>

        <section className="px-4">
          <div className="mb-4">
            <h2 className="font-heading font-semibold text-base">
              {totalResults > 0 ? `Found ${totalResults} result${totalResults !== 1 ? 's' : ''}` : 'No results found'}
            </h2>
          </div>

          {totalResults === 0 ? (
            <div className="space-y-4">
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-6">Try different keywords or browse by category</p>
                <div className="flex gap-3">
                  <Button
                    onClick={() => {
                      setSearch('');
                      setSearchResults(null);
                      navigate('/houses');
                    }}
                    className="flex-1 h-11 rounded-lg bg-[#0F3D91] hover:bg-[#FF7A00] text-white transition-all duration-300 shadow-lg hover:shadow-[#FF7A00]/20"
                  >
                    <Building2 className="w-4 h-4 mr-2" />
                    Browse Houses
                  </Button>
                  <Button
                    onClick={() => {
                      setSearch('');
                      setSearchResults(null);
                      navigate('/marketplace');
                    }}
                    variant="outline"
                    className="flex-1 h-11 rounded-lg"
                  >
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Browse Marketplace
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {searchResults.houses.length > 0 && (
                <div>
                  <h3 className="font-heading font-semibold text-sm mb-3 text-muted-foreground">Houses</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {searchResults.houses.map(house => (
                      <HouseCard
                        key={house.id}
                        house={house}
                        isFavorite={favoriteHouses.includes(house.id)}
                        onToggleFavorite={toggleFavoriteHouse}
                        size="base"
                      />
                    ))}
                  </div>
                </div>
              )}

              {searchResults.items.length > 0 && (
                <div>
                  <h3 className="font-heading font-semibold text-sm mb-3 text-muted-foreground">Marketplace Items</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {searchResults.items.map(item => (
                      <ItemCard
                        key={item.id}
                        item={item}
                        isFavorite={favoriteItems.includes(item.id)}
                        onToggleFavorite={toggleFavoriteItem}
                        size="base"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-[#F7F9FC] pb-4 px-2 sm:px-4">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0F3D91] via-[#0A2560] to-[#0D47A1] rounded-[48px] px-8 pt-12 pb-8 mt-2 relative overflow-hidden shadow-2xl shadow-blue-900/10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#00B4D8]/10 rounded-full -mr-32 -mt-32 blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#FF7A00]/5 rounded-full -ml-24 -mb-24 blur-[80px]" />
        <h1 className="font-heading font-medium text-3xl sm:text-4xl text-white leading-[1.1] px-4 max-w-sm sm:max-w-md relative z-10 min-h-[80px]">
          {heroTitle}
          <span className="w-[3px] h-7 bg-[#FF7A00] inline-block ml-1 animate-pulse rounded-full align-middle" />
        </h1>
        <div className="mt-4 relative sticky top-2 z-40">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={placeholderText}
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSearchSubmit(search);
              }
            }}
            className="pl-10 pr-12 bg-card border-0 shadow-md rounded-full text-sm h-10"
          />
          <button
            type="button"
            onClick={() => handleSearchSubmit(search)}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-6 px-3 rounded-full bg-[#FF7A00] text-white flex items-center justify-center text-xs font-semibold hover:bg-[#FF7A00]/90 transition-colors"
          >
            Search
          </button>
        </div>
      </section>

      {/* Quick Categories */}
      <section className="px-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-heading font-semibold text-sm text-muted-foreground tracking-wide uppercase">
            Quick categories
          </h2>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1 -mx-4 px-4">
          {categories.map((cat) => (
            <Link
              key={cat.value}
              to={cat.value === 'all' ? '/houses' : `/houses?type=${cat.value}`}
              className="flex flex-col items-center gap-1 min-w-[64px]"
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg shadow-sm border border-border/40 ${cat.value === 'all' ? 'bg-[#0F3D91] text-white' : 'bg-white'
                }`}>
                <span>{cat.icon}</span>
              </div>
              <span className="text-[11px] font-medium text-muted-foreground text-center leading-tight">
                {cat.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Marketing Slideshow - Houses */}
      <section className="px-4">
        <MarketingSlideshow slides={houseSlides} to="/houses" autoplayInterval={6000} delay={0} />
      </section>

      {/* Featured Houses */}
      <section className="px-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-heading font-semibold text-base">Featured houses</h2>
          <Link to="/houses" className="text-sm text-primary flex items-center gap-0.5">
            View all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory">
          {houses.slice(0, 4).map(house => (
            <div key={house.id} className="min-w-[260px] snap-start">
              <HouseCard
                house={house}
                isFavorite={favoriteHouses.includes(house.id)}
                onToggleFavorite={toggleFavoriteHouse}
                size="sm"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Marketing Slideshow - Marketplace */}
      <section className="px-4">
        <MarketingSlideshow slides={marketplaceSlides} to="/marketplace" autoplayInterval={5500} delay={2750} />
      </section>

      {/* Marketplace Highlights */}
      <section className="px-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-heading font-semibold text-base">Marketplace</h2>
          <Link to="/marketplace" className="text-sm text-primary flex items-center gap-0.5">
            View all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory">
          {items.slice(0, 4).map(item => (
            <div key={item.id} className="min-w-[260px] snap-start">
              <ItemCard
                item={item}
                isFavorite={favoriteItems.includes(item.id)}
                onToggleFavorite={toggleFavoriteItem}
                size="sm"
              />
            </div>
          ))}
        </div>
      </section>

      {/* PWA Install Banner */}
      {showInstallBanner && (
        <section className="px-3">
          <div className="fixed bottom-16 left-0 right-0 z-40 px-4">
            <div className="bg-[#00B4D8] text-white rounded-xl py-2.5 px-3 flex items-center gap-2 shadow-lg">
              <Download className="w-4 h-4" />
              <div className="flex-1">
                <p className="font-heading font-medium text-[13px] leading-tight text-white">Install Skitech Embu</p>
                <p className="text-[11px] text-white/90">House Hunting & Marketplace Home Screen</p>
              </div>
              <Button
                size="sm"
                variant="secondary"
                className="h-8 px-3 text-xs font-semibold bg-white text-[#00B4D8] hover:bg-white/90"
                onClick={() => {
                  window.localStorage.setItem('pwa-installed', '1');
                  setShowInstallBanner(false);
                }}
              >
                Install
              </Button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Index;

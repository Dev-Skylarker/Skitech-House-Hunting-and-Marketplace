import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Heart, MapPin, Phone, MessageCircle, ChevronLeft, ChevronRight, Shield, Droplets, Zap, Wifi, Car, Sofa } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HouseCard } from '@/components/HouseCard';
import { useFavorites } from '@/hooks/useFavorites';
import { api, mockHouses } from '@/services/api';
import type { House } from '@/types';
import { cn } from '@/lib/utils';

const amenityIcons: Record<string, React.ReactNode> = {
  Water: <Droplets className="w-4 h-4" />, Electricity: <Zap className="w-4 h-4" />,
  WiFi: <Wifi className="w-4 h-4" />, Parking: <Car className="w-4 h-4" />,
  Security: <Shield className="w-4 h-4" />, Furnished: <Sofa className="w-4 h-4" />,
};

export default function HouseDetailsPage() {
  const { id } = useParams();
  const [house, setHouse] = useState<House | null>(null);
  const [imgIdx, setImgIdx] = useState(0);
  const { favoriteHouses, toggleFavoriteHouse } = useFavorites();

  useEffect(() => {
    if (id) api.getHouseById(id).then(setHouse);
  }, [id]);

  if (!house) return <div className="flex items-center justify-center h-64 text-muted-foreground">Loading...</div>;

  const similar = mockHouses.filter(h => h.id !== house.id && h.houseType === house.houseType).slice(0, 3);

  return (
    <div className="pb-4">
      {/* Image Gallery */}
      <div className="relative aspect-[4/3] bg-muted">
        <img src={house.images[imgIdx]} alt={house.title} className="w-full h-full object-cover" />
        <Link to="/houses" className="absolute top-3 left-3 p-2 rounded-full bg-card/80 backdrop-blur">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <button
          onClick={() => toggleFavoriteHouse(house.id)}
          className="absolute top-3 right-3 p-2 rounded-full bg-card/80 backdrop-blur"
        >
          <Heart className={cn('w-5 h-5', favoriteHouses.includes(house.id) ? 'fill-accent text-accent' : '')} />
        </button>
        {house.images.length > 1 && (
          <>
            <button onClick={() => setImgIdx(i => Math.max(0, i - 1))} className="absolute left-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-card/60"><ChevronLeft className="w-5 h-5" /></button>
            <button onClick={() => setImgIdx(i => Math.min(house.images.length - 1, i + 1))} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-card/60"><ChevronRight className="w-5 h-5" /></button>
          </>
        )}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          {house.images.map((_, i) => (
            <span key={i} className={cn('w-2 h-2 rounded-full', i === imgIdx ? 'bg-primary-foreground' : 'bg-primary-foreground/40')} />
          ))}
        </div>
      </div>

      <div className="px-4 space-y-4 mt-4">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h1 className="font-heading font-bold text-xl">{house.title}</h1>
            {house.verified && <Badge className="bg-secondary text-secondary-foreground shrink-0">Verified</Badge>}
          </div>
          <div className="flex items-center gap-1 mt-1 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{house.location} · {house.distance}km from campus</span>
          </div>
        </div>

        <div className="flex gap-4">
          <div>
            <span className="text-xs text-muted-foreground">Rent</span>
            <p className="font-heading font-bold text-xl text-primary">KSh {house.price.toLocaleString()}<span className="text-xs font-normal text-muted-foreground">/mo</span></p>
          </div>
          <div>
            <span className="text-xs text-muted-foreground">Deposit</span>
            <p className="font-heading font-bold text-lg">KSh {house.deposit.toLocaleString()}</p>
          </div>
        </div>

        <div>
          <h2 className="font-heading font-semibold text-sm mb-2">Amenities</h2>
          <div className="flex flex-wrap gap-2">
            {house.amenities.map(a => (
              <div key={a} className="flex items-center gap-1.5 px-3 py-1.5 bg-muted rounded-full text-xs font-medium">
                {amenityIcons[a] || <Shield className="w-3 h-3" />}
                {a}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-heading font-semibold text-sm mb-2">Description</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{house.description}</p>
        </div>

        {/* Landlord */}
        <div className="bg-muted rounded-lg p-4">
          <h2 className="font-heading font-semibold text-sm mb-2">Landlord</h2>
          <p className="font-medium">{house.landlordName}</p>
          <div className="flex gap-2 mt-3">
            <Button asChild className="flex-1 bg-secondary hover:bg-secondary/90">
              <a href={`https://wa.me/${house.whatsapp.replace('+', '')}`} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-4 h-4 mr-1" /> WhatsApp
              </a>
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <a href={`tel:${house.phone}`}>
                <Phone className="w-4 h-4 mr-1" /> Call
              </a>
            </Button>
          </div>
        </div>

        {/* Similar */}
        {similar.length > 0 && (
          <div>
            <h2 className="font-heading font-semibold mb-3">Similar Houses</h2>
            <div className="grid grid-cols-2 gap-3">
              {similar.map(h => <HouseCard key={h.id} house={h} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

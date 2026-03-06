import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, MapPin, Phone, MessageCircle, ChevronLeft, ChevronRight, Shield, Droplets, Zap, Wifi, Car, Sofa, Star, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { HouseCard } from '@/components/HouseCard';
import { RatingModal } from '@/components/RatingModal';
import { useFavorites } from '@/hooks/useFavorites';
import { api, mockHouses, mockUsers } from '@/services/api';
import type { House, HouseRating } from '@/types';
import { cn } from '@/lib/utils';

const amenityIcons: Record<string, React.ReactNode> = {
  Water: <Droplets className="w-4 h-4" />, Electricity: <Zap className="w-4 h-4" />,
  WiFi: <Wifi className="w-4 h-4" />, Parking: <Car className="w-4 h-4" />,
  Security: <Shield className="w-4 h-4" />, Furnished: <Sofa className="w-4 h-4" />,
};

export default function HouseDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [house, setHouse] = useState<House | null>(null);
  const [imgIdx, setImgIdx] = useState(0);
  const [ratings, setRatings] = useState<HouseRating[]>([]);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const { favoriteHouses, toggleFavoriteHouse } = useFavorites();

  useEffect(() => {
    if (house && house.images.length > 1) {
      const interval = setInterval(() => {
        setImgIdx(i => (i + 1) % house.images.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [house]);

  useEffect(() => {
    if (id) {
      api.getHouseById(id).then(setHouse);
      api.getRatingsForHouse(id).then(setRatings);
    }
  }, [id]);

  const handleSubmitRating = async (rating: number, landlordRating: number, review: string) => {
    if (house?.id) {
      await api.addRating(house.id, 'u_current_user', rating, landlordRating, review);
      const updated = await api.getRatingsForHouse(house.id);
      setRatings(updated);
    }
  };

  if (!house) return <div className="flex items-center justify-center h-64 text-muted-foreground">Loading...</div>;

  const similar = mockHouses.filter(h => h.id !== house.id && h.houseType === house.houseType).slice(0, 3);
  const landlord = house.landlordId ? mockUsers.find(u => u.id === house.landlordId) : null;

  return (
    <div className="pb-4">
      {/* Image Gallery */}
      {/* Smart Carousel */}
      <div className="relative group aspect-[4/3] max-h-[400px] w-full bg-slate-100 overflow-hidden shadow-inner">
        <div className="absolute inset-0 flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${imgIdx * 100}%)` }}>
          {house.images.map((img, i) => (
            <div key={i} className="min-w-full h-full">
              <img src={img} alt={`${house.title} - ${i + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>

        {/* Navigation Overlay */}
        <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <button
            onClick={(e) => { e.stopPropagation(); setImgIdx(i => (i - 1 + house.images.length) % house.images.length); }}
            className="p-2.5 rounded-full bg-white/90 shadow-xl text-[#0F3D91] hover:bg-white hover:scale-110 active:scale-95 transition-all pointer-events-auto"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setImgIdx(i => (i + 1) % house.images.length); }}
            className="p-2.5 rounded-full bg-white/90 shadow-xl text-[#0F3D91] hover:bg-white hover:scale-110 active:scale-95 transition-all pointer-events-auto"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Back/Fav Buttons */}
        <div className="absolute top-4 left-4 right-4 flex justify-between pointer-events-none">
          <button
            onClick={() => window.history.length > 1 ? navigate(-1) : navigate('/houses')}
            className="p-2.5 rounded-2xl bg-black/30 backdrop-blur-md text-white border border-white/20 hover:bg-black/50 transition-all active:scale-90 pointer-events-auto shadow-2xl"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => toggleFavoriteHouse(house.id)}
            className="p-2.5 rounded-2xl bg-black/30 backdrop-blur-md text-white border border-white/20 hover:bg-black/50 transition-all active:scale-90 pointer-events-auto shadow-2xl"
          >
            <Heart className={cn('w-5 h-5', favoriteHouses.includes(house.id) ? 'fill-[#FF7A00] text-[#FF7A00]' : '')} />
          </button>
        </div>

        {/* Progress Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 px-3 py-2 rounded-2xl bg-black/20 backdrop-blur-xl border border-white/10 shadow-2xl">
          {house.images.map((_, i) => (
            <button
              key={i}
              onClick={() => setImgIdx(i)}
              className={cn(
                'h-1.5 rounded-full transition-all duration-300',
                i === imgIdx ? 'w-6 bg-[#FF7A00]' : 'w-1.5 bg-white/50 hover:bg-white/80'
              )}
            />
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

        {/* Ratings Section */}
        <div className="border-t border-border/50 pt-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-heading font-semibold text-sm">Ratings & Reviews</h2>
            <Button
              onClick={() => setShowRatingModal(true)}
              variant="outline"
              size="sm"
              className="text-xs h-8 rounded-lg"
            >
              <Star className="w-3 h-3 mr-1" /> Rate
            </Button>
          </div>

          {/* Rating Summary Card */}
          <Card className="border-none shadow-[0_4px_20px_rgba(0,0,0,0.03)] rounded-2xl mb-6 bg-white overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <p className="text-4xl font-heading font-bold text-[#0F3D91]">{house.rating?.toFixed(1) || '0.0'}</p>
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mt-1">Average Score</p>
                </div>
                <div className="flex-1 space-y-2">
                  {[5, 4, 3, 2, 1].map((n) => (
                    <div key={n} className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-muted-foreground w-3">{n}</span>
                      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow-400 rounded-full"
                          style={{ width: n === 5 ? '70%' : n === 4 ? '20%' : '5%' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reviews List - Scrollable */}
          {ratings.length > 0 ? (
            <div className={cn(
              "space-y-3 pr-1",
              ratings.length > 3 ? "max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200" : ""
            )}>
              {ratings.map(rating => (
                <Card key={rating.id} className="border border-slate-100 shadow-sm rounded-2xl bg-white/50 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${i < rating.rating
                              ? 'fill-yellow-500 text-yellow-500'
                              : 'text-slate-200'
                              }`}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase">
                        {new Date(rating.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-[11px] font-bold text-[#0F3D91] mb-2 uppercase tracking-wide">Verified Tenant</p>
                    {rating.review && <p className="text-sm leading-relaxed text-slate-600">{rating.review}</p>}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <Star className="w-8 h-8 text-slate-200 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground font-medium">No reviews yet. Be the first to share your experience!</p>
            </div>
          )}
        </div>

        {/* Landlord Info Card */}
        {landlord ? (
          <Card className="border-none shadow-sm rounded-lg overflow-hidden">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="font-heading font-semibold text-sm mb-1">Landlord</h2>
                  <p className="font-medium text-base">{landlord.name}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0F3D91] to-[#0A2560] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {landlord.name.charAt(0).toUpperCase()}
                </div>
              </div>

              {/* Reputation */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium">Reputation Score</span>
                  <span className="font-bold text-sm">{landlord.reputationScore || 0}/100</span>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5">
                  <div
                    className="bg-[#0F3D91] h-1.5 rounded-full"
                    style={{ width: `${((landlord.reputationScore || 0) / 100) * 100}%` }}
                  />
                </div>
              </div>

              {/* Badges */}
              {landlord.badges && landlord.badges.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {landlord.badges.map(badge => (
                    <Badge key={badge} variant="secondary" className="text-[10px] rounded-full">
                      ⭐ {badge}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Bio */}
              {landlord.bio && (
                <p className="text-xs text-muted-foreground line-clamp-2">{landlord.bio}</p>
              )}

              {/* Contact Buttons */}
              <div className="flex gap-2 pt-2">
                <Button asChild className="flex-1 bg-secondary hover:bg-secondary/90 h-9">
                  <a href={`https://wa.me/${house.whatsapp.replace('+', '')}?text=${encodeURIComponent(`Hello, I got your contact from Skitech, and would like more details about: ${house.title}`)}`} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="w-4 h-4 mr-1" /> WhatsApp
                  </a>
                </Button>
                <Button asChild variant="outline" className="flex-1 h-9">
                  <a href={`tel:${house.phone}`}>
                    <Phone className="w-4 h-4 mr-1" /> Call
                  </a>
                </Button>
              </div>

              {/* Report Link */}
              <button className="w-full py-2 text-xs text-destructive hover:bg-destructive/5 rounded-lg transition-colors flex items-center justify-center gap-1">
                <Flag className="w-3 h-3" /> Report landlord
              </button>
            </CardContent>
          </Card>
        ) : (
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
        )}



        {/* Similar Houses */}
        {similar.length > 0 && (
          <div className="pt-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-bold text-lg">Similar Houses</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {similar.slice(0, 2).map(h => (
                <HouseCard key={h.id} house={h} size="base" />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Rating Modal */}
      {showRatingModal && (
        <RatingModal
          houseId={house.id}
          houseName={house.title}
          landlordName={house.landlordName}
          onClose={() => setShowRatingModal(false)}
          onSubmit={handleSubmitRating}
        />
      )}
    </div>
  );
}

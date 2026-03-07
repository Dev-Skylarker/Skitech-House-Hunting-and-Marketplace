import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { toast } from '@/hooks/use-toast';
import {
  Building2, MapPin, Camera, Info, Phone,
  ArrowLeft, CheckCircle2, ShieldCheck,
  Sparkles, Wifi, Zap, Droplets, Car,
  Lock, Sofa, Thermometer, Box, Plus, Link as LinkIcon, Upload, ExternalLink, Image as ImageIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const amenitiesOptions = [
  { id: 'Water', icon: Droplets },
  { id: 'Electricity', icon: Zap },
  { id: 'WiFi', icon: Wifi },
  { id: 'Parking', icon: Car },
  { id: 'Security', icon: Lock },
  { id: 'Furnished', icon: Sofa },
  { id: 'Hot Water', icon: Thermometer },
  { id: 'Balcony', icon: Box },
  { id: 'CCTV', icon: ShieldCheck }
];

export default function PostHousePage() {
  const { isAuthenticated, user } = useAuth();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();
  const [amenities, setAmenities] = useState<string[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>(['']);
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  const canAddMoreImages = imageUrls.length < 9;

  const handleImageUrlChange = (index: number, value: string) => {
    setImageUrls(prev => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleFileUpload = (index: number, file: File | null) => {
    if (!file) return;

    if (file.size > 100 * 1024) {
      toast({
        variant: "destructive",
        title: "File too large!",
        description: "Please keep images under 100KB to ensure fast loading for users."
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      handleImageUrlChange(index, reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAddImageField = () => {
    if (!canAddMoreImages) return;
    setImageUrls(prev => [...prev, '']);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F7F9FC] flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-6 bg-white p-10 rounded-[32px] shadow-xl border border-slate-100">
          <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto">
            <Lock className="w-10 h-10 text-[#0F3D91]" />
          </div>
          <h1 className="font-heading font-bold text-2xl text-slate-900">Login Required</h1>
          <p className="text-slate-500">You need to be signed in to list a property on our platform.</p>
          <Button
            onClick={() => navigate('/account', { state: { from: location } })}
            className="w-full h-12 bg-[#0F3D91] hover:bg-[#FF7A00] rounded-xl font-heading font-bold shadow-lg shadow-blue-900/10 transition-all duration-300"
          >
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  const handlePinLocation = () => {
    setIsLocating(true);
    if (!navigator.geolocation) {
      toast({
        variant: "destructive",
        title: "Geolocation not supported",
        description: "Your browser doesn't support location services."
      });
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setIsLocating(false);
        toast({
          title: "Location Pinned!",
          description: `Coordinates: ${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`,
        });
      },
      (error) => {
        setIsLocating(false);
        toast({
          variant: "destructive",
          title: "Location Error",
          description: error.message
        });
      }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // First Listing Trigger
    const firstListingKey = `first_listing_${user?.id}`;
    if (!localStorage.getItem(firstListingKey)) {
      addNotification({
        userId: user?.id || 'unknown',
        title: "First House Listed! 🏠✨",
        description: "Congratulations! Your first property is being reviewed and will be live soon.",
        type: 'listing_approved'
      });
      localStorage.setItem(firstListingKey, 'true');
    }

    const mediaPayload = imageUrls.filter(url => url.trim() !== '');
    console.log('Sending Property Media Payload (Array of Strings):', mediaPayload);
    console.log('Form submitted with coordinates:', coordinates);

    toast({
      title: 'Submission Received',
      description: 'Your listing is being reviewed. We will notify you within 24-48 hours.'
    });
    navigate('/account');
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] pb-24">
      {/* Premium Header */}
      <div className="bg-[#0F3D91] text-white pt-16 pb-32 px-6 rounded-b-[40px] shadow-2xl relative overflow-hidden mb-[-120px]">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -mr-40 -mt-40 blur-3xl" />
        <div className="max-w-4xl mx-auto relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm font-bold mb-4"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <h1 className="font-heading font-bold text-4xl mb-2 flex items-center gap-3">
              List Your Property <Sparkles className="w-8 h-8 text-[#FF7A00]" />
            </h1>
            <p className="text-white/70 max-w-lg">
              Reach thousands of users in Embu. Provide accurate details to build trust with potential tenants.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl hidden md:block">
            <div className="flex items-center gap-3 text-sm">
              <ShieldCheck className="w-5 h-5 text-green-400" />
              <span>Verified Identity: <strong>{user?.name}</strong></span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="bg-white/95 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[40px] border border-white overflow-hidden">
          <form onSubmit={handleSubmit} className="divide-y divide-slate-100">
            {/* Step 1: Basic Info */}
            <div className="p-8 lg:p-12 space-y-8">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#0F3D91]">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-heading font-bold text-xl text-slate-900">Basic Information</h2>
                  <p className="text-sm text-slate-500">Essential details about your house</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid gap-2">
                  <Label className="text-sm font-bold text-slate-700">Listing Title</Label>
                  <Input
                    placeholder="e.g. Modern bedsitter with high-speed WiFi near main gate"
                    required
                    className="h-12 rounded-2xl text-slate-900 border-slate-200 focus:ring-[#0F3D91] focus:border-[#0F3D91] transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="grid gap-2">
                    <Label className="text-sm font-bold text-slate-700">House Type</Label>
                    <Select required>
                      <SelectTrigger className="h-12 rounded-2xl border-slate-200">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="bedsitter">Bedsitter</SelectItem>
                        <SelectItem value="single">Single room</SelectItem>
                        <SelectItem value="1br">1 Bedroom</SelectItem>
                        <SelectItem value="2br">2 Bedroom</SelectItem>
                        <SelectItem value="3br">3 Bedroom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-sm font-bold text-slate-700">Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        placeholder="e.g. Kangaru Area"
                        required
                        className="h-12 pl-11 rounded-2xl border-slate-200"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="grid gap-2">
                    <Label className="text-sm font-bold text-slate-700">Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        placeholder="e.g. Kangaru Area"
                        required
                        className="h-12 pl-11 rounded-2xl border-slate-200"
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-sm font-bold text-slate-700">GPS Coordinates (Optional)</Label>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        onClick={handlePinLocation}
                        disabled={isLocating}
                        variant="outline"
                        className={cn(
                          "flex-1 h-12 rounded-xl border-dashed border-2 transition-all gap-2",
                          coordinates ? "border-green-200 bg-green-50 text-green-700" : "border-slate-200 hover:border-[#0F3D91] hover:bg-blue-50"
                        )}
                      >
                        {isLocating ? (
                          <span className="animate-spin w-4 h-4 border-2 border-[#0F3D91] border-t-transparent rounded-full" />
                        ) : (
                          <MapPin className={cn("w-4 h-4", coordinates ? "text-green-500" : "text-[#0F3D91]")} />
                        )}
                        {coordinates ? `Location Pinned (${coordinates.lat.toFixed(2)}, ${coordinates.lng.toFixed(2)})` : "Pin Current Location"}
                      </Button>
                      {coordinates && (
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => setCoordinates(null)}
                          className="h-12 px-4 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50"
                        >
                          <Zap className="w-4 h-4 text-red-500" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="grid gap-2">
                    <Label className="text-sm font-bold text-slate-700">Rent per Month (KSh)</Label>
                    <Input type="number" placeholder="5,000" required className="h-12 rounded-2xl border-slate-200" />
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-sm font-bold text-slate-700">Required Deposit (KSh)</Label>
                    <Input type="number" placeholder="5,000" required className="h-12 rounded-2xl border-slate-200" />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Media */}
            <div className="p-8 lg:p-12 space-y-8 bg-slate-50/50">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-[#FF7A00]">
                  <Camera className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-heading font-bold text-xl text-slate-900 tracking-tight">Image Gallery</h2>
                  <p className="text-sm text-slate-500">Add up to 9 photos (including cover). Keep each under 100KB.</p>
                </div>
              </div>

              {/* Advanced Instructions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm space-y-3">
                  <div className="flex items-center gap-2 text-[#FF7A00]">
                    <Zap className="w-4 h-4 fill-[#FF7A00]" />
                    <h4 className="font-bold text-sm uppercase tracking-wider">Fast Loading Rule</h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    To help students with slow internet, all photos must be <strong>under 100KB</strong>.
                  </p>
                  <Button asChild variant="outline" className="w-full h-10 rounded-xl border-[#FF7A00]/20 text-[#FF7A00] hover:bg-[#FF7A00] hover:text-white transition-all text-xs gap-2">
                    <a href="https://image.pi7.org/compress-image-to-100kb" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-3.5 h-3.5" /> Compress My Images
                    </a>
                  </Button>
                </div>

                <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm space-y-3">
                  <div className="flex items-center gap-2 text-[#0F3D91]">
                    <Info className="w-4 h-4 fill-[#0F3D91]" />
                    <h4 className="font-bold text-sm uppercase tracking-wider">Using Image Links</h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    You can upload a photo from your phone or <strong>paste a web link</strong> from Google Photos or Imgur.
                  </p>
                  <p className="text-[10px] text-[#0F3D91] font-bold">Right-click a photo online &gt; "Copy Image Address" to get a link!</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {imageUrls.map((url, index) => (
                    <div key={index} className={cn(
                      "group relative flex flex-col p-5 bg-white rounded-[32px] border-2 transition-all duration-300",
                      index === 0 ? "border-[#FF7A00] shadow-lg shadow-orange-500/5 ring-4 ring-orange-50" : "border-slate-100 hover:border-blue-200"
                    )}>
                      {index === 0 && (
                        <div className="absolute -top-3 -left-3 bg-[#FF7A00] text-white text-[10px] font-black uppercase px-3 py-1.5 rounded-full shadow-lg z-10">
                          Main Display Photo
                        </div>
                      )}

                      <div className="flex-1 space-y-4">
                        <div className="flex gap-2 p-1 bg-slate-50 rounded-xl border border-slate-100">
                          <button
                            type="button"
                            onClick={() => handleImageUrlChange(index, '')}
                            className="flex-1 py-2 text-[10px] font-bold uppercase rounded-lg transition-all hover:bg-white hover:shadow-sm"
                          >
                            <LinkIcon className="w-3 h-3 inline mr-1" /> Paste Link
                          </button>
                          <label className="flex-1 py-2 text-[10px] font-bold uppercase rounded-lg transition-all hover:bg-white hover:shadow-sm cursor-pointer text-center">
                            <Upload className="w-3 h-3 inline mr-1" /> Upload File
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={(e) => handleFileUpload(index, e.target.files?.[0] || null)}
                            />
                          </label>
                        </div>

                        <div className="relative">
                          {url ? (
                            <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-slate-100 shadow-inner group-hover:shadow-md transition-all">
                              <img src={url} alt="Preview" className="w-full h-full object-cover" />
                              <button
                                onClick={() => handleImageUrlChange(index, '')}
                                className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-white hover:bg-black transition-colors"
                              >
                                <Lock className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <div className="aspect-[4/3] rounded-2xl bg-slate-50 border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-slate-300 transition-colors group-hover:border-[#0F3D91]/20">
                              <ImageIcon className="w-8 h-8 mb-2 opacity-20" />
                              <span className="text-[10px] font-bold uppercase tracking-widest px-4 text-center">No image selected</span>
                            </div>
                          )}
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Link Destination</Label>
                          <Input
                            value={url.startsWith('data:') ? 'Local file uploaded ✓' : url}
                            onChange={e => handleImageUrlChange(index, e.target.value)}
                            placeholder="https://..."
                            disabled={url.startsWith('data:')}
                            className="h-9 rounded-xl border-slate-100 bg-slate-50/50 text-[11px] focus:ring-[#0F3D91]"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  {canAddMoreImages && (
                    <button
                      type="button"
                      onClick={handleAddImageField}
                      className="border-2 border-dashed border-slate-200 rounded-[32px] flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-[#0F3D91] hover:border-[#0F3D91] hover:bg-blue-50 transition-all min-h-[200px]"
                    >
                      <Plus className="w-8 h-8" />
                      <span className="text-xs font-bold uppercase tracking-widest pt-2">Add Gallery Photo</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Step 3: Details & Amenities */}
            <div className="p-8 lg:p-12 space-y-8">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-heading font-bold text-xl text-slate-900">Features & Amenities</h2>
                  <p className="text-sm text-slate-500">What makes your property special?</p>
                </div>
              </div>

              <div className="space-y-8">
                <div className="grid gap-2">
                  <Label className="text-sm font-bold text-slate-700">Detailed Description</Label>
                  <Textarea
                    placeholder="Describe the room layout, water/electricity situation, shared areas, and any house rules (e.g. quiet hours)."
                    required
                    className="min-h-[150px] rounded-2xl border-slate-200 p-4"
                  />
                </div>

                <div className="space-y-4">
                  <Label className="text-sm font-bold text-slate-700">Available Amenities</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {amenitiesOptions.map(({ id, icon: Icon }) => (
                      <label
                        key={id}
                        className={cn(
                          "flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer",
                          amenities.includes(id)
                            ? "bg-blue-50 border-[#0F3D91] text-[#0F3D91]"
                            : "bg-white border-slate-100 text-slate-600 hover:border-slate-300"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={cn("w-4 h-4", amenities.includes(id) ? "text-[#0F3D91]" : "text-slate-400")} />
                          <span className="text-xs font-bold">{id}</span>
                        </div>
                        <Checkbox
                          checked={amenities.includes(id)}
                          onCheckedChange={(checked) => {
                            setAmenities(prev => checked ? [...prev, id] : prev.filter(x => x !== id));
                          }}
                          className="w-5 h-5 rounded-md border-slate-300 data-[state=checked]:bg-[#0F3D91]"
                        />
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4: Contact */}
            <div className="p-8 lg:p-12 space-y-8 bg-slate-50/30">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-heading font-bold text-xl text-slate-900">Contact Channels</h2>
                  <p className="text-sm text-slate-500">How should students reach you?</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="grid gap-2">
                  <Label className="text-sm font-bold text-slate-700">Phone Number (Direct)</Label>
                  <Input placeholder="+254 700 000 000" required className="h-12 rounded-xl border-slate-200" />
                </div>
                <div className="grid gap-2">
                  <Label className="text-sm font-bold text-slate-700">WhatsApp Number</Label>
                  <Input placeholder="+254 700 000 000" required className="h-12 rounded-xl border-slate-200" />
                </div>
              </div>
            </div>

            {/* Submit Block */}
            <div className="p-8 lg:p-12 bg-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-2">
                <h3 className="font-heading font-bold text-xl">Ready to go live?</h3>
                <p className="text-white/60 text-sm max-w-sm">
                  Our team will review your post within 24 hours to ensure quality and community safety.
                </p>
              </div>
              <Button
                type="submit"
                className="w-full md:w-auto h-14 px-12 rounded-2xl bg-[#FF7A00] hover:bg-[#E66E00] text-white font-heading font-bold text-lg shadow-2xl transition-all hover:scale-105 active:scale-100"
              >
                Submit for Approval
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

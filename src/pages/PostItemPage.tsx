import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { toast } from '@/hooks/use-toast';
import {
  ShoppingBag, Tag, Camera, Info, Phone,
  ArrowLeft, CheckCircle2, ShieldCheck,
  Sparkles, Package, HelpCircle, Plus,
  DollarSign, List, Link as LinkIcon, Upload, ExternalLink, Image as ImageIcon, Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export default function PostItemPage() {
  const { isAuthenticated, user } = useAuth();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();
  const [imageUrls, setImageUrls] = useState<string[]>(['']);

  const canAddMoreImages = imageUrls.length < 4;

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
        description: "Please keep images under 100KB to ensure fast loading for students."
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
          <div className="w-20 h-20 bg-orange-50 rounded-3xl flex items-center justify-center mx-auto">
            <ShoppingBag className="w-10 h-10 text-orange-600" />
          </div>
          <h1 className="font-heading font-bold text-2xl text-slate-900">Login Required</h1>
          <p className="text-slate-500">You need to be signed in to list items on the marketplace.</p>
          <Button
            onClick={() => navigate('/account', { state: { from: location } })}
            className="w-full h-12 bg-orange-600 hover:bg-orange-700 rounded-xl font-heading font-bold shadow-lg shadow-orange-900/10 transition-all duration-300"
          >
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // First Item Trigger
    const firstItemKey = `first_item_${user?.id}`;
    if (!localStorage.getItem(firstItemKey)) {
      addNotification({
        userId: user?.id || 'unknown',
        title: "First Item Listed! 🛍️✨",
        description: "Great start! Your item is being reviewed and will be live on the marketplace soon.",
        type: 'listing_approved'
      });
      localStorage.setItem(firstItemKey, 'true');
    }

    toast({
      title: 'Item Submitted',
      description: 'Your post is being reviewed for community safety. Check back shortly!'
    });
    navigate('/account');
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] pb-24">
      {/* Premium Header */}
      <div className="bg-orange-600 text-white pt-16 pb-32 px-6 rounded-b-[40px] shadow-2xl relative overflow-hidden mb-[-120px]">
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
              Sell Something <Sparkles className="w-8 h-8 text-yellow-300" />
            </h1>
            <p className="text-white/80 max-w-lg">
              Declutter your space and make some extra cash. Share items with the UoEM student community.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl hidden md:block text-white">
            <div className="flex items-center gap-3 text-sm">
              <Package className="w-5 h-5" />
              <span>Active Seller: <strong>{user?.name}</strong></span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="bg-white/95 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[40px] border border-white overflow-hidden">
          <form onSubmit={handleSubmit} className="divide-y divide-slate-100">
            {/* Step 1: Item Info */}
            <div className="p-8 lg:p-12 space-y-8">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600">
                  <Tag className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-heading font-bold text-xl text-slate-900">Item Information</h2>
                  <p className="text-sm text-slate-500">Tell us what you're selling</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid gap-2">
                  <Label className="text-sm font-bold text-slate-700">Item Title</Label>
                  <Input
                    placeholder="e.g. Study desk with drawers - almost new"
                    required
                    className="h-12 rounded-xl text-slate-900 border-slate-200 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="grid gap-2">
                    <Label className="text-sm font-bold text-slate-700">Category</Label>
                    <Select required>
                      <SelectTrigger className="h-12 rounded-xl border-slate-200">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="furniture">Furniture</SelectItem>
                        <SelectItem value="electronics">Electronics</SelectItem>
                        <SelectItem value="books">Books</SelectItem>
                        <SelectItem value="appliances">Appliances</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-sm font-bold text-slate-700">Condition</Label>
                    <Select required>
                      <SelectTrigger className="h-12 rounded-xl border-slate-200">
                        <SelectValue placeholder="Condition" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="new">Brand New</SelectItem>
                        <SelectItem value="like-new">Like New</SelectItem>
                        <SelectItem value="used">Lightly Used</SelectItem>
                        <SelectItem value="fair">Fair / Functional</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label className="text-sm font-bold text-slate-700">Selling Price (KSh)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input type="number" placeholder="2,500" required className="h-12 pl-11 rounded-xl border-slate-200 focus:ring-orange-500" />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Photos */}
            <div className="p-8 lg:p-12 space-y-8 bg-slate-50/50">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                  <Camera className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-heading font-bold text-xl text-slate-900 tracking-tight">Product Photos</h2>
                  <p className="text-sm text-slate-500">Add up to 4 photos. Keep each under 100KB.</p>
                </div>
              </div>

              {/* Advanced Instructions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm space-y-3">
                  <div className="flex items-center gap-2 text-orange-600">
                    <Zap className="w-4 h-4 fill-orange-600" />
                    <h4 className="font-bold text-sm uppercase tracking-wider">Fast Loading Rule</h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Small images load faster for everyone! All photos must be <strong>under 100KB</strong>.
                  </p>
                  <Button asChild variant="outline" className="w-full h-10 rounded-xl border-orange-200 text-orange-600 hover:bg-orange-600 hover:text-white transition-all text-xs gap-2">
                    <a href="https://image.pi7.org/compress-image-to-100kb" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-3.5 h-3.5" /> Compress My Images
                    </a>
                  </Button>
                </div>

                <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm space-y-3">
                  <div className="flex items-center gap-2 text-blue-600">
                    <Info className="w-4 h-4 fill-blue-600" />
                    <h4 className="font-bold text-sm uppercase tracking-wider">Using Links</h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    You can either upload a photo or <strong>paste a web link</strong> from Google Photos or Imgur.
                  </p>
                  <p className="text-[10px] text-blue-800 font-bold bg-blue-50 p-2 rounded-lg">Pro Tip: Right-click any photo &gt; "Copy Image Address" to get a link!</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {imageUrls.map((url, index) => (
                    <div key={index} className={cn(
                      "group relative flex flex-col p-5 bg-white rounded-[32px] border-2 transition-all duration-300",
                      index === 0 ? "border-orange-500 shadow-lg shadow-orange-500/5 ring-4 ring-orange-50" : "border-slate-100 hover:border-blue-200"
                    )}>
                      {index === 0 && (
                        <div className="absolute -top-3 -left-3 bg-orange-600 text-white text-[10px] font-black uppercase px-3 py-1.5 rounded-full shadow-lg z-10">
                          Main Display
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
                            <div className="aspect-square rounded-2xl overflow-hidden border border-slate-100 shadow-inner group-hover:shadow-md transition-all">
                              <img src={url} alt="Preview" className="w-full h-full object-cover" />
                              <button
                                onClick={() => handleImageUrlChange(index, '')}
                                className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-white hover:bg-black transition-colors"
                              >
                                <Plus className="w-3 h-3 rotate-45" />
                              </button>
                            </div>
                          ) : (
                            <div className="aspect-square rounded-2xl bg-slate-50 border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-slate-300 transition-colors group-hover:border-orange-200">
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
                            className="h-9 rounded-xl border-slate-100 bg-slate-50/50 text-[11px] focus:ring-orange-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  {canAddMoreImages && (
                    <button
                      type="button"
                      onClick={handleAddImageField}
                      className="border-2 border-dashed border-slate-200 rounded-[32px] flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-orange-600 hover:border-orange-600 hover:bg-orange-50 transition-all min-h-[200px]"
                    >
                      <Plus className="w-8 h-8" />
                      <span className="text-xs font-bold uppercase tracking-widest pt-2">Add Photo</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Step 3: Details */}
            <div className="p-8 lg:p-12 space-y-8">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
                  <List className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-heading font-bold text-xl text-slate-900">Item Description</h2>
                  <p className="text-sm text-slate-500">Be honest about model, age, and faults</p>
                </div>
              </div>

              <div className="grid gap-2">
                <Label className="text-sm font-bold text-slate-700">Detailed Description</Label>
                <Textarea
                  placeholder="Describe brand, model, any scratches, and reasons for selling. Let students know if price is negotiable."
                  required
                  className="min-h-[150px] rounded-2xl border-slate-200 p-4 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* Step 4: Contact */}
            <div className="p-8 lg:p-12 space-y-8 bg-slate-50/30">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-heading font-bold text-xl text-slate-900">Communication</h2>
                  <p className="text-sm text-slate-500">Where should buyers contact you?</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="grid gap-2">
                  <Label className="text-sm font-bold text-slate-700">Phone Number</Label>
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
                <div className="flex items-center gap-2 mb-1">
                  <HelpCircle className="w-4 h-4 text-orange-400" />
                  <h3 className="font-heading font-bold text-xl">Approval Required</h3>
                </div>
                <p className="text-white/60 text-sm max-w-sm">
                  Marketplace posts are reviewed for authenticity and community guidelines before going live.
                </p>
              </div>
              <Button
                type="submit"
                className="w-full md:w-auto h-14 px-12 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-heading font-bold text-lg shadow-2xl transition-all hover:scale-105 active:scale-100"
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

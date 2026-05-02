import { useState } from 'react';
import { Building2, Upload, X, CheckCircle, AlertCircle, Home, Package, MapPin, DollarSign, Tag, Info, ShoppingBag, Sparkles, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface AddListingModuleProps {
  onRefresh: () => void;
}

type ListingType = 'house' | 'item';
type Step = 1 | 2 | 3;

const HOUSE_TYPES = ['bedsitter', 'single', '1br', '2br', '3br'];
const CATEGORIES = ['electronics', 'furniture', 'books', 'appliances', 'clothing', 'sports', 'other'];
const CONDITIONS = ['new', 'like-new', 'good', 'fair', 'used'];
const AMENITIES_OPTIONS = ['WiFi', 'Water', 'Security', 'CCTV', 'Parking', 'Garden', 'Balcony', 'Kitchen Cabinets', 'Elevator'];

const FIELD_LABEL = 'text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1';
const INPUT_BASE = 'pl-10 rounded-2xl h-12 w-full bg-slate-50 border-transparent focus:bg-white focus:border-slate-200 transition-all text-sm shadow-sm';

export function AddListingModule({ onRefresh }: AddListingModuleProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState<Step>(1);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    listing_type: '' as ListingType | '',
    title: '',
    description: '',
    price: '',
    deposit: '',
    location: '',
    house_type: '',
    category: '',
    condition: '',
    amenities: [] as string[],
    images: [] as string[],
    status: 'pending' as string,
    is_sponsored: false,
  });

  const set = (k: string, v: any) => setForm(prev => ({ ...prev, [k]: v }));

  const validateStep1 = () => {
    const errs: Record<string, string> = {};
    if (!form.listing_type) errs.listing_type = 'Listing type is required';
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) errs.price = 'Valid price is required';
    if (!form.location.trim()) errs.location = 'Location is required';
    if (form.listing_type === 'house' && !form.house_type) errs.house_type = 'House type is required for houses';
    if (form.listing_type === 'item' && !form.category) errs.category = 'Category is required for items';
    if (form.listing_type === 'item' && !form.condition) errs.condition = 'Condition is required for items';
    // Block invalid combinations
    if (form.listing_type === 'item' && form.house_type) errs.house_type = 'house_type is not valid for item listings';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateStep1()) return;
    if (!supabase) { toast({ title: 'Supabase not configured', variant: 'destructive' }); return; }
    setSubmitting(true);

    const payload: Record<string, any> = {
      listing_type: form.listing_type,
      title: form.title.trim(),
      description: form.description.trim() || null,
      price: Number(form.price),
      location: form.location.trim(),
      images: form.images,
      status: form.status,
      is_sponsored: form.is_sponsored,
      created_by: user?.id,
    };

    if (form.listing_type === 'house') {
      payload.house_type = form.house_type;
      payload.deposit = form.deposit ? Number(form.deposit) : 0;
      payload.amenities = form.amenities;
    }
    if (form.listing_type === 'item') {
      payload.category = form.category;
      payload.condition = form.condition;
    }

    const { error } = await supabase.from('listings').insert(payload);
    if (error) {
      toast({ title: 'Insertion failed', description: error.message, variant: 'destructive' });
      setSubmitting(false);
      return;
    }

    // Log to audit
    await supabase.from('admin_audit_logs').insert({
      action: 'ADMIN_CREATE_LISTING', target_type: 'listing', metadata: { title: payload.title, type: payload.listing_type }
    });

    toast({ title: 'Listing created ✓', description: `"${form.title}" has been added.` });
    onRefresh();
    setForm({ listing_type: '', title: '', description: '', price: '', deposit: '', location: '', house_type: '', category: '', condition: '', amenities: [], images: [], status: 'pending', is_sponsored: false });
    setStep(1);
    setSubmitting(false);
  };

  const toggleAmenity = (a: string) => {
    set('amenities', form.amenities.includes(a) ? form.amenities.filter(x => x !== a) : [...form.amenities, a]);
  };

  return (
    <div className="space-y-10 pb-20 animate-fade-in">
      <div className="px-2">
        <h2 className="font-heading text-4xl font-black tracking-tight text-[#0F3D91] uppercase leading-none">Add Listing</h2>
        <p className="text-slate-500 font-medium text-sm mt-2 italic opacity-75">Schema-validated listing creation with role-based overrides and atomic insertion.</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-4 px-2">
        {(['Type & Core', 'Details', 'Preview & Submit'] as const).map((label, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm transition-all",
              step > i + 1 ? "bg-green-500 text-white" : step === i + 1 ? "bg-[#0F3D91] text-white shadow-xl shadow-blue-900/20" : "bg-slate-100 text-slate-400")}>
              {step > i + 1 ? <CheckCircle className="w-5 h-5" /> : i + 1}
            </div>
            <span className={cn("font-black text-[11px] uppercase tracking-widest", step === i + 1 ? "text-[#0F3D91]" : "text-slate-400")}>{label}</span>
            {i < 2 && <div className="w-12 h-px bg-slate-200" />}
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-100 rounded-[3rem] shadow-2xl shadow-slate-200/30 p-12 mx-2 space-y-10">
        {/* Step 1 */}
        {step === 1 && (
          <div className="space-y-8">
            <div>
              <label className={FIELD_LABEL}>Listing Type *</label>
              <div className="grid grid-cols-2 gap-4">
                {(['house', 'item'] as const).map(t => (
                  <button key={t} onClick={() => { set('listing_type', t); set('house_type', ''); set('category', ''); set('condition', ''); }}
                    className={cn("p-8 rounded-3xl border-2 text-left transition-all group",
                      form.listing_type === t ? "border-[#0F3D91] bg-[#0F3D91]/5" : "border-slate-200 hover:border-slate-300")}>
                    <div className="flex items-center gap-4">
                      {t === 'house' ? <Home className={cn("w-8 h-8", form.listing_type === t ? "text-[#0F3D91]" : "text-slate-300")} /> : <Package className={cn("w-8 h-8", form.listing_type === t ? "text-[#0F3D91]" : "text-slate-300")} />}
                      <div>
                        <p className="font-black text-lg capitalize">{t} Listing</p>
                        <p className="text-xs text-slate-400 font-medium">{t === 'house' ? 'Requires: house_type, location, price' : 'Requires: category, condition, price'}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              {errors.listing_type && <p className="text-red-500 text-xs font-bold mt-2">{errors.listing_type}</p>}
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className={FIELD_LABEL}>Title *</label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input className={cn(INPUT_BASE, errors.title && "border-red-300")} placeholder="e.g. Modern Studio near Campus" value={form.title} onChange={e => set('title', e.target.value)} />
                </div>
                {errors.title && <p className="text-red-500 text-xs font-bold mt-1">{errors.title}</p>}
              </div>
              <div className="space-y-2">
                <label className={FIELD_LABEL}>Location *</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input className={cn(INPUT_BASE, errors.location && "border-red-300")} placeholder="e.g. Embu Town" value={form.location} onChange={e => set('location', e.target.value)} />
                </div>
                {errors.location && <p className="text-red-500 text-xs font-bold mt-1">{errors.location}</p>}
              </div>
              <div className="space-y-2">
                <label className={FIELD_LABEL}>Price (KES) *</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input type="number" className={cn(INPUT_BASE, errors.price && "border-red-300")} placeholder="e.g. 8000" value={form.price} onChange={e => set('price', e.target.value)} />
                </div>
                {errors.price && <p className="text-red-500 text-xs font-bold mt-1">{errors.price}</p>}
              </div>
              {form.listing_type === 'house' && (
                <div className="space-y-2">
                  <label className={FIELD_LABEL}>Deposit (KES)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input type="number" className={INPUT_BASE} placeholder="e.g. 16000" value={form.deposit} onChange={e => set('deposit', e.target.value)} />
                  </div>
                </div>
              )}
            </div>

            {/* Conditional fields */}
            {form.listing_type === 'house' && (
              <div>
                <label className={FIELD_LABEL}>House Type * (required for houses)</label>
                <div className="flex flex-wrap gap-3">
                  {HOUSE_TYPES.map(ht => (
                    <button key={ht} onClick={() => set('house_type', ht)}
                      className={cn("px-5 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest border-2 transition-all",
                        form.house_type === ht ? "bg-[#0F3D91] text-white border-[#0F3D91]" : "border-slate-200 text-slate-500 hover:border-slate-300")}>
                      {ht}
                    </button>
                  ))}
                </div>
                {errors.house_type && <p className="text-red-500 text-xs font-bold mt-2">{errors.house_type}</p>}
              </div>
            )}

            {form.listing_type === 'item' && (
              <div className="grid grid-cols-2 gap-6 mt-6">
                <div className="space-y-2">
                  <label className={FIELD_LABEL}>Category * (items only)</label>
                  <div className="relative">
                    <ShoppingBag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 z-10" />
                    <select className={cn(INPUT_BASE, errors.category && "border-red-300")} value={form.category} onChange={e => set('category', e.target.value)}>
                      <option value="">Select category</option>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  {errors.category && <p className="text-red-500 text-xs font-bold mt-1">{errors.category}</p>}
                </div>
                <div className="space-y-2">
                  <label className={FIELD_LABEL}>Condition * (items only)</label>
                  <div className="relative">
                    <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 z-10" />
                    <select className={cn(INPUT_BASE, errors.condition && "border-red-300")} value={form.condition} onChange={e => set('condition', e.target.value)}>
                      <option value="">Select condition</option>
                      {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  {errors.condition && <p className="text-red-500 text-xs font-bold mt-1">{errors.condition}</p>}
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <Button onClick={() => { if (validateStep1()) setStep(2); }}
                className="rounded-2xl bg-[#0F3D91] hover:bg-[#0A2560] text-white font-black text-[10px] uppercase tracking-widest h-14 px-12">
                Continue →
              </Button>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="space-y-8">
            <div className="space-y-2">
              <label className={FIELD_LABEL}>Description</label>
              <div className="relative">
                <Info className="absolute left-3 top-3 w-4 h-4 text-slate-300" />
                <textarea className={cn(INPUT_BASE, "min-h-[120px] resize-none pt-3")} placeholder="Provide a detailed, accurate description..." value={form.description} onChange={e => set('description', e.target.value)} />
              </div>
            </div>

            {form.listing_type === 'house' && (
              <div>
                <label className={FIELD_LABEL}>Amenities</label>
                <div className="flex flex-wrap gap-3">
                  {AMENITIES_OPTIONS.map(a => (
                    <button key={a} onClick={() => toggleAmenity(a)}
                      className={cn("px-4 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest border-2 transition-all",
                        form.amenities.includes(a) ? "bg-[#0F3D91] text-white border-[#0F3D91]" : "border-slate-200 text-slate-500 hover:border-slate-300")}>
                      {a}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className={FIELD_LABEL}>Image URLs (comma-separated)</label>
              <input className={INPUT_BASE} placeholder="https://... , https://..." 
                value={form.images.join(', ')} 
                onChange={e => set('images', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} />
              <p className="text-[10px] text-slate-400 font-bold mt-2">Add public image URLs. At least 1 recommended.</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className={FIELD_LABEL}>Initial Status</label>
                <div className="relative">
                  <List className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 z-10" />
                  <select className={INPUT_BASE} value={form.status} onChange={e => set('status', e.target.value)}>
                    <option value="pending">Pending (Default)</option>
                    <option value="available">Available (Admin override)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className={FIELD_LABEL}>Sponsorship (Admin Permission Required)</label>
                <button onClick={() => set('is_sponsored', !form.is_sponsored)}
                  className={cn("w-full h-14 rounded-2xl border-2 font-black text-[11px] uppercase tracking-widest transition-all",
                    form.is_sponsored ? "bg-amber-50 border-amber-400 text-amber-700" : "border-slate-200 text-slate-400 hover:border-slate-300")}>
                  {form.is_sponsored ? '⚡ Sponsored — ON' : 'Sponsorship — OFF'}
                </button>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)} className="rounded-2xl h-14 px-8 font-black text-[10px] uppercase tracking-widest border-slate-200">← Back</Button>
              <Button onClick={() => setStep(3)} className="rounded-2xl bg-[#0F3D91] hover:bg-[#0A2560] text-white font-black text-[10px] uppercase tracking-widest h-14 px-12">
                Preview →
              </Button>
            </div>
          </div>
        )}

        {/* Step 3 - Preview */}
        {step === 3 && (
          <div className="space-y-8">
            <div className="p-8 bg-slate-50 rounded-3xl border border-slate-200">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Pre-submission Schema Preview</p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { k: 'listing_type', v: form.listing_type },
                  { k: 'title', v: form.title },
                  { k: 'price', v: `KES ${Number(form.price).toLocaleString()}` },
                  { k: 'location', v: form.location },
                  { k: 'status', v: form.status },
                  { k: 'is_sponsored', v: String(form.is_sponsored) },
                  ...(form.listing_type === 'house' ? [{ k: 'house_type', v: form.house_type }, { k: 'deposit', v: form.deposit || '0' }] : []),
                  ...(form.listing_type === 'item' ? [{ k: 'category', v: form.category }, { k: 'condition', v: form.condition }] : []),
                ].map(({ k, v }) => (
                  <div key={k} className="flex items-center justify-between py-3 border-b border-slate-100">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{k}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-black text-slate-800">{v || '—'}</p>
                      {v ? <div className="w-2 h-2 rounded-full bg-green-400" /> : <div className="w-2 h-2 rounded-full bg-red-400" />}
                    </div>
                  </div>
                ))}
              </div>
              {form.images.length > 0 && (
                <div className="mt-6">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Images ({form.images.length})</p>
                  <div className="flex gap-3 overflow-x-auto">
                    {form.images.map((img, i) => <img key={i} src={img} alt="" className="w-16 h-16 rounded-xl object-cover shrink-0" onError={e => (e.currentTarget.style.display = 'none')} />)}
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)} className="rounded-2xl h-14 px-8 font-black text-[10px] uppercase tracking-widest border-slate-200">← Back</Button>
              <Button onClick={handleSubmit} disabled={submitting}
                className="rounded-2xl bg-green-600 hover:bg-green-700 text-white font-black text-[10px] uppercase tracking-widest h-14 px-12 gap-3">
                {submitting ? <><Building2 className="w-4 h-4 animate-pulse" /> Inserting...</> : <><CheckCircle className="w-4 h-4" /> Confirm & Submit</>}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

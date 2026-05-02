import { useState, useMemo } from 'react';
import { Settings, Save, RefreshCcw, RotateCcw, AlertTriangle, CheckCircle, Lock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

interface SettingsModuleProps {
  onRefresh: () => void;
}

// Predefined schema: key → { type, description, allowedValues? }
const SETTINGS_SCHEMA: Record<string, { type: 'boolean' | 'number' | 'string' | 'select'; description: string; allowed?: string[]; default: any }> = {
  'platform.maintenance_mode': { type: 'boolean', description: 'Enable maintenance mode — platform becomes read-only.', default: false },
  'platform.allow_new_registrations': { type: 'boolean', description: 'Allow new user registrations.', default: true },
  'listings.auto_approve': { type: 'boolean', description: 'Automatically approve submitted listings without admin review.', default: false },
  'listings.max_images_per_listing': { type: 'number', description: 'Maximum images allowed per listing.', default: 5 },
  'verification.require_phone': { type: 'boolean', description: 'Require phone number for landlord verification.', default: true },
  'reports.auto_flag_threshold': { type: 'number', description: 'Auto-flag a target after N reports.', default: 3 },
  'platform.default_currency': { type: 'select', description: 'Default currency for listings.', allowed: ['KES', 'USD', 'EUR'], default: 'KES' },
};

export function SettingsModule({ onRefresh }: SettingsModuleProps) {
  const { toast } = useToast();
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [savedSettings, setSavedSettings] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState<string | null>(null);
  const [history, setHistory] = useState<Array<{ key: string; old: any; new: any; time: string }>>([]);

  const loadSettings = async () => {
    if (!supabase) return;
    setLoading(true);
    const { data } = await supabase.from('system_settings').select('*');
    if (data) {
      const mapped: Record<string, any> = {};
      data.forEach(row => { mapped[row.key] = row.value; });
      // Merge with schema defaults
      Object.entries(SETTINGS_SCHEMA).forEach(([key, schema]) => {
        if (!(key in mapped)) mapped[key] = schema.default;
      });
      setSettings(mapped);
      setSavedSettings({ ...mapped });
    }
    setLoading(false);
  };

  useMemo(() => { loadSettings(); }, []);

  const hasChanges = useMemo(() => {
    return Object.keys(SETTINGS_SCHEMA).some(k => JSON.stringify(settings[k]) !== JSON.stringify(savedSettings[k]));
  }, [settings, savedSettings]);

  const validateAndSave = async (key: string) => {
    const schema = SETTINGS_SCHEMA[key];
    if (!schema) {
      toast({ title: 'Unknown setting key — rejected', variant: 'destructive' });
      return;
    }
    const value = settings[key];
    // Type validation
    if (schema.type === 'number' && (isNaN(Number(value)) || Number(value) < 0)) {
      toast({ title: 'Invalid value', description: 'Must be a non-negative number.', variant: 'destructive' });
      return;
    }
    if (schema.type === 'select' && schema.allowed && !schema.allowed.includes(value)) {
      toast({ title: 'Invalid value', description: `Must be one of: ${schema.allowed.join(', ')}`, variant: 'destructive' });
      return;
    }
    if (!supabase) return;
    setSaving(key);
    const old = savedSettings[key];
    const { error } = await supabase.from('system_settings').upsert({ key, value });
    if (error) {
      toast({ title: 'Save failed', description: error.message, variant: 'destructive' });
      setSaving(null);
      return;
    }
    // Audit log
    await supabase.from('admin_audit_logs').insert({ action: 'SETTING_UPDATE', target_id: key, target_type: 'setting', metadata: { old, new: value } });
    setHistory(prev => [{ key, old, new: value, time: new Date().toISOString() }, ...prev].slice(0, 20));
    setSavedSettings(prev => ({ ...prev, [key]: value }));
    toast({ title: 'Setting saved ✓', description: `${key} updated.` });
    setSaving(null);
    onRefresh();
  };

  const rollback = (key: string, oldValue: any) => {
    setSettings(prev => ({ ...prev, [key]: oldValue }));
    toast({ title: 'Rolled back', description: `${key} reverted to previous value.` });
  };

  const set = (key: string, value: any) => setSettings(prev => ({ ...prev, [key]: value }));

  return (
    <div className="space-y-10 pb-20 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <div>
          <h2 className="font-heading text-4xl font-black tracking-tight text-[#0F3D91] uppercase leading-none">Settings</h2>
          <p className="text-slate-500 font-medium text-sm mt-2 italic opacity-75">system_settings — schema-validated, versioned, with rollback capability.</p>
        </div>
        <div className="flex items-center gap-3">
          {hasChanges && (
            <Badge className="bg-amber-50 text-amber-700 border-amber-200 rounded-xl font-black text-[10px] uppercase tracking-widest px-4 py-2">
              <AlertTriangle className="w-3 h-3 mr-2" /> Unsaved changes
            </Badge>
          )}
          <Button onClick={loadSettings} variant="outline" className="rounded-2xl h-14 px-6 font-black text-[10px] uppercase tracking-widest gap-2 border-slate-200">
            <RefreshCcw className="w-4 h-4" /> Reload
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-32 bg-white rounded-[3rem] border border-slate-100 shadow-2xl">
              <RefreshCcw className="w-8 h-8 text-slate-300 animate-spin" />
            </div>
          ) : (
            Object.entries(SETTINGS_SCHEMA).map(([key, schema]) => {
              const isDirty = JSON.stringify(settings[key]) !== JSON.stringify(savedSettings[key]);
              const isSaving = saving === key;
              const groups = key.split('.')[0];
              return (
                <div key={key} className={cn("bg-white border border-slate-100 rounded-[2rem] p-8 shadow-xl shadow-slate-200/20 transition-all", isDirty && "border-amber-200 shadow-amber-100/40")}>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <Badge className="bg-slate-100 text-slate-600 border-none rounded-lg text-[9px] font-black uppercase px-2">{groups}</Badge>
                        <code className="text-xs font-black text-slate-800">{key}</code>
                        {isDirty && <Badge className="bg-amber-50 text-amber-600 border-none rounded-lg text-[9px] font-black uppercase px-2">Modified</Badge>}
                      </div>
                      <p className="text-sm text-slate-500 font-medium">{schema.description}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {schema.type === 'boolean' ? (
                        <button onClick={() => set(key, !settings[key])}
                          className={cn("relative w-16 h-8 rounded-full transition-all border-2 shrink-0",
                            settings[key] ? "bg-[#0F3D91] border-[#0F3D91]" : "bg-slate-100 border-slate-200")}>
                          <div className={cn("absolute top-1 w-5 h-5 rounded-full bg-white shadow-md transition-all", settings[key] ? "left-9" : "left-1")} />
                        </button>
                      ) : schema.type === 'select' ? (
                        <select value={settings[key] ?? schema.default} onChange={e => set(key, e.target.value)}
                          className="px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-black focus:outline-none focus:ring-4 focus:ring-blue-500/10">
                          {schema.allowed?.map(v => <option key={v} value={v}>{v}</option>)}
                        </select>
                      ) : (
                        <input type="number" value={settings[key] ?? schema.default} onChange={e => set(key, Number(e.target.value))}
                          className="w-24 px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-black focus:outline-none focus:ring-4 focus:ring-blue-500/10 text-center" />
                      )}
                      {isDirty && (
                        <Button size="sm" variant="ghost" onClick={() => rollback(key, savedSettings[key])}
                          className="rounded-xl h-10 w-10 p-0 text-slate-400 hover:text-amber-600 hover:bg-amber-50">
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                      )}
                      <Button size="sm" onClick={() => validateAndSave(key)} disabled={isSaving || !isDirty}
                        className={cn("rounded-xl h-10 px-4 font-black text-[9px] uppercase gap-2",
                          isDirty ? "bg-[#0F3D91] hover:bg-[#0A2560] text-white" : "bg-slate-100 text-slate-400 cursor-not-allowed")}>
                        {isSaving ? <RefreshCcw className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                        Save
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center"><Lock className="w-5 h-5 text-[#0F3D91]" /></div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Schema Contracts</p>
            </div>
            <div className="space-y-3">
              {Object.entries(SETTINGS_SCHEMA).map(([key, schema]) => (
                <div key={key} className="flex items-center justify-between py-2 border-b border-slate-50">
                  <code className="text-[10px] font-black text-slate-600 truncate max-w-[130px]">{key}</code>
                  <Badge className={cn("rounded-lg font-black text-[9px] uppercase px-2 border-none",
                    schema.type === 'boolean' ? "bg-blue-50 text-blue-600" : schema.type === 'number' ? "bg-green-50 text-green-600" : schema.type === 'select' ? "bg-purple-50 text-purple-600" : "bg-slate-100 text-slate-600")}>
                    {schema.type}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {history.length > 0 && (
            <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/20">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Change History</p>
              <div className="space-y-4">
                {history.slice(0, 8).map((h, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-400 mt-1.5 shrink-0" />
                    <div className="min-w-0">
                      <code className="text-[10px] font-black text-slate-700 block truncate">{h.key}</code>
                      <p className="text-[9px] text-slate-400 font-bold">{JSON.stringify(h.old)} → {JSON.stringify(h.new)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

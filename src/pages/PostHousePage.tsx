import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

const amenitiesOptions = ['Water', 'Electricity', 'WiFi', 'Parking', 'Security', 'Furnished', 'Hot Water', 'Balcony', 'CCTV'];

export default function PostHousePage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [amenities, setAmenities] = useState<string[]>([]);

  if (!isAuthenticated) {
    return (
      <div className="px-4 py-12 text-center">
        <h1 className="font-heading font-bold text-xl mb-2">Login Required</h1>
        <p className="text-muted-foreground text-sm mb-4">You need to log in to post a house listing.</p>
        <Button onClick={() => navigate('/account')}>Go to Login</Button>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: 'House posted!', description: 'Your listing has been submitted for review.' });
    navigate('/houses');
  };

  return (
    <div className="px-4 py-4">
      <h1 className="font-heading font-bold text-xl mb-4">Post a House</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div><Label>Title</Label><Input placeholder="e.g. Spacious Bedsitter near Campus" required /></div>
        <div>
          <Label>House Type</Label>
          <Select required>
            <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="bedsitter">Bedsitter</SelectItem>
              <SelectItem value="single">Single Room</SelectItem>
              <SelectItem value="1br">1 Bedroom</SelectItem>
              <SelectItem value="2br">2 Bedroom</SelectItem>
              <SelectItem value="3br">3 Bedroom</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><Label>Rent (KSh)</Label><Input type="number" placeholder="5000" required /></div>
          <div><Label>Deposit (KSh)</Label><Input type="number" placeholder="5000" required /></div>
        </div>
        <div><Label>Location</Label><Input placeholder="e.g. Kangaru Road" required /></div>
        <div>
          <Label className="mb-2 block">Amenities</Label>
          <div className="grid grid-cols-2 gap-2">
            {amenitiesOptions.map(a => (
              <label key={a} className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={amenities.includes(a)}
                  onCheckedChange={(checked) => {
                    setAmenities(prev => checked ? [...prev, a] : prev.filter(x => x !== a));
                  }}
                />
                {a}
              </label>
            ))}
          </div>
        </div>
        <div><Label>Description</Label><Textarea placeholder="Describe your house..." required /></div>
        <div><Label>Phone Number</Label><Input placeholder="+254..." required /></div>
        <div><Label>WhatsApp Number</Label><Input placeholder="+254..." required /></div>
        <Button type="submit" className="w-full">Submit Listing</Button>
      </form>
    </div>
  );
}

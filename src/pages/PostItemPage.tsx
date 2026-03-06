import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export default function PostItemPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <div className="px-4 py-12 text-center">
        <h1 className="font-heading font-bold text-xl mb-2">Login Required</h1>
        <p className="text-muted-foreground text-sm mb-4">You need to log in to sell an item.</p>
        <Button onClick={() => navigate('/account')}>Go to Login</Button>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: 'Item posted!', description: 'Your listing is now live.' });
    navigate('/marketplace');
  };

  return (
    <div className="px-4 py-4">
      <h1 className="font-heading font-bold text-xl mb-4">Sell an Item</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div><Label>Title</Label><Input placeholder="e.g. Study Desk - Solid Wood" required /></div>
        <div>
          <Label>Category</Label>
          <Select required>
            <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="furniture">Furniture</SelectItem>
              <SelectItem value="electronics">Electronics</SelectItem>
              <SelectItem value="books">Books</SelectItem>
              <SelectItem value="appliances">Appliances</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><Label>Price (KSh)</Label><Input type="number" placeholder="1500" required /></div>
          <div>
            <Label>Condition</Label>
            <Select required>
              <SelectTrigger><SelectValue placeholder="Condition" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="like-new">Like New</SelectItem>
                <SelectItem value="used">Used</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div><Label>Description</Label><Textarea placeholder="Describe your item..." required /></div>
        <div><Label>Phone Number</Label><Input placeholder="+254..." required /></div>
        <div><Label>WhatsApp Number</Label><Input placeholder="+254..." required /></div>
        <Button type="submit" className="w-full">Post Item</Button>
      </form>
    </div>
  );
}

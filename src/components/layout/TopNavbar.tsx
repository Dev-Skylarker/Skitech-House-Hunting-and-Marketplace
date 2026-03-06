import { Search, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

export function TopNavbar() {
  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border px-4 py-3 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-heading font-bold text-sm">S</span>
        </div>
        <span className="font-heading font-bold text-lg text-foreground">Skitech</span>
      </Link>
      <div className="flex items-center gap-3">
        <Link to="/houses" className="p-2 rounded-full hover:bg-muted transition-colors">
          <Search className="w-5 h-5 text-muted-foreground" />
        </Link>
        <button className="p-2 rounded-full hover:bg-muted transition-colors relative">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full" />
        </button>
      </div>
    </header>
  );
}

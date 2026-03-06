import { Outlet } from 'react-router-dom';
import { TopNavbar } from './TopNavbar';
import { BottomNav } from './BottomNav';
import { GlobalFooter } from './GlobalFooter';

export function AppLayout() {
  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      <div className="max-w-[1200px] mx-auto w-full min-h-screen flex flex-col">
        <TopNavbar />
        <main className="flex-1">
          <Outlet />
        </main>
        <GlobalFooter />
        <BottomNav />
      </div>
    </div>
  );
}

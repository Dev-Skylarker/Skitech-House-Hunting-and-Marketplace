import {
    Building2, ShoppingBag, UserPlus, Heart, MessageSquare,
    Search, AlertTriangle, Zap, Activity, Map as MapIcon,
    ShieldCheck, FileText, Globe
} from 'lucide-react';

export const liveActivities = [
    { id: 1, type: 'search', user: 'Alice M.', detail: 'Searching for "3BHK near Main St"', time: 'Just now', icon: Search, color: 'text-blue-500' },
    { id: 2, type: 'favorite', user: 'John K.', detail: 'Added "Riverstone Villa" to wishlist', time: '2 mins ago', icon: Heart, color: 'text-red-500' },
    { id: 3, type: 'inquiry', user: 'Unknown Guest', detail: 'Sent inquiry for Bedsitter #402', time: '5 mins ago', icon: MessageSquare, color: 'text-green-500' },
    { id: 4, type: 'auth', user: 'Sarah L.', detail: 'Registered as a New Resident', time: '12 mins ago', icon: UserPlus, color: 'text-[#0F3D91]' },
    { id: 5, type: 'listing', user: 'Admin Override', detail: 'Bulk synced items from Marketplace API', time: '15 mins ago', icon: Globe, color: 'text-[#FF7A00]' },
    { id: 6, type: 'bidding', user: 'Property #201', detail: 'New bid received: KSh 12.5M from User #98', time: '18 mins ago', icon: Zap, color: 'text-yellow-600' },
];

export const systemAlerts = [
    { id: 1, title: 'Latency Warning', detail: 'DB response time spiked to 450ms in Sector 4', level: 'warning', icon: AlertTriangle },
    { id: 2, title: 'Unauthorized Access', detail: 'Blocked 3 suspicious login attempts from IP: 192.168.1.1', level: 'critical', icon: Zap },
    { id: 3, title: 'Sync Success', detail: 'MLS Inventory synchronization completed successfully.', level: 'success', icon: ShieldCheck },
];

export const aiInsights = [
    {
        id: 1,
        title: 'Value Appreciation Forecast',
        detail: 'Embu North properties are expected to rise by 8.4% in the next quarter due to town expansion.',
        confidence: '92%',
        type: 'positive'
    },
    {
        id: 2,
        title: 'Time on Market Prediction',
        detail: '1BR units are selling 15% faster than last month. Current average: 12 days.',
        confidence: '88%',
        type: 'neutral'
    },
    {
        id: 3,
        title: 'Neighborhood Growth',
        detail: 'High demand detected in Sector 2. Recommend prioritizing landlord outreach there.',
        confidence: '95%',
        type: 'action'
    }
];

export const leadScores = [
    { name: 'Alice Mutua', email: 'alice.m@example.com', score: 92, intent: 'High - Ready to Sign', behavior: 'Viewed 4 properties in Sector 3' },
    { name: 'David Kimani', email: 'd.kimani@mail.com', score: 78, intent: 'Medium - Researching', behavior: 'Comparing 2BR and 3BR units' },
    { name: 'Grace Wambui', email: 'grace.w@gmail.com', score: 45, intent: 'Low - Window Shopping', behavior: 'Price filtering only' },
];

export const marketHeatmap = [
    { zone: 'Sector 1', demand: 45, supply: 12, label: 'Stable' },
    { zone: 'Sector 2', demand: 98, supply: 8, label: 'High Demand' },
    { zone: 'Sector 3', demand: 32, supply: 45, label: 'Oversupply' },
    { zone: 'Sector 4', demand: 76, supply: 5, label: 'Hot Area' },
];

export const inventoryStats = {
    totalHouses: 142,
    totalItems: 384,
    syncedRate: '99.4%',
    pendingVerifications: 5,
    activeBids: 12
};

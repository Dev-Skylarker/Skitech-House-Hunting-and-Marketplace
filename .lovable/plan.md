
# Skitech House Hunting – UoEM (Phase 1: Frontend + Mock Data)

## Design System
- **Colors**: Deep Blue (#0F3D91), Teal (#00B4D8), Orange (#FF7A00), Background (#F7F9FC)
- **Typography**: Poppins for headings, Inter for body text
- **Mobile-first** layout with sticky bottom navigation

## App Structure & Navigation
- **Bottom Navigation Bar** (mobile): Home, Houses, Marketplace, Saved, Account
- **Top Navbar**: Logo, search icon, notification bell

## Pages to Build

### 1. Landing Page (Home)
- Hero section with search bar and tagline ("Find your perfect student home near UoEM")
- Featured houses carousel
- Category shortcuts (Bedsitter, Single, 1BR, 2BR)
- Marketplace highlights section
- PWA install CTA banner

### 2. Houses Page
- Search bar with filter panel (house type, price range, amenities, availability)
- Toggle between grid/list view
- House listing cards with: image, title, price, location, distance badge, verified/new/popular badges, amenity icons
- Sorting options (price, distance, newest)
- Infinite scroll / load more

### 3. House Details Page
- Image carousel/gallery
- Full description, rent, deposit info
- Amenities list with icons
- Landlord info section
- Contact buttons: WhatsApp, Call, SMS
- "Similar Houses" section at bottom

### 4. Marketplace Page
- Category tabs (Furniture, Electronics, Books, Appliances, Other)
- Filter by price, condition (New/Used/Like New)
- Item cards: image, title, price, condition badge, posted time
- Search bar

### 5. Item Details Page
- Image gallery
- Full description, price, condition
- Seller info and contact buttons (WhatsApp, Call, SMS)
- Related items section

### 6. Saved/Favorites Page
- Two tabs: Saved Houses / Saved Items
- Cards with remove-from-favorites option
- Stored in localStorage for guest users

### 7. Post Listing Pages
- **Post House Form**: Title, house type, price, deposit, location, amenities checkboxes, description, images (up to 5), contact info
- **Post Item Form**: Title, category, price, condition, description, images (up to 5), contact info
- Both require login (show login prompt for guests)

### 8. Account Page
- Login/Register section (email/password for now — mock auth)
- My Listings (houses + items)
- Edit/Delete listings
- Settings (notifications, profile)

### 9. Admin Dashboard
- Overview stats cards (total houses, items, users, pending approvals)
- Listings management table (approve/reject/edit/delete)
- User management table
- Analytics charts: views over time, popular categories, price trends (using Recharts)

## Mock Data Layer
- `services/api.ts` with Promise-based functions returning mock data
- Mock houses, items, users, and analytics events
- Placeholder images using public domain housing images
- Data structured to match the final database schema (ready for backend swap)

## PWA Setup
- Install `vite-plugin-pwa`
- Service worker with offline caching for UI assets
- App manifest with UoEM branding
- Install prompt component on landing page
- Standalone display mode

## Ranking & Search (Frontend)
- House ranking: weighted score from recency + popularity + verification
- Marketplace ranking: recency + engagement
- Real-time search filtering on title, location, category
- Search suggestions dropdown

## Key Interactions
- Skeleton loaders while data loads
- Swipeable image galleries
- Toast notifications for actions (saved, posted, deleted)
- Lazy-loaded images
- Responsive design: mobile-first, works on tablet/desktop

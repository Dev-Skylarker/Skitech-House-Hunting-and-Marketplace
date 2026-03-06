# UOEM Home Finder

Your comprehensive real estate platform for discovering and listing properties.

## 🏠 About

UOEM Home Finder is a modern digital real estate platform that simplifies the home hunting experience. Whether you're looking for your dream house or listing a property, our platform provides intuitive tools and a seamless interface to connect buyers and sellers.

### Key Features

- **Browse Properties** — Explore a curated selection of available houses with detailed information and high-quality imagery
- **Property Details** — View comprehensive house listings with specifications, pricing, and seller information
- **List Your Property** — Easily post your property for sale with an intuitive listing form
- **Marketplace** — Buy and sell home-related items and services
- **Save Favorites** — Keep track of properties you're interested in
- **User Accounts** — Manage your profile, listings, and preferences
- **Admin Dashboard** — Monitor platform activity and manage content (admin only)

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or your preferred package manager

### Installation

```sh
# Clone the repository
git clone <YOUR_GIT_URL>
cd uoem-home-finder

# Install dependencies
npm i

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

## 📖 Available Scripts

```sh
# Development server with hot reload
npm run dev

# Build for production
npm build

# Build in development mode
npm run build:dev

# Lint code
npm run lint

# Preview production build
npm run preview

# Run tests
npm test

# Watch tests during development
npm run test:watch
```

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| **React 18** | UI framework |
| **TypeScript** | Type-safe JavaScript |
| **Vite** | Lightning-fast build tool and dev server |
| **React Router** | Client-side routing |
| **Tailwind CSS** | Utility-first CSS framework |
| **shadcn/ui** | High-quality UI components |
| **React Hook Form** | Form state management |
| **Zod** | Schema validation |
| **React Query** | Data fetching and caching |
| **Recharts** | Data visualization |
| **Lucide React** | Icon library |

## 📁 Project Structure

```
src/
├── pages/               # Route pages
│   ├── Index.tsx        # Home page
│   ├── HousesPage.tsx   # Browse properties
│   ├── HouseDetailsPage.tsx
│   ├── PostHousePage.tsx
│   ├── MarketplacePage.tsx
│   ├── PostItemPage.tsx
│   ├── SavedPage.tsx
│   ├── AccountPage.tsx
│   └── AdminDashboard.tsx
├── components/          # Reusable components
│   ├── HouseCard.tsx
│   ├── ItemCard.tsx
│   ├── layout/          # Layout components
│   └── ui/              # shadcn/ui components
├── contexts/            # React contexts
├── hooks/               # Custom React hooks
├── services/            # API and utility services
├── types/               # TypeScript type definitions
├── lib/                 # Helper utilities
└── main.tsx            # App entry point
```

## 🔧 Development

### Working Locally with Your IDE

1. Clone the repository and navigate to the project directory
2. Install dependencies: `npm i`
3. Start the development server: `npm run dev`
4. Open your IDE and make changes
5. Changes will automatically reload in the browser

### Code Quality

- **Linting** — Run `npm run lint` to check code quality
- **Testing** — Run `npm test` for unit tests

## 📦 Deployment

The application is ready to deploy to any static hosting service:

- **Vercel** — Automatic deployments from Git
- **Netlify** — Connect your repository for CI/CD
- **GitHub Pages** — Static hosting for the built application
- **Docker** — Containerize and deploy anywhere

Build the application for production:

```sh
npm run build
# Output will be in the dist/ directory
```

## 🤝 Contributing

1. Create a new branch for your feature: `git checkout -b feature/my-feature`
2. Make your changes and test thoroughly
3. Commit with clear messages: `git commit -m "Add my feature"`
4. Push to your branch and create a pull request

## 📝 License

This project is private and proprietary.

## 📞 Support

For questions or issues, please reach out to the development team.

---

**Built with ❤️ for home hunters everywhere**

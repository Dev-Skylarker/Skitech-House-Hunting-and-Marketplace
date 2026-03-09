import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

// Property Card Skeleton
export function PropertyCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <Skeleton className="w-full h-48" />
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-6 w-20" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Marketplace Item Card Skeleton
export function ItemCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <Skeleton className="w-full h-40" />
      <div className="p-3 space-y-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-4 w-14" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}

// Property Details Page Skeleton
export function PropertyDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      {/* Image Carousel Skeleton */}
      <div className="relative aspect-square bg-slate-100">
        <Skeleton className="w-full h-full" />
        <div className="absolute top-4 left-4 right-4 flex justify-between">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-10" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="px-4 py-4 space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-24" />
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="text-center p-3 bg-muted rounded-lg">
              <Skeleton className="h-6 w-8 mx-auto mb-1" />
              <Skeleton className="h-4 w-12 mx-auto" />
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>

        <div className="space-y-3">
          <Skeleton className="h-5 w-16" />
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-muted rounded-lg p-4 space-y-3">
          <Skeleton className="h-5 w-20" />
          <div className="flex gap-2">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 flex-1" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Marketplace Item Details Skeleton
export function ItemDetailsSkeleton() {
  return (
    <div className="pb-4">
      {/* Image Carousel Skeleton */}
      <div className="relative aspect-square bg-slate-100">
        <Skeleton className="w-full h-full" />
        <div className="absolute top-4 left-4 right-4 flex justify-between">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-10" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="px-4 py-4 space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-7 w-full" />
          <Skeleton className="h-7 w-32" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>

        <div className="bg-muted rounded-lg p-4 space-y-3">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-5 w-32" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-10 w-full" />
            <div className="flex gap-2">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 flex-1" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// User Profile Skeleton
export function UserProfileSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="text-center p-4 bg-muted rounded-lg">
            <Skeleton className="h-8 w-8 mx-auto mb-2" />
            <Skeleton className="h-4 w-16 mx-auto" />
            <Skeleton className="h-3 w-12 mx-auto mt-1" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Notifications Skeleton
export function NotificationsSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="bg-white p-4 rounded-lg border">
          <div className="flex items-start gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Listings Grid Skeleton
export function ListingsGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <PropertyCardSkeleton key={i} />
      ))}
    </div>
  );
}

// Marketplace Grid Skeleton
export function MarketplaceGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <ItemCardSkeleton key={i} />
      ))}
    </div>
  );
}

// Loading Spinner Component
export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-[#0F3D91] ${sizeClasses[size]}`} />
  );
}

// Full Page Loading
export function FullPageLoading() {
  return (
    <div className="min-h-screen bg-[#F7F9FC] flex items-center justify-center">
      <div className="text-center space-y-4">
        <LoadingSpinner size="lg" />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

// Table Skeleton
export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-8" />
        ))}
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} className="h-6" />
          ))}
        </div>
      ))}
    </div>
  );
}

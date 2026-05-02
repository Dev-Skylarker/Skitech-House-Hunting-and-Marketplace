/**
 * @deprecated This file contained hardcoded mock data. 
 * Use apiService.ts for all database-backed operations.
 */

export const mockHouses: any[] = [];
export const mockItems: any[] = [];
export const mockUsers: any[] = [];
export const mockNotifications: any[] = [];
export const mockRatings: any[] = [];

export const api = {
  getHouses: async () => [],
  getHouseById: async () => null,
  getItems: async () => [],
  getItemById: async () => null,
  getAnalyticsStats: async () => ({
    totalHouses: 0,
    totalItems: 0,
    totalUsers: 0,
    pendingApprovals: 0,
    viewsThisWeek: 0,
    newListingsThisWeek: 0,
  }),
  getNotifications: async () => [],
  markNotificationAsRead: async () => null,
  deleteNotification: async () => false,
  muteNotification: async () => null,
  getRatingsForHouse: async () => [],
  getRatingsForLandlord: async () => [],
  addRating: async () => null,
};

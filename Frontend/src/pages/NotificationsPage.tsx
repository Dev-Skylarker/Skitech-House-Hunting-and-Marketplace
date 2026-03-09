import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Bell, Trash2, Volume2, VolumeX, ArrowUp, ArrowDown, Heart, Eye,
  CheckCircle2, AlertCircle, Clock, X, ArrowLeft, CheckSquare, Square
} from 'lucide-react';
import { PlayCircle } from 'lucide-react';
import type { Notification } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type FilterType = 'all' | 'unread' | 'archived' | 'muted';
type SortType = 'newest' | 'oldest';

export default function NotificationsPage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { notifications, markAsRead, markAsUnread, deleteNotification, muteNotification } = useNotifications();
  const [filter, setFilter] = useState<FilterType>('all');
  const [sort, setSort] = useState<SortType>('newest');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [requestedPushPerms, setRequestedPushPerms] = useState(false);
  const [viewingNotif, setViewingNotif] = useState<Notification | null>(null);

  // Default notification for non-authenticated users
  const defaultNotification: Notification = {
    id: 'default-welcome',
    userId: 'guest',
    title: 'Welcome to Skitech Notifications',
    description: 'Sign in to access personalized notifications, account updates, and real-time alerts for your saved properties and marketplace items.',
    type: 'system',
    read: false,
    muted: false,
    createdAt: new Date().toISOString()
  };

  useEffect(() => {
    // Request push notification permission on mount (once per session) - only for authenticated users
    if (!requestedPushPerms && isAuthenticated && 'Notification' in window && Notification.permission === 'default') {
      setRequestedPushPerms(true);
    }
  }, [requestedPushPerms, isAuthenticated]);

  // Filter notifications
  let filtered = isAuthenticated ? notifications : [defaultNotification];
  if (filter === 'unread') {
    filtered = filtered.filter(n => !n.read && !n.muted);
  } else if (filter === 'archived') {
    filtered = filtered.filter(n => n.read);
  } else if (filter === 'muted') {
    filtered = filtered.filter(n => n.muted);
  }

  // Sort notifications
  const sorted = [...filtered].sort((a, b) => {
    const timeA = new Date(a.createdAt).getTime();
    const timeB = new Date(b.createdAt).getTime();
    return sort === 'newest' ? timeB - timeA : timeA - timeB;
  });

  // Group by date
  const groupedByDate = sorted.reduce<Record<string, Notification[]>>((acc, notif) => {
    const date = new Date(notif.createdAt);
    const isToday = new Date().toDateString() === date.toDateString();
    const isThisWeek = new Date().getTime() - date.getTime() < 7 * 24 * 60 * 60 * 1000;

    let groupKey = 'Older';
    if (isToday) groupKey = 'Today';
    else if (isThisWeek) groupKey = 'This week';

    if (!acc[groupKey]) acc[groupKey] = [];
    acc[groupKey].push(notif);
    return acc;
  }, {});

  const dateOrder = ['Today', 'This week', 'Older'];
  const grouped = dateOrder.filter(key => groupedByDate[key]).reduce<Record<string, Notification[]>>((acc, key) => {
    acc[key] = groupedByDate[key];
    return acc;
  }, {});

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'favorite_added':
        return <Heart className="w-4 h-4 text-red-500" />;
      case 'house_viewed':
        return <Eye className="w-4 h-4 text-blue-500" />;
      case 'listing_approved':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'listing_rejected':
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) newSelected.delete(id);
    else newSelected.add(id);
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === sorted.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(sorted.map(n => n.id)));
    }
  };

  const markAllAsRead = async () => {
    for (const id of selectedIds) {
      await markAsRead(id);
    }
    setSelectedIds(new Set());
  };

  const markAllAsUnread = async () => {
    for (const id of selectedIds) {
      await markAsUnread(id);
    }
    setSelectedIds(new Set());
  };

  const deleteAll = async () => {
    for (const id of selectedIds) {
      await deleteNotification(id);
    }
    setSelectedIds(new Set());
  };

  const muteAll = async () => {
    for (const id of selectedIds) {
      await muteNotification(id);
    }
    setSelectedIds(new Set());
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] px-4 py-6 pb-24">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-xl hover:bg-white shadow-sm border border-slate-100 transition-all active:scale-95"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <h1 className="font-heading font-bold text-2xl">Notifications</h1>
          </div>
          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSelectAll}
                className="text-xs font-bold text-[#0F3D91] gap-2 h-9 px-3 rounded-lg hover:bg-blue-50"
              >
                {selectedIds.size === sorted.length && sorted.length > 0 ? (
                  <CheckSquare className="w-4 h-4 text-[#FF7A00]" />
                ) : (
                  <Square className="w-4 h-4" />
                )}
                {selectedIds.size === sorted.length && sorted.length > 0 ? 'Deselect All' : 'Select All'}
              </Button>
            )}
            <button
              onClick={() => setSort(sort === 'newest' ? 'oldest' : 'newest')}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              title={`Sort ${sort === 'newest' ? 'oldest first' : 'newest first'}`}
            >
              {sort === 'newest' ? (
                <ArrowDown className="w-5 h-5 text-muted-foreground" />
              ) : (
                <ArrowUp className="w-5 h-5 text-muted-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Push Notification Banner */}
        {typeof Notification !== 'undefined' && Notification.permission === 'default' && (
          <Card className="border-none shadow-sm rounded-lg mb-6 bg-blue-50 border border-blue-200">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div>
                  <p className="font-heading font-semibold text-sm text-blue-900">Enable push notifications</p>
                  <p className="text-xs text-blue-800">Get instant alerts on your device</p>
                </div>
              </div>
              <button
                onClick={() => {
                  if (Notification.permission === 'default') {
                    Notification.requestPermission();
                  }
                }}
                className="px-3 py-1 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700"
              >
                Enable
              </button>
            </CardContent>
          </Card>
        )}

        {/* Filter Tabs */}
        <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterType)} className="mb-6">
          <TabsList className="grid grid-cols-4 w-full bg-muted/60 rounded-lg p-1 h-11">
            <TabsTrigger
              value="all"
              className="rounded-md text-sm data-[state=active]:bg-white data-[state=active]:text-[#FF7A00] data-[state=active]:shadow-sm"
            >
              All
            </TabsTrigger>
            <TabsTrigger
              value="unread"
              className="rounded-md text-sm data-[state=active]:bg-white data-[state=active]:text-[#FF7A00] data-[state=active]:shadow-sm"
            >
              Unread
            </TabsTrigger>
            <TabsTrigger
              value="archived"
              className="rounded-md text-sm data-[state=active]:bg-white data-[state=active]:text-[#FF7A00] data-[state=active]:shadow-sm"
            >
              Read
            </TabsTrigger>
            <TabsTrigger
              value="muted"
              className="rounded-md text-sm data-[state=active]:bg-white data-[state=active]:text-[#FF7A00] data-[state=active]:shadow-sm"
            >
              Muted
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Bulk Actions */}
        {selectedIds.size > 0 && isAuthenticated && (
          <Card className="border-none shadow-sm rounded-lg mb-6 bg-[#0F3D91]/5 border border-[#0F3D91]/20">
            <CardContent className="p-4 flex items-center justify-between">
              <p className="text-sm font-medium">{selectedIds.size} selected</p>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={markAllAsRead}
                  className="h-8 text-[11px] rounded-lg hover:bg-[#0F3D91]/10 px-2"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Read
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={markAllAsUnread}
                  className="h-8 text-[11px] rounded-lg hover:bg-[#0F3D91]/10 px-2"
                >
                  <Clock className="w-3.5 h-3.5 mr-1" /> Unread
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={muteAll}
                  className="h-8 text-[11px] rounded-lg hover:bg-[#0F3D91]/10 px-2"
                >
                  <VolumeX className="w-3.5 h-3.5 mr-1" /> Mute
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={deleteAll}
                  className="h-8 text-xs rounded-lg hover:bg-destructive/10 text-destructive"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {sorted.length === 0 && (
          <Card className="border-none shadow-sm rounded-lg mt-8">
            <CardContent className="p-12 flex flex-col items-center justify-center text-center">
              <Bell className="w-12 h-12 text-muted-foreground/50 mb-4" />
              <h3 className="font-heading font-semibold text-lg text-foreground mb-1">No notifications</h3>
              <p className="text-sm text-muted-foreground">
                {filter === 'all' ? 'You\'re all caught up!' : `No ${filter} notifications`}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Notifications List */}
        <div className="space-y-6">
          {Object.entries(grouped).map(([dateGroup, notifs]) => (
            <div key={dateGroup} className="space-y-2">
              {/* Date Header */}
              <div className="flex items-center gap-2 px-2 py-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <h3 className="font-heading font-semibold text-sm text-muted-foreground">{dateGroup}</h3>
              </div>

              {/* Notification Cards */}
              <div className="space-y-2">
                {notifs.map(notif => (
                  <Card
                    key={notif.id}
                    className={`border-none rounded-lg transition-all cursor-pointer ${!notif.read && !notif.muted
                      ? 'bg-blue-50 border border-blue-200'
                      : 'bg-card'
                      } ${selectedIds.has(notif.id) ? 'ring-2 ring-[#0F3D91]' : ''}`}
                    onClick={() => {
                      setViewingNotif(notif);
                      if (!notif.read && !notif.muted) {
                        markAsRead(notif.id);
                      }
                    }}
                  >
                    <CardContent className="p-3 flex items-start gap-3">
                      {/* Checkbox - Only for authenticated users */}
                      {isAuthenticated && (
                        <div onClick={(e) => e.stopPropagation()}>
                          <Checkbox
                            checked={selectedIds.has(notif.id)}
                            onCheckedChange={() => toggleSelect(notif.id)}
                            className="mt-1 rounded"
                          />
                        </div>
                      )}

                      {/* Icon */}
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notif.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className={`font-semibold text-sm ${!notif.read && !notif.muted ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {notif.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {notif.description}
                        </p>
                        {notif.id === 'default-welcome' && !isAuthenticated && (
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate('/account');
                            }}
                            className="mt-3 bg-[#0F3D91] hover:bg-[#FF7A00] text-white rounded-xl h-9 px-4 font-bold text-xs gap-2 shadow-lg hover:shadow-[#FF7A00]/20 transition-all duration-300"
                          >
                            <PlayCircle className="w-4 h-4" />
                            Sign In to Access More Features
                          </Button>
                        )}
                        {notif.muted && (
                          <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                            <VolumeX className="w-3 h-3" /> Muted
                          </p>
                        )}
                      </div>

                      {/* Unread Indicator */}
                      {!notif.read && !notif.muted && (
                        <div className="w-2 h-2 rounded-full bg-[#0F3D91] flex-shrink-0 mt-2" />
                      )}

                      {/* Actions - Only for authenticated users */}
                      {isAuthenticated && (
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {notif.read && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsUnread(notif.id);
                              }}
                              className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                              title="Mark as unread"
                            >
                              <Clock className="w-4 h-4 text-muted-foreground" />
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              muteNotification(notif.id);
                            }}
                            className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                            title={notif.muted ? 'Unmute' : 'Mute'}
                          >
                            {notif.muted ? (
                              <Volume2 className="w-4 h-4 text-[#0F3D91]" />
                            ) : (
                              <VolumeX className="w-4 h-4 text-muted-foreground" />
                            )}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notif.id);
                            }}
                            className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Notification Modal */}
      <Dialog open={!!viewingNotif} onOpenChange={() => setViewingNotif(null)}>
        <DialogContent className="sm:max-w-[425px] rounded-[32px] border-none shadow-2xl p-0 overflow-hidden">
          <div className="bg-[#0F3D91] h-32 relative flex items-center justify-center">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Bell className="w-24 h-24 text-white" />
            </div>
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-2xl z-10">
              {viewingNotif ? getNotificationIcon(viewingNotif.type) : <Bell className="w-8 h-8 text-white" />}
            </div>
          </div>
          <div className="p-8 space-y-4">
            <DialogHeader className="text-left">
              <DialogTitle className="font-heading font-black text-2xl tracking-tight text-slate-900 leading-tight">
                {viewingNotif?.title}
              </DialogTitle>
              <p className="text-[10px] font-bold text-[#FF7A00] tracking-widest uppercase mt-2">
                {viewingNotif && new Date(viewingNotif.createdAt).toLocaleDateString(undefined, {
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </DialogHeader>
            <DialogDescription className="text-slate-600 text-lg leading-relaxed">
              {viewingNotif?.description}
            </DialogDescription>

            <div className="pt-6 grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  if (viewingNotif) muteNotification(viewingNotif.id);
                  setViewingNotif(null);
                }}
                className="rounded-xl h-12 border-slate-200 font-heading font-bold text-slate-600 hover:bg-slate-50 gap-2"
              >
                {viewingNotif?.muted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                {viewingNotif?.muted ? 'Unmute' : 'Mute'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  if (viewingNotif) deleteNotification(viewingNotif.id);
                  setViewingNotif(null);
                }}
                className="rounded-xl h-12 border-red-100 text-red-600 font-heading font-bold hover:bg-red-50 hover:border-red-200 gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
              {viewingNotif?.id === 'guest-hook' ? (
                <Button
                  onClick={() => {
                    setViewingNotif(null);
                    navigate('/guide');
                  }}
                  className="col-span-2 bg-[#0F3D91] hover:bg-[#FF7A00] text-white rounded-xl h-12 font-heading font-bold shadow-lg shadow-blue-900/10 hover:shadow-[#FF7A00]/20 transition-all duration-300"
                >
                  View System Guide
                </Button>
              ) : (
                <Button
                  onClick={() => setViewingNotif(null)}
                  className="col-span-2 bg-[#0F3D91] hover:bg-[#FF7A00] text-white rounded-xl h-12 font-heading font-bold shadow-lg shadow-blue-900/10 hover:shadow-[#FF7A00]/20 transition-all duration-300"
                >
                  Got it
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

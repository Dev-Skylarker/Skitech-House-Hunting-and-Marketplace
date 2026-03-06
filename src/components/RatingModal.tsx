import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { X, Star, BarChart3 } from 'lucide-react';

interface RatingModalProps {
  houseId: string;
  houseName: string;
  landlordName: string;
  onClose: () => void;
  onSubmit: (rating: number, landlordRating: number, review: string) => Promise<void>;
}

const EMOJI_FEEDBACK: Record<number, { emoji: string; text: string; color: string }> = {
  1: { emoji: '😞', text: 'Needs improvement', color: 'text-red-600' },
  2: { emoji: '😐', text: 'Fair', color: 'text-orange-600' },
  3: { emoji: '🙂', text: 'Good', color: 'text-yellow-600' },
  4: { emoji: '😊', text: 'Very good', color: 'text-green-600' },
  5: { emoji: '🤩', text: 'Excellent!', color: 'text-blue-600' },
};

export function RatingModal({
  houseId,
  houseName,
  landlordName,
  onClose,
  onSubmit,
}: RatingModalProps) {
  const [rating, setRating] = useState(0);
  const [landlordRating, setLandlordRating] = useState(0);
  const [review, setReview] = useState('');
  const [showLandlordRating, setShowLandlordRating] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [categories, setCategories] = useState({
    cleanliness: 0,
    communication: 0,
    accuracy: 0,
    value: 0,
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) return;
    setSubmitting(true);
    try {
      await onSubmit(rating, landlordRating || rating, review);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  const isComplete = rating > 0;
  const feedback = EMOJI_FEEDBACK[rating];

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-end">
      <Card className="w-full border-none rounded-t-3xl shadow-2xl max-w-2xl mx-auto">
        <CardContent className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Rate This House</h2>
              <p className="text-sm text-muted-foreground">{houseName}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* House Rating */}
          <div className="space-y-3">
            <div>
              <Label className="text-sm font-semibold">How was your experience?</Label>
              <p className="text-xs text-muted-foreground mt-1">Rate the house and property</p>
            </div>

            {/* Star Rating */}
            <div className="flex justify-center gap-3 py-4">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="transition-transform transform hover:scale-110"
                >
                  <Star
                    className={`w-12 h-12 transition-colors ${
                      star <= rating
                        ? 'fill-yellow-500 text-yellow-500'
                        : 'text-muted-foreground/30 hover:text-muted-foreground'
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Emoji Feedback */}
            {rating > 0 && (
              <div className="text-center py-2">
                <div className="text-5xl">{feedback.emoji}</div>
                <p className={`text-lg font-semibold mt-2 ${feedback.color}`}>
                  {feedback.text}
                </p>
              </div>
            )}
          </div>

          {/* Category Ratings (Optional) */}
          {rating > 0 && !showCategories && (
            <button
              onClick={() => setShowCategories(true)}
              className="w-full py-2 px-3 rounded-lg bg-muted/50 text-sm font-medium text-center hover:bg-muted transition-colors flex items-center justify-center gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              Add detailed ratings (optional)
            </button>
          )}

          {showCategories && rating > 0 && (
            <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
              <p className="text-xs font-semibold text-muted-foreground">Rate specific aspects:</p>
              {Object.entries(categories).map(([key, value]) => (
                <div key={key} className="space-y-1">
                  <Label className="text-xs font-medium capitalize">{key}</Label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={`${key}-${star}`}
                        onClick={() =>
                          setCategories(prev => ({ ...prev, [key]: star }))
                        }
                      >
                        <Star
                          className={`w-6 h-6 transition-colors ${
                            star <= value
                              ? 'fill-yellow-500 text-yellow-500'
                              : 'text-muted-foreground/30'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Review Text */}
          {rating > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Share Your Experience (Optional)</Label>
              <Textarea
                value={review}
                onChange={e => setReview(e.target.value)}
                placeholder="What did you like? Any suggestions for improvement?"
                maxLength={500}
                className="rounded-lg min-h-[100px] text-sm"
              />
              <p className="text-[10px] text-muted-foreground text-right">
                {review.length}/500
              </p>
            </div>
          )}

          {/* Landlord Rating */}
          {rating > 0 && (
            <div className="space-y-2 pt-2 border-t border-border/50">
              <div>
                <Label className="text-sm font-semibold">Rate the Landlord</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  {landlordName} - communication, responsiveness, professionalism
                </p>
              </div>

              {!showLandlordRating ? (
                <button
                  onClick={() => setShowLandlordRating(true)}
                  className="w-full py-2 px-3 rounded-lg bg-muted/50 text-sm font-medium text-center hover:bg-muted transition-colors"
                >
                  {landlordRating > 0 ? `${landlordRating} stars` : 'Rate landlord separately'}
                </button>
              ) : (
                <div className="flex justify-center gap-2 py-3">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={`landlord-${star}`}
                      onClick={() => setLandlordRating(star)}
                    >
                      <Star
                        className={`w-8 h-8 transition-colors ${
                          star <= landlordRating
                            ? 'fill-pink-500 text-pink-500'
                            : 'text-muted-foreground/30 hover:text-muted-foreground'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-border/50">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 h-11 rounded-lg"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!isComplete || submitting}
              className="flex-1 h-11 rounded-lg bg-[#0F3D91] text-white disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Rating'}
            </Button>
          </div>

          {/* Info Text */}
          <p className="text-xs text-center text-muted-foreground">
            Your honest feedback helps us maintain high standards and helps landlords improve.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

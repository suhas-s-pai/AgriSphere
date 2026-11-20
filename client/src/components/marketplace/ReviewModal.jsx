import React, { useState } from 'react';
import { X, Star, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { reviewApi } from '../../services/api';

const ReviewModal = ({ isOpen, onClose, product, orderId, onReviewSubmitted }) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen || !product) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setSubmitting(true);

    try {
      const res = await reviewApi.addReview({
        product_id: product.id || product.product_id,
        order_id: orderId,
        rating,
        comment,
      });

      if (res.data?.status === 'success') {
        setSuccessMsg('Thank you! Your verified purchase review has been published.');
        setTimeout(() => {
          if (onReviewSubmitted) onReviewSubmitted(res.data.data);
          onClose();
        }, 1200);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Failed to submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-emerald-800 text-white">
          <h3 className="text-base font-bold">Review Purchased Product</h3>
          <button onClick={onClose} className="p-1 rounded-lg text-emerald-100 hover:text-white hover:bg-emerald-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          <div>
            <p className="font-bold text-gray-900 text-sm">{product.title || product.product_title}</p>
            <p className="text-gray-500">Order ID: #{orderId}</p>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Overall Rating *</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="p-1 text-amber-400 hover:scale-110 transition"
                >
                  <Star
                    className={`w-7 h-7 ${
                      (hoverRating || rating) >= star ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Your Feedback & Experience</label>
            <textarea
              rows="3"
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share details about seed germination, fertilizer efficacy, tool quality, delivery condition..."
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-sm shadow-md transition flex items-center justify-center gap-2 disabled:bg-gray-400"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit Verified Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;

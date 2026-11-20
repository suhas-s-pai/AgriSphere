import React, { useState } from 'react';
import {
  X,
  MapPin,
  Phone,
  ShieldCheck,
  Star,
  CheckCircle2,
  Calendar,
  Layers,
  Droplets,
  TrendingDown,
  ShoppingBag,
  Plus,
  Minus,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';

const ProductDetailModal = ({ product, isOpen, onClose, onOpenReview }) => {
  const { addToCart } = useCart();
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(product?.min_order_quantity || 1);
  const [addedNotice, setAddedNotice] = useState(false);

  if (!isOpen || !product) return null;

  const images = product.images && product.images.length > 0 ? product.images : [product.image_url];
  const isOutOfStock = product.available_quantity <= 0;
  const isHarvested = Boolean(product.is_harvested_produce);

  const handleAddToCart = async () => {
    if (isOutOfStock) return;
    const res = await addToCart(product, quantity);
    if (res.success) {
      setAddedNotice(true);
      setTimeout(() => setAddedNotice(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden my-8">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-emerald-800 text-white">
          <div className="flex items-center gap-2">
            <span className="text-xs bg-emerald-700 text-emerald-100 px-2.5 py-1 rounded-full font-medium">
              {product.category_name || 'Agriculture'}
            </span>
            {product.distanceKm != null && (
              <span className="text-xs bg-emerald-900/60 text-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {product.distanceKm} km away
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-100 hover:text-white hover:bg-emerald-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 max-h-[82vh] overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Gallery */}
            <div className="space-y-3">
              <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                <img
                  src={images[selectedImageIdx] || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80'}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
                {isOutOfStock && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-bold text-sm tracking-wide">
                    OUT OF STOCK
                  </div>
                )}
                {product.is_verified_seller && (
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-emerald-800 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm border border-emerald-100">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Verified Seller
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIdx(idx)}
                      className={`w-14 h-14 rounded-lg overflow-hidden border-2 shrink-0 ${
                        selectedImageIdx === idx ? 'border-emerald-600' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Seller Card */}
              <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-gray-900">{product.seller_name}</p>
                    <p className="text-gray-500 capitalize">{product.seller_type} • {product.seller_district || product.location_district}</p>
                  </div>
                  {product.is_verified_seller && (
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> RTC / GST Verified
                    </span>
                  )}
                </div>
                {product.seller_contact && (
                  <div className="flex items-center gap-1.5 text-gray-600 pt-1 border-t border-gray-200">
                    <Phone className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Direct Seller: {product.seller_contact}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Details & Purchase */}
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 leading-snug">{product.title}</h3>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
                  <div className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{product.rating_avg || 5.0}</span>
                  </div>
                  <span>•</span>
                  <span>{product.reviews_count || product.reviews?.length || 0} customer reviews</span>
                  <span>•</span>
                  <span className={isOutOfStock ? 'text-red-600 font-bold' : product.available_quantity <= 5 ? 'text-amber-600 font-bold' : 'text-emerald-700 font-bold'}>
                    {isOutOfStock ? 'Out of Stock' : `${product.available_quantity} ${product.unit} available`}
                  </span>
                </div>
              </div>

              {/* Price Block */}
              <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-100 flex items-baseline justify-between">
                <div>
                  <span className="text-2xl font-black text-emerald-800">₹{product.price}</span>
                  <span className="text-xs text-gray-600 font-normal"> / {product.unit}</span>
                  {product.wholesale_price && (
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Wholesale: ₹{product.wholesale_price}/{product.unit} (bulk lots)
                    </p>
                  )}
                </div>
                <div className="text-right text-xs text-gray-500">
                  <p>Min. Order: <strong className="text-gray-800">{product.min_order_quantity || 1} {product.unit}</strong></p>
                </div>
              </div>

              {/* Harvested Produce Specifications */}
              {isHarvested && (
                <div className="p-3.5 bg-amber-50/70 rounded-xl border border-amber-200/80 space-y-2 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-amber-900">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    Direct Farm Harvest Specifications
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-gray-700 pt-1">
                    {product.crop_name && (
                      <div>
                        <span className="text-gray-500 block text-[10px]">Crop Name</span>
                        <strong className="text-gray-800">{product.crop_name}</strong>
                      </div>
                    )}
                    {product.variety && (
                      <div>
                        <span className="text-gray-500 block text-[10px]">Variety / Hybrid</span>
                        <strong className="text-gray-800">{product.variety}</strong>
                      </div>
                    )}
                    {product.quality_grade && (
                      <div>
                        <span className="text-gray-500 block text-[10px]">Quality Grade</span>
                        <strong className="text-emerald-800">{product.quality_grade}</strong>
                      </div>
                    )}
                    {product.moisture_percentage != null && (
                      <div className="flex items-center gap-1">
                        <Droplets className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        <div>
                          <span className="text-gray-500 block text-[10px]">Moisture</span>
                          <strong className="text-gray-800">{product.moisture_percentage}%</strong>
                        </div>
                      </div>
                    )}
                    {product.harvest_date && (
                      <div className="flex items-center gap-1 col-span-2">
                        <Calendar className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                        <span className="text-gray-600">Harvest Date: <strong>{product.harvest_date}</strong></span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="space-y-1 text-xs">
                <h4 className="font-bold text-gray-800">Product Details</h4>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">{product.description}</p>
              </div>

              {/* Quantity Selector & Add to Cart */}
              <div className="pt-2 space-y-3">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-semibold text-gray-700">Quantity:</span>
                  <div className="flex items-center border border-gray-200 rounded-lg p-1 bg-gray-50">
                    <button
                      onClick={() => setQuantity((q) => Math.max(product.min_order_quantity || 1, q - 1))}
                      disabled={quantity <= (product.min_order_quantity || 1)}
                      className="w-7 h-7 flex items-center justify-center rounded bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-40"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-10 text-center text-xs font-bold text-gray-800">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(product.available_quantity, q + 1))}
                      disabled={quantity >= product.available_quantity}
                      className="w-7 h-7 flex items-center justify-center rounded bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-40"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="text-xs text-gray-500 font-medium">{product.unit}</span>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-sm shadow-md transition flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{isOutOfStock ? 'Currently Out of Stock' : `Add ${quantity} ${product.unit} to Cart (₹${product.price * quantity})`}</span>
                </button>

                {addedNotice && (
                  <p className="text-center text-xs font-semibold text-emerald-700 animate-fade-in flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Added to your cart!
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Customer Reviews Section */}
          <div className="pt-4 border-t border-gray-100 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                Farmer Reviews ({product.reviews?.length || 0})
              </h4>
            </div>

            {(!product.reviews || product.reviews.length === 0) ? (
              <p className="text-xs text-gray-500 italic">
                No reviews submitted yet for this product. Delivered orders can be reviewed from the Buyer Dashboard.
              </p>
            ) : (
              <div className="space-y-2.5">
                {product.reviews.map((rev) => (
                  <div key={rev.id} className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-800">{rev.reviewer_name}</span>
                      <div className="flex items-center gap-0.5 text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600">{rev.comment}</p>
                    <span className="text-[10px] text-gray-400 block pt-0.5">
                      {new Date(rev.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;

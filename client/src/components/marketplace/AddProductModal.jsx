import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Package,
  Layers,
  Sparkles,
  Upload,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Image as ImageIcon,
  Trash2,
} from 'lucide-react';
import { productApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const standardCategories = [
  { id: 'cat-seeds', name: 'Seeds' },
  { id: 'cat-fertilizers', name: 'Fertilizers' },
  { id: 'cat-organic-fert', name: 'Organic Fertilizers' },
  { id: 'cat-bio-fert', name: 'Bio-Fertilizers' },
  { id: 'cat-pesticides', name: 'Pesticides and Crop Protection' },
  { id: 'cat-machinery', name: 'Agricultural Machinery' },
  { id: 'cat-irrigation', name: 'Irrigation Equipment' },
  { id: 'cat-tools', name: 'Farming Tools' },
  { id: 'cat-animal', name: 'Animal Husbandry Supplies' },
  { id: 'cat-produce', name: 'Harvested Crops and Farm Produce' },
];

const AddProductModal = ({ isOpen, onClose, onProductCreated, productToEdit = null }) => {
  const { user, sellerProfile } = useAuth();

  const [formData, setFormData] = useState({
    category_id: 'cat-seeds',
    title: '',
    description: '',
    price: '',
    unit: 'kg',
    min_order_quantity: '1',
    initial_stock: '50',
    image_url: '',
    is_harvested_produce: false,
    crop_name: '',
    variety: '',
    quality_grade: 'Grade A',
    harvest_date: '',
    moisture_percentage: '',
    wholesale_price: '',
    retail_price: '',
  });

  const [imagePreview, setImagePreview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const isEditing = Boolean(productToEdit);

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        category_id: productToEdit.category_id || 'cat-seeds',
        title: productToEdit.title || '',
        description: productToEdit.description || '',
        price: productToEdit.price || '',
        unit: productToEdit.unit || 'kg',
        min_order_quantity: productToEdit.min_order_quantity || 1,
        initial_stock: productToEdit.stock_quantity ?? productToEdit.available_quantity ?? 50,
        image_url: productToEdit.image_url || '',
        is_harvested_produce: Boolean(productToEdit.is_harvested_produce),
        crop_name: productToEdit.crop_name || '',
        variety: productToEdit.variety || '',
        quality_grade: productToEdit.quality_grade || 'Grade A',
        harvest_date: productToEdit.harvest_date || '',
        moisture_percentage: productToEdit.moisture_percentage || '',
        wholesale_price: productToEdit.wholesale_price || '',
        retail_price: productToEdit.retail_price || productToEdit.price || '',
      });
      setImagePreview(productToEdit.image_url || '');
    } else {
      setFormData({
        category_id: 'cat-seeds',
        title: '',
        description: '',
        price: '',
        unit: 'kg',
        min_order_quantity: '1',
        initial_stock: '50',
        image_url: '',
        is_harvested_produce: false,
        crop_name: '',
        variety: '',
        quality_grade: 'Grade A',
        harvest_date: '',
        moisture_percentage: '',
        wholesale_price: '',
        retail_price: '',
      });
      setImagePreview('');
    }
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const isProduce = formData.category_id === 'cat-produce' || formData.is_harvested_produce;

  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5 MB. Please select a smaller photo.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        setImagePreview(result);
        setFormData((prev) => ({ ...prev, image_url: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearImage = () => {
    setImagePreview('');
    setFormData((prev) => ({ ...prev, image_url: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setSubmitting(true);

    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        min_order_quantity: Number(formData.min_order_quantity) || 1,
        initial_stock: Number(formData.initial_stock) || 0,
        stock_quantity: Number(formData.initial_stock) || 0,
        is_harvested_produce: isProduce,
        wholesale_price: formData.wholesale_price ? Number(formData.wholesale_price) : undefined,
        retail_price: formData.retail_price ? Number(formData.retail_price) : Number(formData.price),
        moisture_percentage: formData.moisture_percentage ? Number(formData.moisture_percentage) : undefined,
        image_urls: formData.image_url ? [formData.image_url] : [],
      };

      let res;
      if (isEditing) {
        res = await productApi.updateProduct(productToEdit.id, payload);
      } else {
        res = await productApi.createProduct(payload);
      }

      if (res.data?.status === 'success') {
        setSuccessMsg(isEditing ? 'Listing updated successfully!' : 'Product listing published successfully!');
        setTimeout(() => {
          if (onProductCreated) onProductCreated(res.data.data);
          onClose();
        }, 1200);
      }
    } catch (err) {
      console.error('[ADD/EDIT PRODUCT ERROR]', err);
      setErrorMsg(err.response?.data?.message || err.message || 'Failed to save product listing.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-emerald-800 text-white">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-emerald-300" />
            <h3 className="text-lg font-bold">
              {isEditing ? 'Edit Agricultural Listing' : 'List Product on AgriSphere'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-100 hover:text-white hover:bg-emerald-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-800 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Category Selector */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Product Category *</label>
            <select
              value={formData.category_id}
              onChange={(e) => {
                const catId = e.target.value;
                setFormData({
                  ...formData,
                  category_id: catId,
                  is_harvested_produce: catId === 'cat-produce',
                });
              }}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-none"
            >
              {standardCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Product Title / Name *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Certified Sona Masoori Paddy Seeds (CS-1)"
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-none"
            />
          </div>

          {/* Price, Unit, Min Order, Stock */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Price (₹) *</label>
              <input
                type="number"
                required
                min="1"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="1200"
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Unit *</label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-none"
              >
                <option value="kg">Kilogram (kg)</option>
                <option value="quintal">Quintal</option>
                <option value="bag">Bag / Sack</option>
                <option value="litre">Litre (L)</option>
                <option value="piece">Piece / Unit</option>
                <option value="packet">Packet</option>
                <option value="box">Box</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Min. Order Qty</label>
              <input
                type="number"
                min="1"
                value={formData.min_order_quantity}
                onChange={(e) => setFormData({ ...formData, min_order_quantity: e.target.value })}
                placeholder="1"
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Available Stock *</label>
              <input
                type="number"
                required
                min="0"
                value={formData.initial_stock}
                onChange={(e) => setFormData({ ...formData, initial_stock: e.target.value })}
                placeholder="50"
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Harvested Produce Specific Section */}
          {isProduce && (
            <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-3">
              <div className="flex items-center gap-1.5 font-bold text-amber-900">
                <Sparkles className="w-4 h-4 text-amber-600" />
                Harvested Crop & Produce Attributes
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Crop Name</label>
                  <input
                    type="text"
                    value={formData.crop_name}
                    onChange={(e) => setFormData({ ...formData, crop_name: e.target.value })}
                    placeholder="e.g. Paddy, Cotton, Soybean"
                    className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Variety</label>
                  <input
                    type="text"
                    value={formData.variety}
                    onChange={(e) => setFormData({ ...formData, variety: e.target.value })}
                    placeholder="e.g. Sona Masoori, Sharbati"
                    className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Quality Grade</label>
                  <select
                    value={formData.quality_grade}
                    onChange={(e) => setFormData({ ...formData, quality_grade: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded-lg"
                  >
                    <option value="Grade A+ (Export)">Grade A+ (Export)</option>
                    <option value="Grade A">Grade A</option>
                    <option value="Grade B (Standard)">Grade B (Standard)</option>
                    <option value="Organic Certified">Organic Certified</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Harvest Date</label>
                  <input
                    type="date"
                    value={formData.harvest_date}
                    onChange={(e) => setFormData({ ...formData, harvest_date: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Moisture (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.moisture_percentage}
                    onChange={(e) => setFormData({ ...formData, moisture_percentage: e.target.value })}
                    placeholder="e.g. 11.5"
                    className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Wholesale Lot Price (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.wholesale_price}
                    onChange={(e) => setFormData({ ...formData, wholesale_price: e.target.value })}
                    placeholder="e.g. 1100"
                    className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Description & Certification Details</label>
            <textarea
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe germination rate, treatment, organic status, or technical specifications..."
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-none"
            />
          </div>

          {/* Image Upload & URL Section */}
          <div className="space-y-2 p-3.5 bg-gray-50 rounded-xl border border-gray-200">
            <label className="block text-gray-800 font-semibold flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-emerald-700" />
              Product Photo Upload & Preview
            </label>

            {imagePreview ? (
              <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-gray-300 shadow-sm group">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={handleClearImage}
                  className="absolute top-1.5 right-1.5 p-1 bg-red-600 text-white rounded-full opacity-90 hover:opacity-100 shadow transition"
                  title="Remove image"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <label className="px-4 py-2 bg-white border border-emerald-600 text-emerald-700 hover:bg-emerald-50 rounded-lg font-semibold cursor-pointer flex items-center gap-1.5 transition">
                  <Upload className="w-4 h-4" />
                  Choose File from Device
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="hidden"
                  />
                </label>
                <span className="text-gray-400">or paste image URL below</span>
              </div>
            )}

            <div>
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) => {
                  setFormData({ ...formData, image_url: e.target.value });
                  setImagePreview(e.target.value);
                }}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-none"
              />
              <p className="text-[11px] text-gray-400 mt-0.5">Leave blank to use a high-quality category default photo.</p>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-sm shadow-md transition flex items-center justify-center gap-2 disabled:bg-gray-400"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{isEditing ? 'Saving Changes...' : 'Publishing Listing...'}</span>
                </>
              ) : (
                <span>{isEditing ? 'Save Listing Changes' : 'Publish Listing to Marketplace'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;

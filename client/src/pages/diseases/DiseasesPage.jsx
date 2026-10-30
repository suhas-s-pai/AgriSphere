import React, { useState, useMemo } from 'react';
import {
  Bug,
  Search,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  X,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

const issues = [
  {
    id: 'early-blight',
    name: 'Early Blight (Alternaria solani)',
    crop: 'Tomato & Potato',
    type: 'Disease',
    symptoms: 'Concentric dark brown rings on older lower leaves, developing into target-board spots and yellow halos.',
    prevention: 'Avoid overhead watering. Maintain proper row spacing and stake plants to enhance air circulation.',
    treatment: 'Apply copper-based fungicide or Mancozeb (2g/L water). Neem oil spray (5ml/L) effective in early stages.',
    severity: 'High',
  },
  {
    id: 'fall-armyworm',
    name: 'Fall Armyworm (Spodoptera frugiperda)',
    crop: 'Maize (Corn)',
    type: 'Pest',
    symptoms: 'Window-pane feeding, pinholes, and ragged chewed holes on whorl leaves with moist sawdust-like frass.',
    prevention: 'Deep summer ploughing, intercropping with pulses, and installing pheromone traps (5 traps/acre).',
    treatment: 'Spray Emamectin Benzoate 5% SG @ 0.4g/L or Chlorantraniliprole 18.5% SC @ 0.3ml/L in the whorl during evening.',
    severity: 'Severe',
  },
  {
    id: 'powdery-mildew',
    name: 'Powdery Mildew',
    crop: 'Chilli & Vegetables',
    type: 'Disease',
    symptoms: 'White powdery fungal patches on upper leaf surfaces causing curling, premature leaf drop, and poor pod set.',
    prevention: 'Avoid excessive nitrogen fertilization. Ensure sunny, well-ventilated field conditions.',
    treatment: 'Foliar spray of Wettable Sulphur (3g/L) or Azoxystrobin (1ml/L water) at initial onset of symptoms.',
    severity: 'Medium',
  },
  {
    id: 'fruit-borer',
    name: 'Tomato Fruit Borer (Helicoverpa armigera)',
    crop: 'Tomato & Cotton',
    type: 'Pest',
    symptoms: 'Caterpillars bore circular holes into green and ripening fruits, feeding on internal pulp leading to secondary rotting.',
    prevention: 'Plant marigold as a trap crop (1 row marigold for every 16 rows of tomato). Collect and destroy bored fruits.',
    treatment: 'Release Trichogramma chilonis egg parasitoids. Spray Indoxacarb 14.5% SC @ 0.5ml/L when borer larvae appear.',
    severity: 'High',
  },
  {
    id: 'blast',
    name: 'Leaf Blast (Magnaporthe oryzae)',
    crop: 'Rice (Paddy)',
    type: 'Disease',
    symptoms: 'Spindle-shaped or diamond-shaped lesions with ash-grey centers and brownish borders on paddy foliage.',
    prevention: 'Avoid excess nitrogen fertilizer. Treat seeds with Carbendazim (2g/kg seed) before nursery sowing.',
    treatment: 'Foliar spray of Tricyclazole 75% WP @ 0.6g/L or Isoprothiolane @ 1.5ml/L water at early tillering.',
    severity: 'Severe',
  },
  {
    id: 'leaf-curl',
    name: 'Chilli Leaf Curl Virus',
    crop: 'Chilli',
    type: 'Disease',
    symptoms: 'Upward curling of leaves, puckering, reduced leaf size, stunted growth, and bushy rosette appearance.',
    prevention: 'Transmitted by whiteflies and thrips. Install yellow and blue sticky traps (10/acre) to monitor vectors.',
    treatment: 'Control insect vectors by spraying Imidacloprid 17.8% SL @ 0.3ml/L or Diafenthiuron 50% WP @ 1g/L.',
    severity: 'High',
  },
  {
    id: 'aphids',
    name: 'Aphids & Sucking Pests',
    crop: 'Vegetables & Cotton',
    type: 'Pest',
    symptoms: 'Dense clusters of soft green or black insects on tender shoots; leaves curl downward and secrete sticky honeydew.',
    prevention: 'Encourage ladybird beetles and lacewings. Spray strong jet of water on lower leaf surfaces.',
    treatment: 'Spray 5% Neem Seed Kernel Extract (NSKE) or Acetamiprid 20% SP @ 0.2g/L for severe infestations.',
    severity: 'Medium',
  },
  {
    id: 'tikka-disease',
    name: 'Tikka Leaf Spot (Cercospora)',
    crop: 'Groundnut',
    type: 'Disease',
    symptoms: 'Small circular dark brown to black spots surrounded by a bright yellow halo on both sides of groundnut leaves.',
    prevention: 'Crop rotation with non-host crops (cereals). Treat seeds with Trichoderma viride (4g/kg).',
    treatment: 'Foliar spray with Carbendazim + Mancozeb (2g/L) at 40 and 55 days after sowing.',
    severity: 'Medium',
  },
];

const cropFilters = ['All', 'Tomato', 'Maize', 'Chilli', 'Rice', 'Cotton', 'Groundnut'];

const DiseasesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('All');
  const [selectedType, setSelectedType] = useState('All'); // 'All', 'Disease', 'Pest'
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [analyzingImage, setAnalyzingImage] = useState(false);

  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      const matchesCrop =
        selectedCrop === 'All' || issue.crop.includes(selectedCrop);
      const matchesType =
        selectedType === 'All' || issue.type === selectedType;
      const q = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !q ||
        issue.name.toLowerCase().includes(q) ||
        issue.crop.toLowerCase().includes(q) ||
        issue.symptoms.toLowerCase().includes(q);
      return matchesCrop && matchesType && matchesQuery;
    });
  }, [selectedCrop, selectedType, searchQuery]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedImage(URL.createObjectURL(file));
      setAnalyzingImage(true);
      setTimeout(() => {
        setAnalyzingImage(false);
      }, 1200);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#15803D] bg-[#DCFCE7] px-2.5 py-1 rounded-md mb-2">
            <Bug className="w-3.5 h-3.5" />
            <span>Plant Pathology & Integrated Pest Management</span>
          </div>
          <h1 className="text-2xl font-bold text-[#14532D]">Diseases & Pests</h1>
          <p className="text-sm text-[#64748B] mt-1">
            Identify crop leaf symptoms early, discover pest alerts, and apply recommended organic and chemical treatments.
          </p>
        </div>
      </div>

      {/* Image Upload Diagnostic Box */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-[#15803D]" />
              <h2 className="text-base font-bold text-[#1F2937]">
                Visual Crop Symptom Diagnosis
              </h2>
            </div>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Upload a clear photo of an affected leaf, stem, or fruit to cross-reference common pathology patterns in North Karnataka crops.
            </p>

            <div className="mt-4 flex items-center gap-3">
              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#15803D] text-white text-xs font-semibold hover:bg-[#14532D] cursor-pointer transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Leaf Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>

              {uploadedImage && (
                <button
                  onClick={() => setUploadedImage(null)}
                  className="text-xs text-rose-600 hover:underline"
                >
                  Clear Photo
                </button>
              )}
            </div>
          </div>

          {/* Photo Preview / Dropzone */}
          <div className="w-full md:w-64 h-36 rounded-xl border-2 border-dashed border-slate-200 bg-[#F8FAF6] flex flex-col items-center justify-center p-3 text-center">
            {uploadedImage ? (
              <div className="relative w-full h-full flex flex-col items-center justify-center">
                <img
                  src={uploadedImage}
                  alt="Crop preview"
                  className="max-h-24 w-auto rounded object-contain"
                />
                {analyzingImage ? (
                  <span className="text-[10px] text-[#15803D] font-bold mt-1">Analyzing symptoms...</span>
                ) : (
                  <span className="text-[10px] text-emerald-700 font-semibold mt-1">Sample matched with Tomato Blight profile</span>
                )}
              </div>
            ) : (
              <>
                <ImageIcon className="w-8 h-8 text-slate-300 mb-1" />
                <span className="text-xs font-medium text-slate-500">No image selected</span>
                <span className="text-[10px] text-slate-400">JPG, PNG up to 5MB</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by pest, disease, symptom, or crop..."
              className="w-full bg-[#F8FAF6] hover:bg-white focus:bg-white border border-slate-200 focus:border-[#15803D] rounded-lg pl-10 pr-8 py-2 text-sm text-[#1F2937] placeholder-slate-400 focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Type Toggle */}
          <div className="flex items-center p-1 bg-[#F8FAF6] border border-slate-200 rounded-lg shrink-0">
            {['All', 'Disease', 'Pest'].map((t) => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                  selectedType === t
                    ? 'bg-[#15803D] text-white shadow-xs'
                    : 'text-[#64748B] hover:text-[#1F2937]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Crop Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs text-[#64748B] font-medium mr-1">Crop:</span>
          {cropFilters.map((crop) => (
            <button
              key={crop}
              onClick={() => setSelectedCrop(crop)}
              className={`px-3 py-1 rounded-md text-xs whitespace-nowrap transition-colors ${
                selectedCrop === crop
                  ? 'bg-[#15803D] text-white font-medium'
                  : 'bg-[#F8FAF6] text-[#64748B] hover:text-[#1F2937] border border-slate-200'
              }`}
            >
              {crop}
            </button>
          ))}
        </div>
      </div>

      {/* Diseases / Pests Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredIssues.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedIssue(item)}
            className="group bg-white rounded-xl border border-slate-200 p-5 hover:border-[#15803D] cursor-pointer transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    item.type === 'Pest'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {item.type}
                </span>

                <span className="text-[11px] font-medium text-[#15803D] bg-[#DCFCE7] px-2 py-0.5 rounded">
                  {item.crop}
                </span>
              </div>

              <h3 className="text-base font-bold text-[#1F2937] group-hover:text-[#15803D] transition-colors mt-2.5">
                {item.name}
              </h3>

              <p className="text-xs text-[#64748B] mt-2 line-clamp-2 leading-relaxed">
                {item.symptoms}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#15803D]">
              <span>View Treatment Guide</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>

      {filteredIssues.length === 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-[#64748B]">
          <Bug className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-[#1F2937]">No plant issue matches your search</p>
          <p className="text-xs text-slate-400 mt-1">Try resetting the crop filter or searching by symptom keyword.</p>
        </div>
      )}

      {/* Disease Detail Modal */}
      {selectedIssue && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setSelectedIssue(null)}
        >
          <div
            className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-xl border border-slate-200 p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    selectedIssue.type === 'Pest'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {selectedIssue.type} • {selectedIssue.crop}
                </span>
                <h2 className="text-lg font-bold text-[#1F2937] mt-1.5">{selectedIssue.name}</h2>
              </div>
              <button
                onClick={() => setSelectedIssue(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3.5 text-xs">
              <div className="p-3 bg-rose-50/70 rounded-lg border border-rose-200">
                <span className="font-bold text-rose-900 block mb-1">Key Symptoms</span>
                <p className="text-rose-800 leading-relaxed">{selectedIssue.symptoms}</p>
              </div>

              <div className="p-3 bg-[#DCFCE7]/70 rounded-lg border border-emerald-200">
                <span className="font-bold text-[#14532D] block mb-1">Recommended Treatment</span>
                <p className="text-[#14532D] leading-relaxed">{selectedIssue.treatment}</p>
              </div>

              <div className="p-3 bg-[#F8FAF6] rounded-lg border border-slate-200">
                <span className="font-bold text-[#1F2937] block mb-1">Preventive Practices</span>
                <p className="text-[#64748B] leading-relaxed">{selectedIssue.prevention}</p>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedIssue(null)}
                className="px-4 py-1.5 rounded-lg bg-[#15803D] text-white text-xs font-semibold hover:bg-[#14532D]"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiseasesPage;

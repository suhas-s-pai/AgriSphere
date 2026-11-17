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
  Loader2,
  Info,
  ExternalLink,
} from 'lucide-react';
import {
  VERIFIED_PATHOLOGY_CATALOG,
  diagnoseCropImage,
} from '../../services/diseaseDetectionService.js';

const cropFilters = ['All', 'Tomato', 'Maize', 'Chilli', 'Rice', 'Cotton', 'Groundnut'];

const DiseasesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('All');
  const [selectedSeverity, setSelectedSeverity] = useState('All');
  const [selectedIssue, setSelectedIssue] = useState(null);

  // Diagnostic state
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [diagnosticResult, setDiagnosticResult] = useState(null);

  const filteredIssues = useMemo(() => {
    return VERIFIED_PATHOLOGY_CATALOG.filter((issue) => {
      const matchesCrop =
        selectedCrop === 'All' || issue.crop.includes(selectedCrop);
      const matchesSeverity =
        selectedSeverity === 'All' || issue.severity === selectedSeverity;
      const q = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !q ||
        issue.name.toLowerCase().includes(q) ||
        issue.crop.toLowerCase().includes(q) ||
        issue.symptoms.toLowerCase().includes(q) ||
        issue.pathogenType.toLowerCase().includes(q);
      return matchesCrop && matchesSeverity && matchesQuery;
    });
  }, [selectedCrop, selectedSeverity, searchQuery]);

  const handleImageSelected = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setIsDiagnosing(true);
    setDiagnosticResult(null);

    try {
      const result = await diagnoseCropImage(file, selectedCrop !== 'All' ? selectedCrop : '');
      setDiagnosticResult(result);
    } catch (err) {
      setDiagnosticResult({
        isLiveAi: false,
        status: 'error',
        message: 'Could not connect to diagnosis service.',
      });
    } finally {
      setIsDiagnosing(false);
    }
  };

  const handleClearPhoto = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(null);
    setPreviewUrl(null);
    setDiagnosticResult(null);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#15803D] bg-[#DCFCE7] px-2.5 py-1 rounded-md mb-2">
            <Bug className="w-3.5 h-3.5" />
            <span>ICAR & KVK Plant Pathology Diagnostic Hub</span>
          </div>
          <h1 className="text-2xl font-bold text-[#14532D]">Diseases & Pests</h1>
          <p className="text-sm text-[#64748B] mt-1">
            Genuine crop disease identification, organic IPM prevention, and verified scientific chemical treatments.
          </p>
        </div>
      </div>

      {/* Diagnostic Upload Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-[#15803D]" />
              <h2 className="text-base font-bold text-[#1F2937]">
                Crop Symptom Photo Diagnosis
              </h2>
            </div>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Upload a clear photo of an infected leaf, shoot, or fruit. Images are cross-referenced with scientific ICAR plant pathology protocols and the backend vision model.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#15803D] text-white text-xs font-semibold hover:bg-[#14532D] cursor-pointer transition-colors shadow-2xs">
                <Upload className="w-3.5 h-3.5" />
                <span>{selectedFile ? 'Change Photo' : 'Upload Crop Photo'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelected}
                  className="hidden"
                />
              </label>

              {previewUrl && (
                <button
                  type="button"
                  onClick={handleClearPhoto}
                  className="text-xs text-rose-600 hover:underline font-semibold cursor-pointer"
                >
                  Clear Photo
                </button>
              )}
            </div>
          </div>

          {/* Photo Preview Box */}
          <div className="w-full md:w-72 h-40 rounded-xl border-2 border-dashed border-slate-200 bg-[#F8FAF6] flex flex-col items-center justify-center p-3 text-center shrink-0">
            {previewUrl ? (
              <div className="relative w-full h-full flex flex-col items-center justify-center">
                <img
                  src={previewUrl}
                  alt="Crop specimen"
                  className="max-h-24 w-auto rounded object-contain shadow-2xs"
                />
                {isDiagnosing ? (
                  <div className="flex items-center gap-1.5 text-[11px] text-[#15803D] font-bold mt-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing plant pathology...</span>
                  </div>
                ) : (
                  <span className="text-[10px] text-slate-500 mt-1 truncate max-w-[200px]">
                    {selectedFile?.name}
                  </span>
                )}
              </div>
            ) : (
              <>
                <ImageIcon className="w-8 h-8 text-slate-300 mb-1" />
                <span className="text-xs font-medium text-slate-500">No image selected</span>
                <span className="text-[10px] text-slate-400">JPG, PNG up to 10MB</span>
              </>
            )}
          </div>
        </div>

        {/* Diagnostic Results Box - Completely Transparent, Zero Mocking */}
        {diagnosticResult && (
          <div className="mt-5 pt-4 border-t border-slate-100">
            {diagnosticResult.isLiveAi ? (
              <div className="p-4 rounded-xl bg-[#DCFCE7]/70 border border-emerald-300">
                <div className="flex items-center gap-2 text-[#14532D] font-bold text-sm">
                  <ShieldCheck className="w-4 h-4 text-[#15803D]" />
                  <span>AI Computer-Vision Diagnosis Complete</span>
                  {diagnosticResult.data.confidence && (
                    <span className="text-[11px] font-semibold bg-white px-2 py-0.5 rounded-full border border-emerald-300">
                      Confidence: {diagnosticResult.data.confidence}%
                    </span>
                  )}
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-2">
                  {diagnosticResult.data.diseaseName}
                </h3>
                <p className="text-xs text-slate-700 mt-1">{diagnosticResult.data.analysis}</p>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                  <Info className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Honest Diagnostic Status: Computer-Vision API Key Notice</span>
                </div>
                <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                  Live computer-vision requires a configured <code className="bg-amber-100 px-1 py-0.5 rounded text-[11px]">GEMINI_API_KEY</code> in the backend environment. To ensure 100% agricultural accuracy and avoid fictional diagnoses, please cross-reference your crop symptoms using the verified ICAR/KVK plant pathology reference catalog below.
                </p>

                {diagnosticResult.matchedReference && (
                  <div className="mt-3 p-3 bg-white rounded-lg border border-amber-200">
                    <span className="text-[11px] font-bold text-[#14532D] block">
                      Suggested Crop Match: {diagnosticResult.matchedReference.crop} — {diagnosticResult.matchedReference.name}
                    </span>
                    <p className="text-xs text-slate-600 mt-1">{diagnosticResult.matchedReference.symptoms}</p>
                    <button
                      onClick={() => setSelectedIssue(diagnosticResult.matchedReference)}
                      className="mt-2 text-xs font-semibold text-[#15803D] hover:underline"
                    >
                      View Full ICAR Treatment Protocol →
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
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
              placeholder="Search by pathogen name, crop, symptoms, or treatment..."
              className="w-full bg-[#F8FAF6] hover:bg-white focus:bg-white border border-slate-200 focus:border-[#15803D] rounded-lg pl-10 pr-8 py-2 text-sm text-[#1F2937] placeholder-slate-400 focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Severity Filter */}
          <div className="flex items-center p-1 bg-[#F8FAF6] border border-slate-200 rounded-lg shrink-0">
            {['All', 'Severe', 'High', 'Medium'].map((sev) => (
              <button
                key={sev}
                onClick={() => setSelectedSeverity(sev)}
                className={`px-3 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                  selectedSeverity === sev
                    ? 'bg-[#15803D] text-white shadow-xs'
                    : 'text-[#64748B] hover:text-[#1F2937]'
                }`}
              >
                {sev}
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
              className={`px-3 py-1 rounded-md text-xs whitespace-nowrap transition-colors cursor-pointer ${
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
                    item.severity === 'Severe'
                      ? 'bg-rose-100 text-rose-800'
                      : item.severity === 'High'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {item.severity} Risk
                </span>

                <span className="text-[11px] font-medium text-[#15803D] bg-[#DCFCE7] px-2 py-0.5 rounded">
                  {item.crop}
                </span>
              </div>

              <h3 className="text-base font-bold text-[#1F2937] group-hover:text-[#15803D] transition-colors mt-2.5">
                {item.name}
              </h3>

              <p className="text-[11px] text-slate-400 font-medium">{item.pathogenType}</p>

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
          <p className="text-sm font-semibold text-[#1F2937]">No plant pathology record matches your search</p>
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
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  {selectedIssue.pathogenType} • {selectedIssue.crop}
                </span>
                <h2 className="text-lg font-bold text-[#1F2937] mt-1.5">{selectedIssue.name}</h2>
              </div>
              <button
                onClick={() => setSelectedIssue(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3.5 text-xs">
              <div className="p-3 bg-rose-50/70 rounded-lg border border-rose-200">
                <span className="font-bold text-rose-900 block mb-1">Key Symptoms</span>
                <p className="text-rose-800 leading-relaxed">{selectedIssue.symptoms}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-bold text-slate-800 block mb-1">Environmental Causes</span>
                <p className="text-slate-600 leading-relaxed">{selectedIssue.causes}</p>
              </div>

              <div className="p-3 bg-[#DCFCE7]/70 rounded-lg border border-emerald-200">
                <span className="font-bold text-[#14532D] block mb-1">Organic & Cultural Prevention</span>
                <p className="text-[#14532D] leading-relaxed">{selectedIssue.organicPrevention}</p>
              </div>

              <div className="p-3 bg-amber-50/70 rounded-lg border border-amber-200">
                <span className="font-bold text-amber-900 block mb-1">Scientific Chemical Treatment (Dosage)</span>
                <p className="text-amber-800 leading-relaxed">{selectedIssue.chemicalTreatment}</p>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] text-slate-400">Source: ICAR-KVK Agronomy Bulletins</span>
              <button
                onClick={() => setSelectedIssue(null)}
                className="px-4 py-1.5 rounded-lg bg-[#15803D] text-white text-xs font-semibold hover:bg-[#14532D] cursor-pointer"
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

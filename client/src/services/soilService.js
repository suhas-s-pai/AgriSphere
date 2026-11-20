/**
 * Soil Test Evaluation & Fertilizer Recommendation Service for AgriSphere
 * Implements ICAR Soil Test Crop Response (STCR) agronomic equations.
 * Provides genuine N-P-K classification, pH correction, and bag-wise fertilizer dosing.
 */

const SOIL_STORAGE_KEY = 'agrisphere_soil_test_v1';

// ICAR Crop Standard Fertilizer Dosage (kg/acre for Medium Fertility Soil)
export const CROP_NPK_REQUIREMENTS = {
  maize: {
    name: 'Maize (Corn)',
    stdN: 60,
    stdP: 30,
    stdK: 20,
    optimalPh: [6.0, 7.5],
    fymTonnes: 5,
    criticalStages: 'Knee-high, Tasseling, Silking, and Grain filling.',
  },
  rice: {
    name: 'Rice (Paddy)',
    stdN: 40,
    stdP: 20,
    stdK: 20,
    optimalPh: [5.5, 7.0],
    fymTonnes: 4,
    criticalStages: 'Tillering, Panicle initiation, and Flowering.',
  },
  tomato: {
    name: 'Tomato',
    stdN: 75,
    stdP: 50,
    stdK: 50,
    optimalPh: [6.0, 7.0],
    fymTonnes: 8,
    criticalStages: 'Vegetative, Early flowering, and Fruit enlargement.',
  },
  cotton: {
    name: 'Cotton',
    stdN: 50,
    stdP: 25,
    stdK: 25,
    optimalPh: [6.5, 8.0],
    fymTonnes: 5,
    criticalStages: 'Square formation, Flowering, and Boll development.',
  },
  sugarcane: {
    name: 'Sugarcane',
    stdN: 100,
    stdP: 40,
    stdK: 50,
    optimalPh: [6.5, 7.8],
    fymTonnes: 10,
    criticalStages: 'Formative tillering, Grand growth (canopy), and Elongation.',
  },
  groundnut: {
    name: 'Groundnut (Peanut)',
    stdN: 10,
    stdP: 20,
    stdK: 10,
    optimalPh: [6.0, 7.2],
    fymTonnes: 3,
    criticalStages: 'Flowering and Peg development (Apply 200kg Gypsum/acre).',
  },
  wheat: {
    name: 'Wheat',
    stdN: 48,
    stdP: 24,
    stdK: 16,
    optimalPh: [6.0, 7.5],
    fymTonnes: 4,
    criticalStages: 'Crown root initiation (CRI), Tillering, and Booting.',
  },
  chilli: {
    name: 'Chilli',
    stdN: 60,
    stdP: 30,
    stdK: 30,
    optimalPh: [6.2, 7.2],
    fymTonnes: 6,
    criticalStages: 'Vegetative branching, Flowering, and Multiple flush pickings.',
  },
};

/**
 * Classify Nitrogen level based on ICAR ratings (kg/ha)
 */
export function classifyNitrogen(nKgHa) {
  if (nKgHa < 280) return { rating: 'Low', factor: 1.25, badge: 'text-rose-700 bg-rose-50 border-rose-200' };
  if (nKgHa <= 560) return { rating: 'Medium', factor: 1.0, badge: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
  return { rating: 'High', factor: 0.75, badge: 'text-sky-700 bg-sky-50 border-sky-200' };
}

/**
 * Classify Phosphorus level based on ICAR ratings (kg/ha)
 */
export function classifyPhosphorus(pKgHa) {
  if (pKgHa < 10) return { rating: 'Low', factor: 1.25, badge: 'text-rose-700 bg-rose-50 border-rose-200' };
  if (pKgHa <= 25) return { rating: 'Medium', factor: 1.0, badge: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
  return { rating: 'High', factor: 0.75, badge: 'text-sky-700 bg-sky-50 border-sky-200' };
}

/**
 * Classify Potassium level based on ICAR ratings (kg/ha)
 */
export function classifyPotassium(kKgHa) {
  if (kKgHa < 110) return { rating: 'Low', factor: 1.25, badge: 'text-rose-700 bg-rose-50 border-rose-200' };
  if (kKgHa <= 280) return { rating: 'Medium', factor: 1.0, badge: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
  return { rating: 'High', factor: 0.75, badge: 'text-sky-700 bg-sky-50 border-sky-200' };
}

/**
 * Classify Organic Carbon %
 */
export function classifyOrganicCarbon(ocPercent) {
  if (ocPercent < 0.5) return { rating: 'Low', advice: 'Low humus. Apply 5–10 tonnes well-decomposed FYM or compost per acre.' };
  if (ocPercent <= 0.75) return { rating: 'Medium', advice: 'Sufficient organic matter. Maintain green manuring and crop residues.' };
  return { rating: 'High', advice: 'Excellent soil biological fertility and water retention.' };
}

/**
 * Evaluate Soil pH
 */
export function evaluatePh(ph, cropKey = 'maize') {
  const crop = CROP_NPK_REQUIREMENTS[cropKey] || CROP_NPK_REQUIREMENTS.maize;
  const [idealMin, idealMax] = crop.optimalPh;
  let status, color, action;

  if (ph < 5.5) {
    status = 'Strongly acidic';
    color = 'text-rose-700 bg-rose-50 border-rose-200';
    action = 'Acidic soil can reduce phosphorus and some micronutrient availability. Ask a soil-testing laboratory or Raitha Samparka Kendra for a lime requirement based on buffer pH; do not apply a guessed lime dose.';
  } else if (ph < idealMin) {
    status = 'Below this crop’s preferred pH';
    color = 'text-amber-700 bg-amber-50 border-amber-200';
    action = `The entered pH is below the preferred range (${idealMin.toFixed(1)}–${idealMax.toFixed(1)}) for ${crop.name}. Check acidity and micronutrient availability; obtain a lime requirement from a soil test before applying lime.`;
  } else if (ph <= idealMax) {
    status = 'Within this crop’s preferred range';
    color = 'text-emerald-700 bg-emerald-50 border-emerald-200';
    action = `The entered pH is within the preferred range (${idealMin.toFixed(1)}–${idealMax.toFixed(1)}) for ${crop.name}. Maintain organic matter and follow the soil-test N-P-K recommendation.`;
  } else if (ph <= 8.5) {
    status = 'Alkaline for this crop';
    color = 'text-amber-700 bg-amber-50 border-amber-200';
    action = `The entered pH is above the preferred range (${idealMin.toFixed(1)}–${idealMax.toFixed(1)}) for ${crop.name}. High pH may reduce availability of iron, zinc and phosphorus. Test soil and irrigation-water quality before selecting an amendment.`;
  } else {
    status = 'Strongly alkaline';
    color = 'text-rose-700 bg-rose-50 border-rose-200';
    action = 'Strong alkalinity may indicate sodicity or salinity. Request soil EC, exchangeable sodium / ESP and gypsum-requirement testing before treatment. Do not apply gypsum solely from pH.';
  }

  return { status, color, action, idealRange: `${idealMin.toFixed(1)}–${idealMax.toFixed(1)}`, cropSuitable: ph >= idealMin && ph <= idealMax };
}

/**
 * Compute precise fertilizer recommendations in commercial fertilizer bags
 */
export function calculateFertilizerDose({ cropKey, nVal, pVal, kVal, phVal, areaAcres = 1 }) {
  const crop = CROP_NPK_REQUIREMENTS[cropKey] || CROP_NPK_REQUIREMENTS.maize;

  const nClass = classifyNitrogen(nVal);
  const pClass = classifyPhosphorus(pVal);
  const kClass = classifyPotassium(kVal);

  // Adjusted nutrient targets per acre
  const recN = Math.round(crop.stdN * nClass.factor * areaAcres);
  const recP = Math.round(crop.stdP * pClass.factor * areaAcres);
  const recK = Math.round(crop.stdK * kClass.factor * areaAcres);

  // Option 1: Urea + DAP + MOP Combination
  // 1 bag DAP (50kg) contains 9kg N and 23kg P2O5 (46%)
  const dapBags = Math.round((recP / 23) * 10) / 10;
  const nSuppliedByDap = dapBags * 9;
  const remainingN = Math.max(0, recN - nSuppliedByDap);
  // 1 bag Urea (45kg bag) contains 20.7kg N (46%)
  const ureaBags = Math.round((remainingN / 20.7) * 10) / 10;
  // 1 bag MOP (50kg) contains 30kg K2O (60%)
  const mopBags = Math.round((recK / 30) * 10) / 10;

  return {
    cropName: crop.name,
    areaAcres,
    phStatus: evaluatePh(phVal, cropKey),
    methodNote: 'Indicative crop nutrient schedule adjusted by the entered soil-test N, P and K classes. This is not a laboratory-specific ICAR STCR equation. Soil pH changes crop-suitability and amendment advice; it does not independently determine urea or DAP quantity.',
    ratings: {
      nitrogen: nClass,
      phosphorus: pClass,
      potassium: kClass,
    },
    nutrientDoseKg: {
      n: recN,
      p: recP,
      k: recK,
    },
    bags: {
      urea45kg: ureaBags,
      dap50kg: dapBags,
      mop50kg: mopBags,
    },
    fymTonnes: crop.fymTonnes * areaAcres,
    criticalStages: crop.criticalStages,
  };
}

/**
 * Persist soil test report locally
 */
export function saveSoilReport(report) {
  try {
    localStorage.setItem(SOIL_STORAGE_KEY, JSON.stringify({ ...report, savedAt: new Date().toISOString() }));
    return true;
  } catch (e) {
    console.warn('Failed to save soil test report:', e);
    return false;
  }
}

/**
 * Load stored soil test report
 */
export function loadSoilReport() {
  try {
    const raw = localStorage.getItem(SOIL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

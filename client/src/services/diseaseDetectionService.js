/**
 * Crop Disease Detection & Plant Pathology Service for AgriSphere
 * Communicates with backend AI diagnostic endpoint or provides verified ICAR/KVK reference data.
 * Rule: NEVER return simulated/fake AI detection pretending to be computer vision.
 */

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

// Verified ICAR/KVK Plant Pathology Database
export const VERIFIED_PATHOLOGY_CATALOG = [
  {
    id: 'early-blight-tomato',
    name: 'Early Blight (Alternaria solani)',
    crop: 'Tomato & Potato',
    pathogenType: 'Fungal Pathogen',
    symptoms: 'Concentric dark brown rings on older lower leaves, developing into target-board spots and yellow chlorotic halos.',
    causes: 'High humidity (>80%), warm temperatures (24–29°C), and frequent morning dew or overhead splashing.',
    organicPrevention: 'Mulching with straw, wider row spacing for air circulation, and bi-weekly sprays of Trichoderma viride (5g/L) or Neem oil (5ml/L).',
    chemicalTreatment: 'Mancozeb 75% WP @ 2.5g/L or Azoxystrobin 23% SC @ 1ml/L at earliest sign of lower leaf lesions.',
    severity: 'High',
  },
  {
    id: 'fall-armyworm-maize',
    name: 'Fall Armyworm (Spodoptera frugiperda)',
    crop: 'Maize (Corn)',
    pathogenType: 'Lepidopteran Insect Pest',
    symptoms: 'Window-pane feeding, pinholes, and ragged chewed holes on whorl leaves with characteristic moist sawdust-like frass.',
    causes: 'Warm dry spells followed by rain; rapid migration of adult moths laying eggs in masses on young whorls.',
    organicPrevention: 'Intercrop with cowpea or pulses; install pheromone traps (5/acre); apply Metarhizium anisopliae bio-insecticide.',
    chemicalTreatment: 'Whorl application of Emamectin Benzoate 5% SG @ 0.4g/L or Chlorantraniliprole 18.5% SC @ 0.3ml/L during evening hours.',
    severity: 'Severe',
  },
  {
    id: 'chilli-leaf-curl',
    name: 'Chilli Leaf Curl Virus (Begomovirus)',
    crop: 'Chilli',
    pathogenType: 'Viral Disease (Whitefly-transmitted)',
    symptoms: 'Upward curling of leaves, puckering, reduced leaf lamina, thickening of veins, and stunted bushy growth.',
    causes: 'Vector transmission by Whiteflies (Bemisia tabaci) and thrips during hot dry weather.',
    organicPrevention: 'Install 15 yellow sticky traps and 15 blue sticky traps per acre; spray 5% Neem Seed Kernel Extract (NSKE).',
    chemicalTreatment: 'Control insect vectors: Diafenthiuron 50% WP @ 1g/L or Imidacloprid 17.8% SL @ 0.3ml/L. Rogue out severely infected plants.',
    severity: 'High',
  },
  {
    id: 'rice-leaf-blast',
    name: 'Paddy Leaf Blast (Magnaporthe oryzae)',
    crop: 'Rice (Paddy)',
    pathogenType: 'Fungal Pathogen',
    symptoms: 'Spindle-shaped or diamond-shaped lesions with ash-grey centers and reddish-brown borders on paddy leaf blades.',
    causes: 'Excessive nitrogen fertilizer, high relative humidity (>90%), and prolonged leaf wetness.',
    organicPrevention: 'Seed treatment with Pseudomonas fluorescens (10g/kg seed); avoid excessive urea applications.',
    chemicalTreatment: 'Tricyclazole 75% WP @ 0.6g/L or Isoprothiolane 40% EC @ 1.5ml/L at early tillering and panicle emergence.',
    severity: 'Severe',
  },
  {
    id: 'tomato-fruit-borer',
    name: 'Tomato Fruit Borer (Helicoverpa armigera)',
    crop: 'Tomato & Cotton',
    pathogenType: 'Insect Pest',
    symptoms: 'Circular bored entry holes on green and ripening fruits; internal pulp hollowed with larval excreta and secondary rot.',
    causes: 'Moths lay eggs on tender shoots and flower buds; larvae bore directly into developing tomatoes.',
    organicPrevention: 'Plant African marigold as trap crop (1 row marigold per 16 rows tomato); release Trichogramma chilonis egg parasitoids.',
    chemicalTreatment: 'Indoxacarb 14.5% SC @ 0.5ml/L or Flubendiamide 39.35% SC @ 0.25ml/L on initial fruit set.',
    severity: 'High',
  },
  {
    id: 'tikka-leaf-spot',
    name: 'Tikka Leaf Spot (Cercospora arachidicola)',
    crop: 'Groundnut (Peanut)',
    pathogenType: 'Fungal Disease',
    symptoms: 'Small circular dark brown to black spots surrounded by a bright yellow halo on both upper and lower leaf surfaces.',
    causes: 'Prolonged cloudy weather, heavy morning dew, and temperatures between 25–30°C.',
    organicPrevention: 'Crop rotation with non-host cereals; treat seeds with Trichoderma viride (4g/kg seed).',
    chemicalTreatment: 'Foliar spray with Carbendazim 12% + Mancozeb 63% WP @ 2g/L at 40 and 55 days after sowing.',
    severity: 'Medium',
  },
  {
    id: 'powdery-mildew-veg',
    name: 'Powdery Mildew (Erysiphe spp.)',
    crop: 'Chilli & Cucurbits',
    pathogenType: 'Fungal Disease',
    symptoms: 'White powdery superficial fungal patches on leaf surfaces causing yellowing, crinkling, and premature defoliation.',
    causes: 'Dry atmospheric conditions with high morning humidity and shaded foliage.',
    organicPrevention: 'Ensure adequate sunshine and row spacing; spray 0.5% baking soda solution or milk-water emulsion (1:9).',
    chemicalTreatment: 'Wettable Sulphur 80% WP @ 3g/L or Azoxystrobin 11% + Tebuconazole 18.3% SC @ 1ml/L.',
    severity: 'Medium',
  },
];

/**
 * Perform genuine image diagnosis via backend Gemini endpoint if configured
 * @param {File} imageFile - User's uploaded crop leaf photo
 * @param {string} cropHint - Optional crop name hint
 */
export async function diagnoseCropImage(imageFile, cropHint = '') {
  if (!imageFile) {
    throw new Error('Please select an image file to analyze.');
  }

  try {
    // Convert file to base64 string
    const base64Data = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        const base64 = typeof result === 'string' && result.includes(',')
          ? result.split(',')[1]
          : result;
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(imageFile);
    });

    const response = await axios.post(
      `${API_BASE_URL}/diseases/detect`,
      {
        imageBase64: base64Data,
        mimeType: imageFile.type || 'image/jpeg',
        crop: cropHint,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 20000,
      }
    );

    if (response.data && response.data.status === 'success') {
      return {
        isLiveAi: true,
        data: response.data.diagnosis,
      };
    }

    if (response.data && response.data.status === 'api_key_required') {
      return {
        isLiveAi: false,
        status: 'api_key_required',
        message: response.data.message || 'Live Gemini AI Vision API key (GEMINI_API_KEY) not configured in backend.',
        matchedReference: findBestReference(imageFile.name, cropHint),
      };
    }

    return {
      isLiveAi: false,
      status: 'service_unavailable',
      message: 'Live diagnosis service currently unavailable.',
      matchedReference: findBestReference(imageFile.name, cropHint),
    };
  } catch (error) {
    // Honest offline handling - DO NOT fabricate AI detection
    return {
      isLiveAi: false,
      status: 'backend_offline',
      message: 'AI Vision Server is offline or GEMINI_API_KEY is not configured in backend environment.',
      matchedReference: findBestReference(imageFile.name, cropHint),
    };
  }
}

/**
 * Find closest matching verified pathology guideline from catalog
 */
function findBestReference(filename = '', cropHint = '') {
  const q = `${filename} ${cropHint}`.toLowerCase();
  for (const item of VERIFIED_PATHOLOGY_CATALOG) {
    if (q.includes(item.crop.toLowerCase().split(' ')[0])) {
      return item;
    }
  }
  return null;
}

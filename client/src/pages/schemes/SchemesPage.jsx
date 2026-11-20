import React, { useState, useMemo } from 'react';
import {
  Landmark,
  Search,
  ExternalLink,
  MapPin,
  CheckCircle2,
  FileText,
  Clock,
  Building2,
  X,
  Phone,
  ChevronRight,
  ShieldCheck,
  Navigation,
  Globe,
  Sparkles,
} from 'lucide-react';
import LeafletMap from '../../components/common/LeafletMap.jsx';
import { useLocationContext } from '../../context/LocationContext.jsx';
import { calculateDistanceKm } from '../../services/marketService.js';

// Verified Central & State Agricultural Schemes Data
const schemesData = [
  // ==========================================
  // 1. Income Support Schemes
  // ==========================================
  {
    id: 'pm-kisan',
    name: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
    category: 'Income Support',
    level: 'Central Government',
    targetState: 'All India',
    description: 'Central sector scheme providing income support to all landholding farmer families across India to supplement agricultural inputs and household needs.',
    benefit: '₹6,000 per year directly into bank accounts in 3 equal installments of ₹2,000.',
    eligibility: 'All landholder farmer families with cultivable land in their names across all states.',
    documents: ['Aadhaar Card linked with bank account', 'Land ownership documents (RTC / 7/12 / Pahani)', 'Active Bank Account / IFSC'],
    process: 'Apply online via pmkisan.gov.in or visit your local Gram Panchayat / Raitha Samparka Kendra with land records.',
    link: 'https://pmkisan.gov.in/',
  },
  {
    id: 'pm-kmy',
    name: 'Pradhan Mantri Kisan Maandhan Yojana (PM-KMY)',
    category: 'Income Support',
    level: 'Central Government',
    targetState: 'All India',
    description: 'Voluntary and contributory old-age pension scheme offering financial security to small and marginal farmers in their senior years.',
    benefit: 'Guaranteed monthly pension of ₹3,000 after attaining 60 years of age. Monthly contribution of ₹55–₹200 matched 100% by Central Government.',
    eligibility: 'Small and marginal landholder farmers aged 18 to 40 years with cultivable landholding up to 2 hectares (5 acres).',
    documents: ['Aadhaar Card', 'Savings Bank Account / Jan Dhan Account with IFSC', 'Land Record (RTC / Pahani / 7/12 Extract)', 'Nominee details'],
    process: 'Enroll through local Common Service Centre (CSC) or self-register on the official Maandhan portal (maandhan.in) with e-KYC.',
    link: 'https://maandhan.in/',
  },
  {
    id: 'raitha-vidya-nidhi',
    name: 'Mukhyamantri Raitha Vidya Nidhi (Karnataka)',
    category: 'Income Support',
    level: 'State Scheme (Karnataka)',
    targetState: 'Karnataka',
    description: 'Karnataka state direct income support scholarship to encourage higher education among children of farmers.',
    benefit: 'Annual financial assistance of ₹2,000 to ₹11,000 credited directly to students bank accounts via DBT for PUC, ITI, Diploma, Under-Graduate, and Post-Graduate courses.',
    eligibility: 'Children of farmers possessing agricultural land in Karnataka registered under the FRUITS database, enrolled in recognized higher education institutions.',
    documents: ['Farmer FRUITS ID (FID)', 'Student Aadhaar Card', 'College Admission Fee Receipt / Bonafide Certificate', 'Aadhaar-seeded Bank Account'],
    process: 'Apply through Karnataka State Scholarship Portal (SSP). Verification is completed automatically against the Agriculture Departments FRUITS repository.',
    link: 'https://ssp.postmatric.karnataka.gov.in/',
  },
  {
    id: 'kisan-credit-card',
    name: 'Kisan Credit Card (KCC) Scheme',
    category: 'Income Support',
    level: 'Central Government',
    targetState: 'All India',
    description: 'Institutional credit mechanism offering low-interest working capital and production loans for agriculture, fisheries, and animal husbandry.',
    benefit: 'Short-term crop cultivation credit up to ₹3,00,000 at a concessional 4% interest rate per annum (with 3% prompt repayment incentive). Collateral-free limit up to ₹1.60 Lakh.',
    eligibility: 'All farmers, individual or joint borrowers, tenant farmers, oral lessees, sharecroppers, and SHG/JLG farmer groups.',
    documents: ['Duly completed KCC application', 'Identity & Address Proof (Aadhaar / Voter ID)', 'Land records (RTC / Pahani / 7/12)', 'Cropping pattern details', 'Passport-size photographs'],
    process: 'Apply at your nearest commercial bank, Regional Rural Bank (RRB), Cooperative Bank branch, or initiate request online through JanSamarth portal.',
    link: 'https://www.jansamarth.in/',
  },

  // ==========================================
  // 2. Crop Insurance Schemes
  // ==========================================
  {
    id: 'pmfby',
    name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    category: 'Crop Insurance',
    level: 'Central & State Scheme',
    targetState: 'All India',
    description: 'Comprehensive risk and crop insurance scheme shielding farmers against non-preventable natural perils from pre-sowing to post-harvest stages.',
    benefit: 'Comprehensive risk coverage from pre-sowing to post-harvest crop losses due to drought, unseasonal rains, or pest attacks.',
    eligibility: 'All farmers growing notified crops (Kharif/Rabi) in notified insurance units. Nominal premium (1.5% - 2%).',
    documents: ['RTC / Land records', 'Sowing Certificate from Village Accountant / RSK', 'Bank Passbook copy', 'Aadhaar Card'],
    process: 'Enroll through designated banks, Common Service Centres (CSC), or via the Samrakshane / PMFBY portal within cutoff date.',
    link: 'https://pmfby.gov.in/',
  },
  {
    id: 'rwbcis',
    name: 'Restructured Weather Based Crop Insurance Scheme (RWBCIS)',
    category: 'Crop Insurance',
    level: 'Central & State Scheme',
    targetState: 'All India',
    description: 'Weather index-based parametric insurance providing swift indemnity against adverse weather variations like rainfall deficit, excess rain, frost, and heatwaves.',
    benefit: 'Automated claim payout calculation using Reference Weather Stations (RWS). Capped farmer premium: 1.5% for Rabi, 2% for Kharif food crops/oilseeds, and 5% for commercial/horticultural crops.',
    eligibility: 'All farmers cultivating notified crops in designated reference weather station reference units (loanee and non-loanee farmers).',
    documents: ['Land ownership proof (RTC / 7/12)', 'Sowing certificate / Self-declaration of crop sown', 'Aadhaar Card', 'Bank passbook copy'],
    process: 'Enroll through designated bank branches, Common Service Centres (CSC), or via pmfby.gov.in before the notified seasonal cutoff date.',
    link: 'https://pmfby.gov.in/',
  },
  {
    id: 'karnataka-samrakshane',
    name: 'Karnataka Samrakshane (Crop Insurance Portal)',
    category: 'Crop Insurance',
    level: 'State Scheme (Karnataka)',
    targetState: 'Karnataka',
    description: 'Dedicated digital crop insurance administration platform in Karnataka integrating Bhoomi land records and FRUITS for seamless premium calculation and claim tracking.',
    benefit: 'Transparent end-to-end crop loss enrollment covering localized calamities, mid-season drought adversity, and post-harvest losses with direct DBT claim settlement.',
    eligibility: 'All farmers growing notified Kharif, Rabi, or Summer crops in notified gram panchayats/hoblis of Karnataka.',
    documents: ['FRUITS ID (FID)', 'Bhoomi RTC (Pahani)', 'Crop Sowing Certificate from RSK', 'Aadhaar-linked Bank Account'],
    process: 'Submit insurance application online via samrakshane.karnataka.gov.in, or visit Grama One / Karnataka One / RSK centres with your FRUITS ID.',
    link: 'https://samrakshane.karnataka.gov.in/',
  },
  {
    id: 'cpis-insurance',
    name: 'Coconut Palm Insurance Scheme (CPIS)',
    category: 'Crop Insurance',
    level: 'Central & State Scheme',
    targetState: 'All India',
    description: 'Specialized tree insurance scheme implemented by the Coconut Development Board to compensate growers against total loss or fatality of bearing coconut palms.',
    benefit: 'Sum insured compensation up to ₹2,000 per palm (4 to 15 years old) and ₹4,000 per palm (16 to 60 years old). 50% to 75% of insurance premium subsidized by Coconut Development Board and State.',
    eligibility: 'Growers cultivating at least 5 healthy, bearing coconut palms in contiguous garden holdings.',
    documents: ['Land records confirming coconut plantation', 'Aadhaar Card', 'Bank passbook copy', 'Palm count certificate from local Horticulture Officer'],
    process: 'Apply through local Senior Assistant Director of Horticulture (SADH) or registered agricultural insurance partner agencies.',
    link: 'https://www.coconutboard.gov.in/',
  },

  // ==========================================
  // 3. Irrigation & Water Schemes
  // ==========================================
  {
    id: 'pmksy-drip',
    name: 'Per Drop More Crop - PMKSY Micro-Irrigation',
    category: 'Irrigation & Water',
    level: 'Central & State Scheme',
    targetState: 'All India',
    description: 'Water conservation mission promoting precision micro-irrigation technologies (drip and sprinkler) to maximize water productivity per crop.',
    benefit: 'Up to 90% subsidy for small and marginal farmers (SC/ST 90%, General 75%–90%) for installing drip and sprinkler units.',
    eligibility: 'Farmers possessing minimum 0.5 acre cultivable land with an assured perennial water source (borewell/well).',
    documents: ['RTC / 7/12 Extract', 'Water source availability certificate', 'Aadhaar Card', 'Soil & Water test report'],
    process: 'Submit application through State Agriculture / Horticulture portal or at the Taluk Assistant Director of Agriculture office.',
    link: 'https://pmksy.gov.in/',
  },
  {
    id: 'krishi-bhagya',
    name: 'Krishi Bhagya Rainwater Harvesting',
    category: 'Irrigation & Water',
    level: 'State Scheme (Karnataka)',
    targetState: 'Karnataka',
    description: 'Karnataka dryland agriculture initiative supporting rainwater harvesting through polythene-lined farm ponds, diesel pumps, and micro-irrigation.',
    benefit: 'Up to 80% subsidy for digging farm ponds (Krishi Honda), polythene lining, diesel pumpsets, and shade-net nurseries.',
    eligibility: 'Farmers in rainfed agro-climatic zones of Karnataka with minimum 1 acre holding.',
    documents: ['RTC', 'FRUITS ID', 'Aadhaar Card', 'Bank account details'],
    process: 'Submit application at Raitha Samparka Kendra. Department engineers verify field suitability before work orders are issued.',
    link: 'https://raitamitra.karnataka.gov.in/',
  },
  {
    id: 'pm-kusum',
    name: 'PM-KUSUM (Solar Agricultural Pumps Scheme)',
    category: 'Irrigation & Water',
    level: 'Central Government',
    targetState: 'All India',
    description: 'Decentralized solar energy initiative enabling farmers to install standalone solar pumps or solarize existing grid pumps for daytime irrigation and surplus power export.',
    benefit: 'Up to 60% total subsidy (30% Central Government + 30% State Government) on solar water pumping systems (3 HP to 10 HP). Farmer pays 10% upfront, with remaining 30% available as bank loan.',
    eligibility: 'Individual farmers, Farmer Producer Organizations (FPOs), cooperatives, and water user associations with agricultural land and valid water source.',
    documents: ['Aadhaar Card', 'Land ownership proof (RTC / 7/12)', 'Borewell/well water yield certificate', 'Bank passbook', 'Passport photos'],
    process: 'Apply online through State Renewable Energy Development Agencies (e.g., KREDL in Karnataka at kredlinfo.in) or MNRE PM-KUSUM national portal.',
    link: 'https://pmkusum.mnre.gov.in/',
  },
  {
    id: 'ganga-kalyana',
    name: 'Karnataka Ganga Kalyana Yojana',
    category: 'Irrigation & Water',
    level: 'State Scheme (Karnataka)',
    targetState: 'Karnataka',
    description: 'Karnataka government irrigation initiative providing free individual or community borewells with submersible pumps and power infrastructure to disadvantaged farmers.',
    benefit: '100% government-funded borewell drilling, casing pipe, submersible pumpset, and power line energization (subsidy up to ₹3.75 Lakh to ₹4.25 Lakh per beneficiary).',
    eligibility: 'Small and marginal farmers belonging to SC, ST, and OBC communities (Categories 1, 2A, 2B, 3A, 3B) possessing 1 to 5 acres of rainfed land without any existing irrigation.',
    documents: ['Caste & Income Certificate issued by Tahsildar (RDPR)', 'RTC / Pahani', 'Aadhaar Card', 'BPL Ration Card', 'No-prior-irrigation certificate from Village Accountant'],
    process: 'Submit application on Karnataka Seva Sindhu portal (sevasindhu.karnataka.gov.in) or through Dr. B.R. Ambedkar, D. Devaraj Urs, or KMDC Corporation offices.',
    link: 'https://sevasindhu.karnataka.gov.in/',
  },
  {
    id: 'pmksy-hkkp',
    name: 'PMKSY - Har Khet Ko Pani (Command Area & Surface Irrigation)',
    category: 'Irrigation & Water',
    level: 'Central & State Scheme',
    targetState: 'All India',
    description: 'Centrally sponsored scheme focused on creating new water sources, repair and restoration of traditional water bodies, and command area development.',
    benefit: 'Government assistance for renovating village water tanks, lift irrigation systems, surface minor irrigation, and canal water distribution network expansion.',
    eligibility: 'Farmers and Water User Associations (WUAs) in notified watershed command areas and water-stressed blocks.',
    documents: ['Land records (RTC / Pahani)', 'Water User Association membership verification', 'Aadhaar Card'],
    process: 'Contact Taluk Minor Irrigation Department, Command Area Development Authority (CADA), or local Panchayat Development Officer (PDO).',
    link: 'https://pmksy.gov.in/',
  },

  // ==========================================
  // 4. Farm Machinery Schemes
  // ==========================================
  {
    id: 'smam',
    name: 'SMAM (Sub-Mission on Agricultural Mechanization)',
    category: 'Farm Machinery',
    level: 'Central Government',
    targetState: 'All India',
    description: 'Centrally sponsored mission promoting inclusive agricultural mechanization, farm equipment subsidies, and custom hiring hubs across India.',
    benefit: '40% to 50% financial subsidy on purchase of tractors, rotavators, power tillers, seed drills, and sprayers.',
    eligibility: 'Individual farmers, women self-help groups, cooperative societies, and custom hiring entrepreneurs.',
    documents: ['Aadhaar Card', 'Land ownership proof', 'Quotation from authorized machinery dealer', 'Bank passbook'],
    process: 'Apply online at agrimachinery.nic.in, obtain administrative sanction, purchase equipment, and submit invoice for DBT subsidy.',
    link: 'https://agrimachinery.nic.in/',
  },
  {
    id: 'krishi-yantra-dhare',
    name: 'Krishi Yantra Dhare (Custom Hiring Centres)',
    category: 'Farm Machinery',
    level: 'State Scheme (Karnataka)',
    targetState: 'Karnataka',
    description: 'Karnataka state custom hiring initiative enabling small and marginal farmers to hire high-tech agricultural machinery at subsidized hourly rates.',
    benefit: 'Rental access to expensive farm machinery (tractors, harvesters, laser levellers) at 40% subsidized hourly rates.',
    eligibility: 'All small and marginal farmers in Karnataka lacking financial capacity to buy high-cost machinery.',
    documents: ['Aadhaar Card', 'Farmer ID (FID) / RTC copy'],
    process: 'Book machinery slots directly at your hobli-level Krishi Yantra Dhare service centre or via the mobile booking app.',
    link: 'https://raitamitra.karnataka.gov.in/',
  },
  {
    id: 'kisan-drone-scheme',
    name: 'Kisan Drone Scheme (Agricultural Drone Subsidy)',
    category: 'Farm Machinery',
    level: 'Central Government',
    targetState: 'All India',
    description: 'Hi-tech mechanization program promoting precision agriculture via drones for foliar pesticide/fertilizer spraying, remote sensing, and crop damage appraisal.',
    benefit: '50% subsidy (up to ₹5,00,000) for SC/ST, women, and small/marginal farmers; 40% subsidy (up to ₹4,00,000) for other individual farmers; up to 75% for Farmer Producer Organizations (FPOs).',
    eligibility: 'Individual farmers, registered FPOs, Custom Hiring Centres, and agriculture graduates holding a DGCA-certified Remote Pilot Certificate.',
    documents: ['Aadhaar Card', 'Land holding document (RTC / 7/12)', 'DGCA Drone Pilot Training Certificate', 'Quotation from authorized type-certified drone manufacturer', 'Bank Passbook'],
    process: 'Apply online at agrimachinery.nic.in under Sub-Mission on Agricultural Mechanization (SMAM) - Drone Subsidy module.',
    link: 'https://agrimachinery.nic.in/',
  },
  {
    id: 'karnataka-farm-mechanization',
    name: 'Karnataka Farm Mechanization Scheme',
    category: 'Farm Machinery',
    level: 'State Scheme (Karnataka)',
    targetState: 'Karnataka',
    description: 'Karnataka state agriculture department program subsidizing power tillers, diesel engine pumpsets, weeders, power sprayers, and threshers.',
    benefit: '50% financial subsidy for General category farmers (up to ₹1 Lakh depending on implement) and up to 90% subsidy for SC/ST farmers under SCP/TSP allocations.',
    eligibility: 'Farmers in Karnataka with valid FRUITS ID owning cultivable agricultural land.',
    documents: ['FRUITS ID (FID)', 'Aadhaar Card', 'Bhoomi RTC (Pahani)', 'Caste Certificate (for SC/ST subsidy)', 'Bank Account details'],
    process: 'Apply through Karnataka Raita Mitra portal (raitamitra.karnataka.gov.in) or register at your Hobli Raitha Samparka Kendra.',
    link: 'https://raitamitra.karnataka.gov.in/',
  },
  {
    id: 'chc-farm-machinery',
    name: 'Establishment of Custom Hiring Centres (CHC Scheme)',
    category: 'Farm Machinery',
    level: 'Central & State Scheme',
    targetState: 'All India',
    description: 'Assistance scheme to set up village machinery banks equipped with tractors, combine harvesters, and laser levelers for rental access to smallholders.',
    benefit: '40% capital subsidy on project costs up to ₹60 Lakh for entrepreneurs and cooperatives; up to 80% subsidy (up to ₹10 Lakh) for dedicated FPO machinery banks.',
    eligibility: 'Rural entrepreneurs, registered Farmer Producer Organizations (FPOs), Cooperative Societies, and registered Self-Help Groups (SHGs).',
    documents: ['Detailed Project Report (DPR)', 'FPO / Society Registration Certificate', 'Aadhaar & PAN Card of applicant/directors', 'Bank loan sanction letter', 'Machinery quotation'],
    process: 'Submit DPR and online application through agrimachinery.nic.in or submit proposals to the District Joint Director of Agriculture (JDA) office.',
    link: 'https://agrimachinery.nic.in/',
  },

  // ==========================================
  // 5. Soil & Nutrients Schemes
  // ==========================================
  {
    id: 'soil-health-card',
    name: 'Soil Health Card Scheme',
    category: 'Soil & Nutrients',
    level: 'Central Government',
    targetState: 'All India',
    description: 'Soil management scheme issuing periodic soil health status cards to farmers with customized crop-specific fertilizer and micronutrient advisory.',
    benefit: 'Free periodic soil testing with customized crop-specific fertilizer and micronutrient advisory cards every 3 years.',
    eligibility: 'Every farmer cultivating agricultural land.',
    documents: ['Land ownership details', 'Aadhaar Card'],
    process: 'Contact local Agriculture Officer or collect sample as per guidelines and submit to nearest Taluk Soil Testing Lab.',
    link: 'https://soilhealth.dac.gov.in/',
  },
  {
    id: 'pkvy-organic',
    name: 'Paramparagat Krishi Vikas Yojana (PKVY)',
    category: 'Soil & Nutrients',
    level: 'Central Government',
    targetState: 'All India',
    description: 'Sub-component of Soil Health Management supporting chemical-free organic farming clusters, Participatory Guarantee System (PGS) certification, and bio-input adoption.',
    benefit: '₹50,000 per hectare assistance over 3 years, including ₹31,000 DBT to farmers for organic inputs (seeds, bio-fertilizers, vermicompost) and ₹19,000 for cluster training and certification.',
    eligibility: 'Farmers forming a contiguous cluster of 50 or more members covering at least 20 hectares (50 acres) committed to organic farming.',
    documents: ['Aadhaar Card', 'Land ownership document (RTC / 7/12)', 'Cluster group formation resolution', 'Bank passbook copy'],
    process: 'Form an organic cluster with local Raitha Samparka Kendra / Block Agriculture Office or enroll directly on the Jaivik Kheti portal.',
    link: 'https://jaivikkheti.in/',
  },
  {
    id: 'nmnf-natural-farming',
    name: 'National Mission on Natural Farming (NMNF)',
    category: 'Soil & Nutrients',
    level: 'Central Government',
    targetState: 'All India',
    description: 'National initiative promoting livestock-integrated natural farming, chemical-free bio-formulations (Jeevamrut, Beejamrut), and indigenous soil fertility conservation.',
    benefit: 'Financial incentive of ₹15,000 per hectare spread over 3 years for creating on-farm bio-input preparation units, training, certification, and establishing Bio-input Resource Centres.',
    eligibility: 'All farmers willing to switch to chemical-free, regenerative natural farming practices across all agro-climatic zones.',
    documents: ['Aadhaar Card', 'Land ownership records (RTC / 7/12)', 'Bank account details', 'Livestock ownership self-declaration'],
    process: 'Register on the National Natural Farming Portal (naturalfarming.dac.gov.in) or enroll through nearest Krishi Vigyan Kendra (KVK).',
    link: 'https://naturalfarming.dac.gov.in/',
  },
  {
    id: 'pm-pranam',
    name: 'PM-PRANAM (Alternative Fertilizers & Soil Health)',
    category: 'Soil & Nutrients',
    level: 'Central Government',
    targetState: 'All India',
    description: 'Programme for Restoration, Awareness, Nourishment & Amelioration of Mother Earth incentivizing balanced fertilizer use and adopting Nano Urea, Nano DAP, and organic manure.',
    benefit: 'Subsidized supply of liquid Nano Urea and Nano DAP reducing cultivation costs by 50%; 50% fertilizer subsidy savings channeled back into village panchayat composting and bio-fertilizer plants.',
    eligibility: 'All agricultural landholders, Gram Panchayats, Primary Agricultural Credit Societies, and farmer groups.',
    documents: ['Aadhaar Card', 'Soil Health Card report / Land records', 'Cooperative society membership'],
    process: 'Access subsidized Nano Urea, Nano DAP, and bio-fertilizers through Primary Agricultural Credit Societies (PACS), IFFCO eBazar, or licensed agro-retailers.',
    link: 'https://www.fert.nic.in/',
  },
  {
    id: 'savayava-bhagya',
    name: 'Karnataka Savayava Bhagya Yojana',
    category: 'Soil & Nutrients',
    level: 'State Scheme (Karnataka)',
    targetState: 'Karnataka',
    description: 'Karnataka state scheme promoting organic farming through hobli-level farmer federations, vermicompost units, and subsidized biological pest controllers.',
    benefit: 'Up to 50% subsidy on bio-fertilizers, green manure seeds (Sunn hemp/Dhaincha), vermiculture units, and free group organic certification under PGS-India.',
    eligibility: 'Small and marginal farmers registered in Karnataka with a valid FRUITS ID committed to chemical-free agriculture.',
    documents: ['FRUITS ID (FID)', 'RTC / Pahani', 'Aadhaar Card', 'Bank account details'],
    process: 'Apply at your Hobli Raitha Samparka Kendra (RSK) during pre-monsoon input distribution drives.',
    link: 'https://raitamitra.karnataka.gov.in/',
  },

  // ==========================================
  // 6. State Subsidies
  // ==========================================
  {
    id: 'raitha-siri',
    name: 'Raitha Siri Millet Incentive Scheme',
    category: 'State Subsidies',
    level: 'State Scheme (Karnataka)',
    targetState: 'Karnataka',
    description: 'Karnataka state flagship incentive scheme promoting the cultivation of nutrient-rich minor millets through direct per-hectare cash assistance.',
    benefit: 'Direct incentive of ₹10,000 per hectare (up to 2 hectares) for farmers cultivating minor millets (Ragi, Jowar, Bajra).',
    eligibility: 'Farmers registered on Karnataka FRUITS portal cultivating designated minor millets.',
    documents: ['FRUITS ID (FID)', 'Aadhaar Card', 'RTC showing millet crop crop-cutting survey entry'],
    process: 'Enroll through your local Raitha Samparka Kendra after sowing inspection is completed by agriculture officers.',
    link: 'https://raitamitra.karnataka.gov.in/',
  },
  {
    id: 'mahadbt-farmer',
    name: 'MahaDBT Farmer Schemes (Maharashtra)',
    category: 'State Subsidies',
    level: 'State Scheme (Maharashtra)',
    targetState: 'Maharashtra',
    description: 'Maharashtra state unified Direct Benefit Transfer portal providing streamlined online subsidies for irrigation, machinery, and farm structures.',
    benefit: 'Direct Benefit Transfer subsidies on farm ponds, drip irrigation, shade net houses, and tractor implements.',
    eligibility: 'Resident farmers of Maharashtra with valid 7/12 land extract and Aadhaar linkage.',
    documents: ['Aadhaar Card', '7/12 Extract', '8A Extract', 'Bank Passbook'],
    process: 'Register on mahadbt.maharashtra.gov.in, select agricultural schemes lottery, and upload necessary land records.',
    link: 'https://mahadbt.maharashtra.gov.in/',
  },
  {
    id: 'karnataka-seed-subsidy',
    name: 'Karnataka Certified Seed & Input Subsidy',
    category: 'State Subsidies',
    level: 'State Scheme (Karnataka)',
    targetState: 'Karnataka',
    description: 'Karnataka Department of Agriculture flagship program distributing high-yield certified crop seeds, gypsum, zinc sulphate, and bio-pesticides at subsidized rates.',
    benefit: '50% direct subsidy for General category farmers (up to ₹1,500 per quintal) and 75% subsidy for SC/ST farmers on certified crop seeds (Paddy, Ragi, Maize, Pulses, Oilseeds).',
    eligibility: 'All landowning farmers in Karnataka registered with FRUITS ID and biometric verification.',
    documents: ['FRUITS ID (FID) / Biometric authentication', 'RTC / Pahani copy', 'Aadhaar Card'],
    process: 'Visit your nearest Hobli Raitha Samparka Kendra (RSK) with your FRUITS ID prior to sowing season to collect subsidized seed allocations directly.',
    link: 'https://raitamitra.karnataka.gov.in/',
  },
  {
    id: 'karnataka-horticulture-drip',
    name: 'Karnataka Horticulture Drip & Sprinkler Subsidy',
    category: 'State Subsidies',
    level: 'State Scheme (Karnataka)',
    targetState: 'Karnataka',
    description: 'Karnataka Horticulture Department top-up program delivering enhanced subsidies for precision micro-irrigation installations in horticulture and vegetable crops.',
    benefit: '90% subsidy for SC/ST small/marginal farmers (up to 2 hectares) and 75% to 90% subsidy for General category farmers for drip and sprinkler irrigation installations.',
    eligibility: 'Farmers cultivating fruits, vegetables, flowers, spices, or plantation crops in Karnataka with an assured water source (borewell/open well/canal).',
    documents: ['FRUITS ID (FID)', 'RTC / Pahani showing horticultural crops', 'Water test & soil test report', 'Aadhaar Card', 'Pumpset electricity bill'],
    process: 'Apply online through the Karnataka Department of Horticulture portal (horticulturedir.karnataka.gov.in) or visit Taluk Senior Assistant Director of Horticulture office.',
    link: 'https://horticulturedir.karnataka.gov.in/',
  },
  {
    id: 'karnataka-pashu-bhagya',
    name: 'Karnataka Pashu Bhagya Scheme (Dairy & Livestock Subsidy)',
    category: 'State Subsidies',
    level: 'State Scheme (Karnataka)',
    targetState: 'Karnataka',
    description: 'Department of Animal Husbandry and Veterinary Services subsidy scheme encouraging farmers to adopt cattle, sheep, goat, and poultry rearing as secondary income.',
    benefit: '33% back-ended capital subsidy (up to ₹1.20 Lakh) for General category and 50% subsidy (up to ₹1.75 Lakh) for SC/ST beneficiaries on institutional loans for livestock units and animal housing.',
    eligibility: 'Small and marginal farmers, agricultural laborers, and rural women in Karnataka.',
    documents: ['FRUITS ID / Resident Certificate', 'Aadhaar Card', 'Caste and Income Certificate (for SC/ST subsidy)', 'Bank passbook copy', 'Land records (where applicable)'],
    process: 'Submit application on Karnataka Seva Sindhu portal (sevasindhu.karnataka.gov.in) or through the local Taluk Veterinary Hospital / AHVS office.',
    link: 'https://sevasindhu.karnataka.gov.in/',
  },
  {
    id: 'karnataka-ksheera-dhare',
    name: 'Karnataka Ksheera Dhare (Milk Incentive Scheme)',
    category: 'State Subsidies',
    level: 'State Scheme (Karnataka)',
    targetState: 'Karnataka',
    description: 'Karnataka government flagship milk subsidy providing direct incentive per liter to dairy farmers pouring milk into cooperative societies.',
    benefit: 'Direct Benefit Transfer incentive of ₹5 per liter of milk supplied to Karnataka Milk Federation (KMF) / Nandini village cooperative societies, paid directly to farmers bank accounts.',
    eligibility: 'Dairy-rearing farmers in Karnataka who are active members of registered village Milk Producers Cooperative Societies (MPCS).',
    documents: ['MPCS Membership Card / Member Passbook', 'Aadhaar Card linked to bank account', 'Bank passbook IFSC details', 'FRUITS ID'],
    process: 'Supply milk daily to the local village Milk Producers Cooperative Society (MPCS). Monthly milk records are uploaded to KMF and incentive is disbursed directly via DBT.',
    link: 'https://www.kmfnandini.coop/',
  },
];

// Verified Regional Agriculture Extension & RSK Offices
const baseAgricultureOffices = [
  {
    id: 'rsk-belagavi',
    name: 'Raitha Samparka Kendra (RSK) Belagavi',
    position: [15.8621, 74.5085],
    color: '#15803D',
    address: 'Near Old PB Road, Agriculture Complex, Belagavi 590001',
    contact: '+91 831 240 7215',
    hours: 'Mon - Fri: 10:00 AM - 05:30 PM',
    description: 'Hobli level office for seed distribution, soil test cards, and PM-KISAN verification.',
  },
  {
    id: 'jda-office',
    name: 'Joint Director of Agriculture (JDA) Office',
    position: [15.8524, 74.4988],
    color: '#14532D',
    address: 'Club Road, Near Deputy Commissioner Office, Belagavi 590001',
    contact: '+91 831 242 0423',
    hours: 'Mon - Fri: 10:00 AM - 05:30 PM',
    description: 'District headquarters for all Central & Karnataka State agricultural scheme administration.',
  },
  {
    id: 'rsk-gokak',
    name: 'Raitha Samparka Kendra Gokak',
    position: [16.1685, 74.8312],
    color: '#2563EB',
    address: 'APMC Market Campus, Ghataprabha Road, Gokak 591307',
    contact: '+91 8332 225 110',
    hours: 'Mon - Fri: 10:00 AM - 05:30 PM',
    description: 'Sub-division office handling drip irrigation subsidies and custom hiring equipment booking.',
  },
  {
    id: 'rsk-chikodi',
    name: 'Raitha Samparka Kendra Chikodi',
    position: [16.4312, 74.5985],
    color: '#D97706',
    address: 'Court Circle, Near Taluk Panchayat, Chikodi 591201',
    contact: '+91 8338 272 104',
    hours: 'Mon - Fri: 10:00 AM - 05:30 PM',
    description: 'Local extension counter for PMFBY insurance claims and subsidized certified seeds.',
  },
  {
    id: 'rsk-bailhongal',
    name: 'Raitha Samparka Kendra Bailhongal',
    position: [15.8155, 74.8612],
    color: '#7C3AED',
    address: 'Station Road, Near Old Bus Stand, Bailhongal 591102',
    contact: '+91 8288 233 045',
    hours: 'Mon - Fri: 10:00 AM - 05:30 PM',
    description: 'Extension center for cotton mechanization, crop loss surveys, and organic farming clusters.',
  },
];

const categories = [
  'All',
  'Income Support',
  'Crop Insurance',
  'Irrigation & Water',
  'Farm Machinery',
  'Soil & Nutrients',
  'State Subsidies',
];

const SchemesPage = () => {
  const {
    latitude,
    longitude,
    city,
    district,
    state,
    formattedName,
    isGps,
    isGlobal,
  } = useLocationContext();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [showOfficesMap, setShowOfficesMap] = useState(false);

  const userLat = latitude ?? 15.8497;
  const userLng = longitude ?? 74.4977;
  const hasUserCoords = latitude != null && longitude != null;

  // Compute live distances for extension offices
  const officesWithDistances = useMemo(() => {
    return baseAgricultureOffices.map((office) => {
      const distanceKm = hasUserCoords
        ? calculateDistanceKm(
            userLat,
            userLng,
            office.position[0],
            office.position[1]
          )
        : null;
      return {
        ...office,
        distanceKm,
      };
    }).sort((a, b) => {
      if (a.distanceKm != null && b.distanceKm != null) return a.distanceKm - b.distanceKm;
      return 0;
    });
  }, [hasUserCoords, userLat, userLng]);

  // Prioritize schemes matching user's active state
  const prioritizedSchemes = useMemo(() => {
    const userState = (state || '').toLowerCase();
    return [...schemesData].sort((a, b) => {
      const aMatches = a.targetState === 'All India' || (userState && a.targetState.toLowerCase().includes(userState));
      const bMatches = b.targetState === 'All India' || (userState && b.targetState.toLowerCase().includes(userState));
      if (aMatches && !bMatches) return -1;
      if (!aMatches && bMatches) return 1;
      return 0;
    });
  }, [state]);

  const filteredSchemes = useMemo(() => {
    return prioritizedSchemes.filter((item) => {
      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !q ||
        item.name.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q)) ||
        item.benefit.toLowerCase().includes(q) ||
        item.eligibility.toLowerCase().includes(q) ||
        item.level.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [prioritizedSchemes, selectedCategory, searchQuery]);

  // Map markers: User location + extension offices
  const mapMarkers = useMemo(() => {
    const list = [];
    if (hasUserCoords) {
      list.push({
        id: 'user-pin',
        title: `Your Active Location (${formattedName})`,
        type: isGps ? 'GPS Verified' : 'Location',
        position: [userLat, userLng],
        color: '#2563EB',
        description: `Coordinates: ${userLat.toFixed(4)}°N, ${userLng.toFixed(4)}°E`,
      });
    }
    return [...list, ...officesWithDistances];
  }, [hasUserCoords, userLat, userLng, formattedName, isGps, officesWithDistances]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#15803D] bg-[#DCFCE7] px-2.5 py-1 rounded-md mb-2">
            <Landmark className="w-3.5 h-3.5" />
            <span>Government Direct Benefit & Subsidy Schemes</span>
          </div>
          <h1 className="text-2xl font-bold text-[#14532D]">Government Schemes</h1>
          <p className="text-sm text-[#64748B] mt-1">
            Official central and state government agricultural subsidies, income support, and crop insurance schemes for{' '}
            <span className="font-semibold text-slate-800">{state || formattedName}</span>.
          </p>
        </div>

        {/* Action Toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 bg-[#F8FAF6] border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-[#1F2937]">
            {isGps ? (
              <Navigation className="w-3.5 h-3.5 text-[#15803D]" />
            ) : isGlobal ? (
              <Globe className="w-3.5 h-3.5 text-slate-500" />
            ) : (
              <MapPin className="w-3.5 h-3.5 text-[#15803D]" />
            )}
            <span className="font-semibold truncate max-w-[150px]">{formattedName}</span>
          </div>
          <button
            onClick={() => setShowOfficesMap(!showOfficesMap)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-[#15803D] hover:bg-[#DCFCE7] text-xs font-semibold"
          >
            <Building2 className="w-4 h-4" />
            <span>{showOfficesMap ? 'Hide Extension Offices' : 'Extension Offices Map'}</span>
          </button>
        </div>
      </div>

      {/* Verification Notice */}
      <div className="bg-emerald-50/80 rounded-xl border border-emerald-200 p-4 flex items-center justify-between gap-3 text-xs text-emerald-900">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>
            <strong className="font-bold">Official Verification: </strong>
            All listed schemes link directly to government portals (.gov.in / .nic.in). Guidelines active for the 2025–2026 financial year.
          </span>
        </div>
        <span className="bg-white text-emerald-800 font-semibold px-2.5 py-1 rounded-md border border-emerald-200 shrink-0 hidden sm:inline-block">
          Direct DBT Portal
        </span>
      </div>

      {/* Extension Offices Map Collapsible */}
      {showOfficesMap && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-[#1F2937]">
                Raitha Samparka Kendras (RSK) & District Agriculture Offices
              </h3>
              <p className="text-xs text-[#64748B]">
                Visit these verified offices for physical document verification, FRUITS ID creation, and subsidy sanctions.
              </p>
            </div>
            <button
              onClick={() => setShowOfficesMap(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <LeafletMap
            center={[userLat, userLng]}
            zoom={11}
            markers={mapMarkers}
            selectedId="user-pin"
            height="300px"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
            {officesWithDistances.map((office) => (
              <div
                key={office.id}
                className="p-3 bg-[#F8FAF6] rounded-lg border border-slate-200 text-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-[#14532D]">{office.name}</span>
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded shrink-0">
                      {office.distanceKm != null ? `${office.distanceKm} km` : 'Regional Office'}
                    </span>
                  </div>
                  <p className="text-slate-500 mt-1">{office.address}</p>
                </div>
                <div className="mt-2.5 pt-2 border-t border-slate-200 flex items-center justify-between text-slate-600">
                  <span className="font-medium">{office.contact}</span>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${office.position[0]},${office.position[1]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#15803D] font-bold hover:underline inline-flex items-center gap-1"
                  >
                    Directions
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search & Category Filter */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search scheme name, subsidy benefits, or eligibility requirements..."
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

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#15803D] text-white'
                  : 'bg-[#F8FAF6] text-[#64748B] hover:text-[#1F2937] border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Schemes Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSchemes.map((scheme) => (
          <div
            key={scheme.id}
            onClick={() => setSelectedScheme(scheme)}
            className="group bg-white rounded-xl border border-slate-200 p-5 hover:border-[#15803D] cursor-pointer transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold text-[#15803D] bg-[#DCFCE7] px-2 py-0.5 rounded-full">
                  {scheme.category}
                </span>
                <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  {scheme.level}
                </span>
              </div>

              <h3 className="text-base font-bold text-[#1F2937] group-hover:text-[#15803D] transition-colors mt-3">
                {scheme.name}
              </h3>

              {scheme.description && (
                <p className="mt-1.5 text-xs text-slate-500 line-clamp-2">
                  {scheme.description}
                </p>
              )}

              <div className="mt-3 p-2.5 rounded-lg bg-[#F8FAF6] border border-slate-200 text-xs text-[#14532D] leading-relaxed">
                <span className="font-bold">Key Benefit: </span>
                {scheme.benefit}
              </div>

              <p className="mt-3 text-xs text-[#64748B] line-clamp-2">
                <span className="font-semibold text-slate-700">Eligibility: </span>
                {scheme.eligibility}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#15803D]">
              <span>View Eligibility & Apply</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>

      {filteredSchemes.length === 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-[#64748B]">
          <Landmark className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-[#1F2937]">No government schemes match your filter</p>
          <p className="text-xs text-slate-400 mt-1">Try selecting &quot;All&quot; categories or clearing the search text.</p>
        </div>
      )}

      {/* Scheme Detail & Application Modal */}
      {selectedScheme && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setSelectedScheme(null)}
        >
          <div
            className="w-full max-w-xl max-h-[90vh] overflow-y-auto bg-white rounded-xl border border-slate-200 p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#15803D]">
                  {selectedScheme.level} • {selectedScheme.category}
                </span>
                <h2 className="text-lg font-bold text-[#1F2937] mt-0.5">{selectedScheme.name}</h2>
              </div>
              <button
                onClick={() => setSelectedScheme(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              {selectedScheme.description && (
                <div>
                  <span className="font-bold text-[#1F2937] block mb-1">📖 Overview & Description</span>
                  <p className="text-[#64748B] leading-relaxed bg-[#F8FAF6] p-3 rounded-lg border border-slate-200">
                    {selectedScheme.description}
                  </p>
                </div>
              )}

              <div className="p-3.5 rounded-lg bg-[#DCFCE7] border border-emerald-200 text-[#14532D]">
                <span className="font-bold block mb-1">💰 Financial & Direct Benefit</span>
                <p className="leading-relaxed font-medium">{selectedScheme.benefit}</p>
              </div>

              <div>
                <span className="font-bold text-[#1F2937] block mb-1">📋 Eligibility Criteria</span>
                <p className="text-[#64748B] leading-relaxed bg-[#F8FAF6] p-3 rounded-lg border border-slate-200">
                  {selectedScheme.eligibility}
                </p>
              </div>

              <div>
                <span className="font-bold text-[#1F2937] block mb-1.5">📑 Required Documents</span>
                <ul className="space-y-1.5">
                  {selectedScheme.documents.map((doc, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-slate-700 bg-[#F8FAF6] px-3 py-1.5 rounded-md border border-slate-100">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D] shrink-0" />
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="font-bold text-[#1F2937] block mb-1">🚀 Step-by-Step Application Process</span>
                <p className="text-[#64748B] leading-relaxed bg-[#F8FAF6] p-3 rounded-lg border border-slate-200">
                  {selectedScheme.process}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setSelectedScheme(null)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>

              <a
                href={selectedScheme.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-[#15803D] text-white text-xs font-bold hover:bg-[#14532D] transition-colors shadow-xs"
              >
                <span>Open Official Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchemesPage;

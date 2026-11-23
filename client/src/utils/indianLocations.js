/**
 * Indian States and Agricultural Districts Directory
 * Primary support for Karnataka (all 31 districts) with pan-India state coverage.
 */

export const INDIAN_STATES = [
  'Karnataka',
  'Maharashtra',
  'Andhra Pradesh',
  'Telangana',
  'Tamil Nadu',
  'Kerala',
  'Gujarat',
  'Madhya Pradesh',
  'Rajasthan',
  'Punjab',
  'Haryana',
  'Uttar Pradesh',
  'Bihar',
  'West Bengal',
  'Odisha',
  'Chhattisgarh',
  'Jharkhand',
  'Assam',
  'Himachal Pradesh',
  'Uttarakhand',
  'Goa',
];

export const KARNATAKA_DISTRICTS = [
  'Bagalkote',
  'Ballari',
  'Belagavi',
  'Bengaluru Rural',
  'Bengaluru Urban',
  'Bidar',
  'Chamarajanagara',
  'Chikkaballapura',
  'Chikkamagaluru',
  'Chitradurga',
  'Dakshina Kannada',
  'Davanagere',
  'Dharwad',
  'Gadag',
  'Hassan',
  'Haveri',
  'Kalaburagi',
  'Kodagu',
  'Kolar',
  'Koppal',
  'Mandya',
  'Mysuru',
  'Raichur',
  'Ramanagara',
  'Shivamogga',
  'Tumakuru',
  'Udupi',
  'Uttara Kannada',
  'Vijayanagara',
  'Vijayapura',
  'Yadgir',
];

export const MAHARASHTRA_DISTRICTS = [
  'Ahmednagar',
  'Akola',
  'Amravati',
  'Aurangabad',
  'Beed',
  'Bhandara',
  'Buldhana',
  'Chandrapur',
  'Dhule',
  'Gadchiroli',
  'Gondia',
  'Hingoli',
  'Jalgaon',
  'Jalna',
  'Kolhapur',
  'Latur',
  'Mumbai City',
  'Mumbai Suburban',
  'Nagpur',
  'Nanded',
  'Nandurbar',
  'Nashik',
  'Osmanabad',
  'Palghar',
  'Parbhani',
  'Pune',
  'Raigad',
  'Ratnagiri',
  'Sangli',
  'Satara',
  'Sindhudurg',
  'Solapur',
  'Thane',
  'Wardha',
  'Washim',
  'Yavatmal',
];

export const ANDHRA_PRADESH_DISTRICTS = [
  'Ananthapuramu',
  'Chittoor',
  'East Godavari',
  'Guntur',
  'Krishna',
  'Kurnool',
  'Nellore',
  'Prakasam',
  'Srikakulam',
  'Visakhapatnam',
  'Vizianagaram',
  'West Godavari',
  'YSR Kadapa',
];

export const TELANGANA_DISTRICTS = [
  'Adilabad',
  'Hyderabad',
  'Jagtial',
  'Karimnagar',
  'Khammam',
  'Mahabubnagar',
  'Medak',
  'Nalgonda',
  'Nizamabad',
  'Rangareddy',
  'Sangareddy',
  'Siddipet',
  'Suryapet',
  'Warangal',
];

export const TAMIL_NADU_DISTRICTS = [
  'Coimbatore',
  'Cuddalore',
  'Dharmapuri',
  'Dindigul',
  'Erode',
  'Kanchipuram',
  'Madurai',
  'Salem',
  'Thanjavur',
  'Tiruchirappalli',
  'Tirunelveli',
  'Tirupathur',
  'Tiruvallur',
  'Vellore',
  'Villupuram',
];

export function getDistrictsForState(stateName) {
  switch (stateName) {
    case 'Karnataka':
      return KARNATAKA_DISTRICTS;
    case 'Maharashtra':
      return MAHARASHTRA_DISTRICTS;
    case 'Andhra Pradesh':
      return ANDHRA_PRADESH_DISTRICTS;
    case 'Telangana':
      return TELANGANA_DISTRICTS;
    case 'Tamil Nadu':
      return TAMIL_NADU_DISTRICTS;
    default:
      return KARNATAKA_DISTRICTS;
  }
}

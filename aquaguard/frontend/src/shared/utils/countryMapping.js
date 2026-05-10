export const numericIsoToAlpha2 = {
  // Antarctica
  '010': 'AQ', // Antarctica

  // Africa
  '012': 'DZ', // Algeria
  '024': 'AO', // Angola
  '204': 'BJ', // Benin
  '072': 'BW', // Botswana
  '854': 'BF', // Burkina Faso
  '108': 'BI', // Burundi
  '120': 'CM', // Cameroon
  '132': 'CV', // Cape Verde
  '140': 'CF', // Central African Republic
  '148': 'TD', // Chad
  '174': 'KM', // Comoros
  '178': 'CG', // Congo
  '180': 'CD', // Democratic Republic of the Congo
  '262': 'DJ', // Djibouti
  '818': 'EG', // Egypt
  '226': 'GQ', // Equatorial Guinea
  '232': 'ER', // Eritrea
  '748': 'SZ', // Eswatini
  '231': 'ET', // Ethiopia
  '266': 'GA', // Gabon
  '270': 'GM', // Gambia
  '288': 'GH', // Ghana
  '324': 'GN', // Guinea
  '624': 'GW', // Guinea-Bissau
  '384': 'CI', // Ivory Coast
  '404': 'KE', // Kenya
  '426': 'LS', // Lesotho
  '430': 'LR', // Liberia
  '434': 'LY', // Libya
  '450': 'MG', // Madagascar
  '454': 'MW', // Malawi
  '466': 'ML', // Mali
  '478': 'MR', // Mauritania
  '480': 'MU', // Mauritius
  '504': 'MA', // Morocco
  '508': 'MZ', // Mozambique
  '516': 'NA', // Namibia
  '562': 'NE', // Niger
  '566': 'NG', // Nigeria
  '646': 'RW', // Rwanda
  '678': 'ST', // Sao Tome and Principe
  '686': 'SN', // Senegal
  '690': 'SC', // Seychelles
  '694': 'SL', // Sierra Leone
  '706': 'SO', // Somalia
  '710': 'ZA', // South Africa
  '728': 'SS', // South Sudan
  '729': 'SD', // Sudan
  '732': 'EH', // Western Sahara
  '834': 'TZ', // Tanzania
  '768': 'TG', // Togo
  '788': 'TN', // Tunisia
  '800': 'UG', // Uganda
  '894': 'ZM', // Zambia
  '716': 'ZW', // Zimbabwe

  // Americas
  '032': 'AR', // Argentina
  '044': 'BS', // Bahamas
  '052': 'BB', // Barbados
  '084': 'BZ', // Belize
  '068': 'BO', // Bolivia
  '076': 'BR', // Brazil
  '124': 'CA', // Canada
  '152': 'CL', // Chile
  '170': 'CO', // Colombia
  '188': 'CR', // Costa Rica
  '192': 'CU', // Cuba
  '212': 'DM', // Dominica
  '214': 'DO', // Dominican Republic
  '218': 'EC', // Ecuador
  '222': 'SV', // El Salvador
  '238': 'FK', // Falkland Islands
  '254': 'GF', // French Guiana
  '304': 'GL', // Greenland
  '320': 'GT', // Guatemala
  '328': 'GY', // Guyana
  '332': 'HT', // Haiti
  '340': 'HN', // Honduras
  '388': 'JM', // Jamaica
  '484': 'MX', // Mexico
  '558': 'NI', // Nicaragua
  '591': 'PA', // Panama
  '600': 'PY', // Paraguay
  '604': 'PE', // Peru
  '630': 'PR', // Puerto Rico
  '740': 'SR', // Suriname
  '780': 'TT', // Trinidad and Tobago
  '840': 'US', // United States
  '858': 'UY', // Uruguay
  '862': 'VE', // Venezuela

  // French Overseas Territories
  '258': 'PF', // French Polynesia
  '540': 'NC', // New Caledonia
  '638': 'RE', // Reunion
  '175': 'YT', // Mayotte
  '474': 'MQ', // Martinique
  '312': 'GP', // Guadeloupe

  // Other Territories
  '531': 'CW', // Curacao
  '533': 'AW', // Aruba
  '850': 'VI', // US Virgin Islands
  '092': 'VG', // British Virgin Islands
  '136': 'KY', // Cayman Islands
  '060': 'BM', // Bermuda

  // Asia
  '004': 'AF', // Afghanistan
  '051': 'AM', // Armenia
  '031': 'AZ', // Azerbaijan
  '048': 'BH', // Bahrain
  '050': 'BD', // Bangladesh
  '064': 'BT', // Bhutan
  '096': 'BN', // Brunei
  '116': 'KH', // Cambodia
  '156': 'CN', // China
  '268': 'GE', // Georgia
  '344': 'HK', // Hong Kong
  '356': 'IN', // India
  '360': 'ID', // Indonesia
  '364': 'IR', // Iran
  '368': 'IQ', // Iraq
  '376': 'IL', // Israel
  '392': 'JP', // Japan
  '400': 'JO', // Jordan
  '398': 'KZ', // Kazakhstan
  '414': 'KW', // Kuwait
  '417': 'KG', // Kyrgyzstan
  '418': 'LA', // Laos
  '422': 'LB', // Lebanon
  '458': 'MY', // Malaysia
  '462': 'MV', // Maldives
  '496': 'MN', // Mongolia
  '104': 'MM', // Myanmar
  '524': 'NP', // Nepal
  '408': 'KP', // North Korea
  '512': 'OM', // Oman
  '586': 'PK', // Pakistan
  '275': 'PS', // Palestine
  '608': 'PH', // Philippines
  '634': 'QA', // Qatar
  '682': 'SA', // Saudi Arabia
  '702': 'SG', // Singapore
  '410': 'KR', // South Korea
  '144': 'LK', // Sri Lanka
  '760': 'SY', // Syria
  '158': 'TW', // Taiwan
  '762': 'TJ', // Tajikistan
  '764': 'TH', // Thailand
  '626': 'TL', // Timor-Leste
  '792': 'TR', // Turkey
  '795': 'TM', // Turkmenistan
  '784': 'AE', // United Arab Emirates
  '860': 'UZ', // Uzbekistan
  '704': 'VN', // Vietnam
  '887': 'YE', // Yemen

  // Europe
  '008': 'AL', // Albania
  '020': 'AD', // Andorra
  '040': 'AT', // Austria
  '112': 'BY', // Belarus
  '056': 'BE', // Belgium
  '070': 'BA', // Bosnia and Herzegovina
  '100': 'BG', // Bulgaria
  '191': 'HR', // Croatia
  '196': 'CY', // Cyprus
  '203': 'CZ', // Czech Republic
  '208': 'DK', // Denmark
  '233': 'EE', // Estonia
  '246': 'FI', // Finland
  '250': 'FR', // France
  '276': 'DE', // Germany
  '300': 'GR', // Greece
  '348': 'HU', // Hungary
  '352': 'IS', // Iceland
  '372': 'IE', // Ireland
  '380': 'IT', // Italy
  '428': 'LV', // Latvia
  '438': 'LI', // Liechtenstein
  '440': 'LT', // Lithuania
  '442': 'LU', // Luxembourg
  '470': 'MT', // Malta
  '498': 'MD', // Moldova
  '492': 'MC', // Monaco
  '499': 'ME', // Montenegro
  '528': 'NL', // Netherlands
  '807': 'MK', // North Macedonia
  '578': 'NO', // Norway
  '616': 'PL', // Poland
  '620': 'PT', // Portugal
  '642': 'RO', // Romania
  '643': 'RU', // Russia
  '674': 'SM', // San Marino
  '688': 'RS', // Serbia
  '703': 'SK', // Slovakia
  '705': 'SI', // Slovenia
  '724': 'ES', // Spain
  '752': 'SE', // Sweden
  '756': 'CH', // Switzerland
  '804': 'UA', // Ukraine
  '826': 'GB', // United Kingdom
  '336': 'VA', // Vatican City

  // Oceania
  '036': 'AU', // Australia
  '242': 'FJ', // Fiji
  '296': 'KI', // Kiribati
  '584': 'MH', // Marshall Islands
  '583': 'FM', // Micronesia
  '520': 'NR', // Nauru
  '554': 'NZ', // New Zealand
  '585': 'PW', // Palau
  '598': 'PG', // Papua New Guinea
  '882': 'WS', // Samoa
  '090': 'SB', // Solomon Islands
  '776': 'TO', // Tonga
  '798': 'TV', // Tuvalu
  '548': 'VU', // Vanuatu
};

export const iso3ToIso2 = {
  ATA: 'AQ',
  USA: 'US',
  CAN: 'CA',
  GBR: 'GB',
  FRA: 'FR',
  DEU: 'DE',
  AUS: 'AU',
  CHN: 'CN',
  JPN: 'JP',
  IND: 'IN',
  BRA: 'BR',
  CHE: 'CH',
  ESP: 'ES',
  ITA: 'IT',
  NLD: 'NL',
  SWE: 'SE',
  MEX: 'MX',
  PER: 'PE',
  RUS: 'RU',
  KOR: 'KR',
  NOR: 'NO',
  NZL: 'NZ',
  SGP: 'SG',
};

const countryNameToIso3 = {
  Antarctica: 'ATA',
  'United States': 'USA',
  Canada: 'CAN',
  Australia: 'AUS',
  'United Kingdom': 'GBR',
  Germany: 'DEU',
  France: 'FRA',
  China: 'CHN',
  Japan: 'JPN',
  India: 'IND',
  Brazil: 'BRA',
  Mexico: 'MEX',
  Spain: 'ESP',
  Italy: 'ITA',
  Netherlands: 'NLD',
  Sweden: 'SWE',
  Singapore: 'SGP',
  Norway: 'NOR',
  Philippines: 'PHL',
  Denmark: 'DNK',
  Peru: 'PER',
  Colombia: 'COL',
  Argentina: 'ARG',
  Bangladesh: 'BGD',
  Indonesia: 'IDN',
  Switzerland: 'CHE',
};

export function getCountryISO(country) {
  if (!country || typeof country !== 'string') {
    return null;
  }

  const normalized = country.trim();
  const direct = countryNameToIso3[normalized];
  if (direct) {
    return direct;
  }
  const lower = normalized.toLowerCase();
  const byLower = Object.entries(countryNameToIso3).find(function ([name]) {
    return name.toLowerCase() === lower;
  });
  return byLower ? byLower[1] : null;
}

export function iso3ToIso2Mapper(alpha3) {
  if (!alpha3 || typeof alpha3 !== 'string') {
    return null;
  }

  return iso3ToIso2[alpha3.toUpperCase()] || null;
}

export function toAlpha2(value) {
  if (!value || typeof value !== 'string') {
    return null;
  }

  const normalized = value.trim().toUpperCase();
  if (normalized.length === 2) {
    return normalized;
  }

  if (normalized.length === 3) {
    return iso3ToIso2Mapper(normalized);
  }

  return null;
}

export function getIsoFromCompanyCountry(country) {
  if (!country) {
    return null;
  }

  if (typeof country === 'object' && country.isoCode) {
    return String(country.isoCode);
  }

  if (typeof country === 'string') {
    return getCountryISO(country);
  }

  return null;
}


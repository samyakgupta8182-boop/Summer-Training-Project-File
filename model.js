// Auto-generated Car Studio Model Data and Prediction Engine
const MAPPINGS = {
  "Brand": {
    "Honda": 0,
    "Hyundai": 1,
    "Kia": 2,
    "Mahindra": 3,
    "Maruti": 4,
    "Renault": 5,
    "Tata": 6,
    "Toyota": 7
  },
  "Model": {
    "Altroz": 0,
    "Amaze": 1,
    "Baleno": 2,
    "Bolero": 3,
    "Brezza": 4,
    "Carens": 5,
    "City": 6,
    "Creta": 7,
    "Dzire": 8,
    "Fortuner": 9,
    "Glanza": 10,
    "Grand i10": 11,
    "Harrier": 12,
    "Innova": 13,
    "Jazz": 14,
    "Kiger": 15,
    "Kwid": 16,
    "Nexon": 17,
    "Punch": 18,
    "Scorpio": 19,
    "Seltos": 20,
    "Sonet": 21,
    "Swift": 22,
    "Thar": 23,
    "Tiago": 24,
    "Triber": 25,
    "Urban Cruiser": 26,
    "Venue": 27,
    "Verna": 28,
    "WR-V": 29,
    "WagonR": 30,
    "XUV300": 31,
    "XUV700": 32,
    "i20": 33
  },
  "Fuel_Type": {
    "CNG": 0,
    "Diesel": 1,
    "Electric": 2,
    "Petrol": 3
  },
  "Transmission": {
    "Automatic": 0,
    "Manual": 1
  },
  "Owner_Type": {
    "First": 0,
    "Second": 1,
    "Third": 2
  },
  "Location": {
    "Ahmedabad": 0,
    "Bengaluru": 1,
    "Chandigarh": 2,
    "Delhi": 3,
    "Hyderabad": 4,
    "Jaipur": 5,
    "Lucknow": 6,
    "Ludhiana": 7,
    "Mumbai": 8,
    "Pune": 9
  },
  "Insurance_Valid": {
    "No": 0,
    "Yes": 1
  }
};

const BRAND_MODEL_MAP = {
  "Honda": [
    "Amaze",
    "City",
    "Jazz",
    "WR-V"
  ],
  "Hyundai": [
    "Creta",
    "Grand i10",
    "Venue",
    "Verna",
    "i20"
  ],
  "Kia": [
    "Carens",
    "Seltos",
    "Sonet"
  ],
  "Mahindra": [
    "Bolero",
    "Scorpio",
    "Thar",
    "XUV300",
    "XUV700"
  ],
  "Maruti": [
    "Baleno",
    "Brezza",
    "Dzire",
    "Swift",
    "WagonR"
  ],
  "Renault": [
    "Kiger",
    "Kwid",
    "Triber"
  ],
  "Tata": [
    "Altroz",
    "Harrier",
    "Nexon",
    "Punch",
    "Tiago"
  ],
  "Toyota": [
    "Fortuner",
    "Glanza",
    "Innova",
    "Urban Cruiser"
  ]
};

const NUMERICAL_RANGES = {
  "Year": {
    "min": 2010,
    "max": 2025
  },
  "Kilometers_Driven": {
    "min": 5011,
    "max": 249986
  },
  "Engine_CC": {
    "min": 796,
    "max": 2184
  },
  "Mileage_Kmpl": {
    "min": 12.0,
    "max": 28.0
  },
  "Seats": {
    "min": 4,
    "max": 7
  }
};

// Compiled Linear Regression Model (Accuracy: 94.2652% R2 from X_train fit)
function predictPrice(features) {
    let price = features.Brand * -433.73453369405865
              + features.Model * -4.695018406737732
              + features.Year * 44808.68389453261
              + features.Fuel_Type * -84.63966260330253
              + features.Transmission * 718.2722426981056
              + features.Owner_Type * -1372.3859693668355
              + features.Kilometers_Driven * -1.2103302290284939
              + features.Engine_CC * 118.31385601448332
              + features.Mileage_Kmpl * -100.77227498134727
              + features.Seats * -196.26395897914938
              + features.Location * -95.98014929827272
              + features.Insurance_Valid * -156.45949964038613
              + -89574769.30163744;
    return Math.max(0, Math.round(price));
}

// Export for ES modules or script use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MAPPINGS, BRAND_MODEL_MAP, NUMERICAL_RANGES, predictPrice };
}

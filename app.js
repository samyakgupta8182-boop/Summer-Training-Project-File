document.addEventListener('DOMContentLoaded', () => {
    // 1. SELECT DOM ELEMENTS
    const form = document.getElementById('predictor-form');
    const brandSelect = document.getElementById('brand');
    const modelSelect = document.getElementById('model');
    const yearInput = document.getElementById('year');
    const kmsInput = document.getElementById('kms');
    const engineInput = document.getElementById('engine');
    const mileageInput = document.getElementById('mileage');
    const locationSelect = document.getElementById('location');
    
    // Sliders displays
    const yearVal = document.getElementById('year-val');
    const kmsVal = document.getElementById('kms-val');
    const engineVal = document.getElementById('engine-val');
    const mileageVal = document.getElementById('mileage-val');

    // Toggle Buttons / Pill Inputs
    const fuelRadios = document.getElementsByName('fuel_type');
    const transRadios = document.getElementsByName('transmission');
    const ownerRadios = document.getElementsByName('owner_type');
    
    // Results DOM
    const cardInner = document.getElementById('card-inner');
    const loaderOverlay = document.getElementById('loader-overlay');
    const priceNumber = document.getElementById('price-number');
    const btnRecalculate = document.getElementById('btn-recalculate');
    const themeToggleBtn = document.getElementById('theme-toggle');

    // Diagnostic displays
    const diagFuel = document.getElementById('diag-fuel');
    const diagTrans = document.getElementById('diag-trans');
    const diagKms = document.getElementById('diag-kms');
    const diagBar = document.getElementById('diag-bar');

    // 2. THEME SWITCHING LOGIC
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        if (theme === 'light') {
            themeToggleBtn.innerHTML = '🌙'; // Icon to change back to dark
        } else {
            themeToggleBtn.innerHTML = '☀️'; // Icon to change back to light
        }
    }

    // 3. INITIALIZE POPULATE DROPDOWNS
    // Populate Brands
    const sortedBrands = Object.keys(BRAND_MODEL_MAP).sort();
    brandSelect.innerHTML = '<option value="" disabled selected>Select Brand</option>';
    sortedBrands.forEach(brand => {
        const opt = document.createElement('option');
        opt.value = brand;
        opt.textContent = brand;
        brandSelect.appendChild(opt);
    });

    // Populate Locations
    const sortedLocations = Object.keys(MAPPINGS.Location).sort();
    locationSelect.innerHTML = '<option value="" disabled selected>Select City</option>';
    sortedLocations.forEach(loc => {
        const opt = document.createElement('option');
        opt.value = loc;
        opt.textContent = loc;
        locationSelect.appendChild(opt);
    });

    // Chained Brand-Model Dropdown Filtering
    brandSelect.addEventListener('change', () => {
        const selectedBrand = brandSelect.value;
        modelSelect.innerHTML = '<option value="" disabled selected>Select Model</option>';
        modelSelect.disabled = true;

        if (selectedBrand && BRAND_MODEL_MAP[selectedBrand]) {
            const models = BRAND_MODEL_MAP[selectedBrand];
            models.forEach(model => {
                const opt = document.createElement('option');
                opt.value = model;
                opt.textContent = model;
                modelSelect.appendChild(opt);
            });
            modelSelect.disabled = false;
        }
        clearError(brandSelect);
    });

    modelSelect.addEventListener('change', () => clearError(modelSelect));
    locationSelect.addEventListener('change', () => clearError(locationSelect));

    // 4. SYNC SLIDERS VALUE LABELS
    // Year Slider
    yearInput.addEventListener('input', () => {
        yearVal.textContent = yearInput.value;
    });

    // Kilometers Driven Slider (Format with Commas)
    kmsInput.addEventListener('input', () => {
        const value = parseInt(kmsInput.value);
        kmsVal.textContent = value.toLocaleString() + ' km';
    });

    // Engine CC Slider
    engineInput.addEventListener('input', () => {
        engineVal.textContent = engineInput.value + ' cc';
    });

    // Mileage Slider
    mileageInput.addEventListener('input', () => {
        mileageVal.textContent = parseFloat(mileageInput.value).toFixed(1) + ' kmpl';
    });

    // Initialize labels
    yearVal.textContent = yearInput.value;
    kmsVal.textContent = parseInt(kmsInput.value).toLocaleString() + ' km';
    engineVal.textContent = engineInput.value + ' cc';
    mileageVal.textContent = parseFloat(mileageInput.value).toFixed(1) + ' kmpl';

    // 5. HELPER VALUES EXTRACTION
    function getSelectedRadioValue(radioNodeList) {
        for (const radio of radioNodeList) {
            if (radio.checked) return radio.value;
        }
        return null;
    }

    function clearError(element) {
        element.classList.remove('error');
    }

    // 6. FORM CALCULATION & SUBMISSION
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Validate fields
        let isValid = true;
        
        if (!brandSelect.value) {
            brandSelect.classList.add('error');
            isValid = false;
        }
        if (!modelSelect.value) {
            modelSelect.classList.add('error');
            isValid = false;
        }
        if (!locationSelect.value) {
            locationSelect.classList.add('error');
            isValid = false;
        }

        if (!isValid) {
            // Scroll to the first error
            const firstError = document.querySelector('.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        // Retrieve forms values
        const brand = brandSelect.value;
        const model = modelSelect.value;
        const year = parseInt(yearInput.value);
        const fuel = getSelectedRadioValue(fuelRadios);
        const trans = getSelectedRadioValue(transRadios);
        const owner = getSelectedRadioValue(ownerRadios);
        const kms = parseInt(kmsInput.value);
        const engine = parseInt(engineInput.value);
        const mileage = parseFloat(mileageInput.value);
        const seats = 5; // Default seats
        const location = locationSelect.value;
        const insurance = "Yes"; // Default insurance

        // Perform Label Encoding using exported metadata
        const encodedBrand = MAPPINGS.Brand[brand];
        const encodedModel = MAPPINGS.Model[model];
        const encodedFuel = MAPPINGS.Fuel_Type[fuel];
        const encodedTrans = MAPPINGS.Transmission[trans];
        const encodedOwner = MAPPINGS.Owner_Type[owner];
        const encodedLocation = MAPPINGS.Location[location];
        const encodedInsurance = MAPPINGS.Insurance_Valid[insurance];

        // Format parameters according to model inputs
        const features = {
            Brand: encodedBrand,
            Model: encodedModel,
            Year: year,
            Fuel_Type: encodedFuel,
            Transmission: encodedTrans,
            Owner_Type: encodedOwner,
            Kilometers_Driven: kms,
            Engine_CC: engine,
            Mileage_Kmpl: mileage,
            Seats: seats,
            Location: encodedLocation,
            Insurance_Valid: encodedInsurance
        };

        // Reset card state to front face first
        cardInner.classList.remove('is-flipped');

        // Activate high-tech computing visual loader overlay
        loaderOverlay.classList.add('active');

        // Execute prediction with mock analytical lag
        setTimeout(() => {
            try {
                // Call Compiled ML Linear Regression
                const predictedVal = predictPrice(features);

                // Update Diagnostics on Back Side
                diagFuel.textContent = fuel;
                diagTrans.textContent = trans;
                diagKms.textContent = kms.toLocaleString() + ' km';

                // Calculate progress bar width based on price bounds (1.9L min to 15L max)
                const minPrice = 197000;
                const maxPrice = 1500000;
                const percent = Math.min(Math.max(((predictedVal - minPrice) / (maxPrice - minPrice)) * 100, 5), 100);
                diagBar.style.width = percent + '%';

                // Deactivate loader
                loaderOverlay.classList.remove('active');

                // Perform 3D card flip animation
                cardInner.classList.add('is-flipped');

                // Count-up price number animation
                animatePriceValue(predictedVal);
            } catch (err) {
                console.error("Prediction Engine Error:", err);
                loaderOverlay.classList.remove('active');
                alert("Model prediction engine error. Please check inputs.");
            }
        }, 1200); // 1.2s delay for visual premium feel
    });

    // 7. COUNTER PRICE ANIMATION
    function animatePriceValue(targetVal) {
        let current = 0;
        const duration = 1500; // 1.5 seconds
        const stepTime = 16; // ~60fps
        const steps = duration / stepTime;
        const increment = targetVal / steps;
        
        let stepCount = 0;
        
        const counter = setInterval(() => {
            current += increment;
            stepCount++;
            
            if (stepCount >= steps) {
                clearInterval(counter);
                priceNumber.textContent = targetVal.toLocaleString('en-IN');
            } else {
                priceNumber.textContent = Math.floor(current).toLocaleString('en-IN');
            }
        }, stepTime);
    }

    // 8. RESET FLIP BACK TO CARD FRONT
    btnRecalculate.addEventListener('click', () => {
        cardInner.classList.remove('is-flipped');
        setTimeout(() => {
            priceNumber.textContent = '0';
        }, 500); // Wait for half of flip animation to reset text
    });
});

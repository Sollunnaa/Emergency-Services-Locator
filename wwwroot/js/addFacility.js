// Add facility functionality
let tempMarker = null;
let selectedLatLng = null;
let mapClickEnabled = false;
let bootstrapModal = null; // Store Bootstrap modal instance

function setupAddFacilityMode() {
    const addFacilityBtn = document.getElementById('addFacilityBtn');
    const modalElement = document.getElementById('addFacilityModal');
    
    if (!addFacilityBtn || !modalElement) {
        console.error('Add Facility button or modal not found');
        return;
    }

    console.log('Setup Add Facility Mode - initialized');

    // Initialize Bootstrap modal instance
    bootstrapModal = new bootstrap.Modal(modalElement);

    addFacilityBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Add Facility button clicked');
        enableMapClickMode();
    });

    // Handle form submission
    const form = document.getElementById('addFacilityForm');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            await saveFacility();
        });
    }      

    // Listen to modal hidden event to cleanup
    modalElement.addEventListener('hidden.bs.modal', function () {
        console.log('Modal hidden event fired');
        clearTempMarker();
        disableMapClickMode();
        const form = document.getElementById('addFacilityForm');
        if (form) {
            form.reset();
        }
    });
}

function enableMapClickMode() {
    // Make sure map exists
    if (typeof map === 'undefined' || !map) {
        console.error('Map object not found!');
        showNotification('Map is not initialized', 'error');
        return;
    }

    console.log('Enabling map click mode...');

    // Change cursor
    const mapContainer = map.getContainer();
    if (mapContainer) {
        mapContainer.style.cursor = 'crosshair';
        console.log('Cursor changed to crosshair');
    }
    
    // Show instruction
    showNotification('Click on the map to pin a location for the new facility', 'info');

    // Enable click flag
    mapClickEnabled = true;

    // Update button state
    const addFacilityBtn = document.getElementById('addFacilityBtn');
    if (addFacilityBtn) {
        addFacilityBtn.innerHTML = '<span class="add-icon">⏳</span> Click on Map...';
        addFacilityBtn.classList.add('active');
    }

    // Remove any existing handlers first
    map.off('click', handleMapClick);
    
    // Add click handler to map
    map.on('click', handleMapClick);
    
    console.log('Map click handler added');
}

function disableMapClickMode() {
    console.log('Disabling map click mode...');
    mapClickEnabled = false;
    
    // Remove click handler
    if (typeof map !== 'undefined' && map) {
        map.off('click', handleMapClick);
    }
    
    // Reset cursor
    if (typeof map !== 'undefined' && map) {
        const mapContainer = map.getContainer();
        if (mapContainer) {
            mapContainer.style.cursor = '';
        }
    }
    
    // Reset button
    const addFacilityBtn = document.getElementById('addFacilityBtn');
    if (addFacilityBtn) {
        addFacilityBtn.innerHTML = '<span class="add-icon">➕</span> Add Facility';
        addFacilityBtn.classList.remove('active');
    }
}

function handleMapClick(e) {
    if (!mapClickEnabled) {
        console.log('Map click ignored - mode not enabled');
        return;
    }
    
    console.log('Map clicked at:', e.latlng);
    
    selectedLatLng = e.latlng;
    console.log('selectedLatLng set to:', selectedLatLng);
    
    // IMPORTANT: Save coordinates to local variable to prevent them from being cleared
    const clickedLat = e.latlng.lat;
    const clickedLng = e.latlng.lng;
    console.log('Saved local coordinates:', clickedLat, clickedLng);
    
    // Disable further clicks
    disableMapClickMode();
    
    // Remove existing temp marker if any
    if (tempMarker && typeof map !== 'undefined' && map) {
        try {
            map.removeLayer(tempMarker);
            tempMarker = null;
            console.log('Temp marker removed (without clearing selectedLatLng)');
        } catch (error) {
            console.error('Error removing marker:', error);
        }
    }

    // Add temporary marker using local coordinates
    try {
        tempMarker = L.marker([clickedLat, clickedLng], {
            icon: L.divIcon({
                className: 'temp-marker',
                html: '<div style="background-color: #28a745; width: 30px; height: 30px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.5);"></div>',
                iconSize: [30, 30],
                iconAnchor: [15, 30]
            }),
            draggable: true,
            zIndexOffset: 1000
        }).addTo(map);

        console.log('Temp marker added at:', clickedLat, clickedLng);

        // Allow dragging the marker to adjust position
        tempMarker.on('dragend', function(event) {
            selectedLatLng = event.target.getLatLng();
            updateCoordinateInputs();
            updateLocationName();
            // Re-fetch address for new location
            getAddressFromCoords(selectedLatLng.lat, selectedLatLng.lng);
            console.log('Marker dragged to:', selectedLatLng);
        });
    } catch (error) {
        console.error('Error adding marker:', error);
        showNotification('Error adding marker', 'error');
    }

    // FIRST: Open modal using Bootstrap API
    console.log('Opening modal...');
    openModal();
    
    // THEN: Use Bootstrap's shown.bs.modal event to populate fields
    const modalElement = document.getElementById('addFacilityModal');
    modalElement.addEventListener('shown.bs.modal', function onModalShown() {
        console.log('Modal fully shown, populating fields...');
        console.log('selectedLatLng before populate:', selectedLatLng);
        
        // Double-check selectedLatLng is still set
        if (!selectedLatLng) {
            console.error('ERROR: selectedLatLng was cleared! Restoring from local variables...');
            selectedLatLng = { lat: clickedLat, lng: clickedLng };
        }
        
        // Now populate the fields
        console.log('Calling updateCoordinateInputs...');
        updateCoordinateInputs();
        
        console.log('Calling updateLocationName...');
        updateLocationName();
        
        console.log('Calling getAddressFromCoords with:', clickedLat, clickedLng);
        getAddressFromCoords(clickedLat, clickedLng);
        
        // Remove this one-time event listener
        modalElement.removeEventListener('shown.bs.modal', onModalShown);
    }, { once: true });
}

function updateCoordinateInputs() {
    if (!selectedLatLng) {
        console.warn('updateCoordinateInputs: No selectedLatLng');
        return;
    }
    
    console.log('updateCoordinateInputs called with:', selectedLatLng);
    
    const latInput = document.getElementById('latitude');
    const lngInput = document.getElementById('longitude');
    
    console.log('Latitude input found:', latInput);
    console.log('Longitude input found:', lngInput);
    
    if (latInput && lngInput) {
        const latValue = selectedLatLng.lat.toFixed(6);
        const lngValue = selectedLatLng.lng.toFixed(6);
        
        latInput.value = latValue;
        lngInput.value = lngValue;
        
        console.log('✅ Latitude set to:', latValue);
        console.log('✅ Longitude set to:', lngValue);
        console.log('Latitude input value after setting:', latInput.value);
        console.log('Longitude input value after setting:', lngInput.value);
    } else {
        console.error('❌ Could not find latitude or longitude inputs!');
        console.error('Latitude input:', latInput);
        console.error('Longitude input:', lngInput);
    }
}

function updateLocationName() {
    if (!selectedLatLng) {
        console.warn('updateLocationName: No selectedLatLng');
        return;
    }
    
    console.log('updateLocationName called with:', selectedLatLng);
    
    const locationNameInput = document.getElementById('locationName');
    console.log('Location name input found:', locationNameInput);
    
    if (locationNameInput) {
        // Generate a default location name from coordinates
        const latDir = selectedLatLng.lat >= 0 ? 'N' : 'S';
        const lngDir = selectedLatLng.lng >= 0 ? 'E' : 'W';
        const defaultName = `Location ${Math.abs(selectedLatLng.lat).toFixed(4)}°${latDir}, ${Math.abs(selectedLatLng.lng).toFixed(4)}°${lngDir}`;
        locationNameInput.value = defaultName;
        locationNameInput.placeholder = 'Auto-filled - you can edit this';
        console.log('✅ Location name set to:', defaultName);
        console.log('Location name input value after setting:', locationNameInput.value);
    } else {
        console.error('❌ Could not find location name input!');
    }
}

async function getAddressFromCoords(lat, lng) {
    try {
        console.log('Fetching address for:', lat, lng);
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`, {
            headers: {
                'User-Agent': 'Emergency Services Locator'
            }
        });
        const data = await response.json();
        
        if (data.display_name) {
            const suggestedInput = document.getElementById('suggestedAddress');
            if (suggestedInput) {
                suggestedInput.value = data.display_name;
                console.log('Address found:', data.display_name);
            }
            
            // Also update location name with a better name if we have city/region info
            const locationNameInput = document.getElementById('locationName');
            if (locationNameInput) {
                let betterName = '';
                
                // Try to build a nice location name from address components
                const addr = data.address || {};
                if (addr.city || addr.town || addr.village) {
                    betterName = addr.city || addr.town || addr.village;
                    if (addr.suburb || addr.neighbourhood) {
                        betterName = (addr.suburb || addr.neighbourhood) + ', ' + betterName;
                    }
                } else if (addr.county || addr.state) {
                    betterName = addr.county || addr.state;
                } else if (addr.country) {
                    betterName = addr.country;
                }
                
                // If we got a better name, use it
                if (betterName) {
                    locationNameInput.value = betterName;
                    console.log('Location name updated to:', betterName);
                }
            }
        }
    } catch (error) {
        console.error('Error getting address:', error);
    }
}

function openModal() {
    if (bootstrapModal) {
        bootstrapModal.show();
        console.log('Modal opened using Bootstrap API');
    } else {
        console.error('Bootstrap modal instance not initialized!');
    }
}

function closeModal() {
    if (bootstrapModal) {
        bootstrapModal.hide();
        console.log('Modal closed using Bootstrap API');
    } else {
        console.error('Bootstrap modal instance not initialized!');
    }
}

function clearTempMarker() {
    if (tempMarker && typeof map !== 'undefined' && map) {
        try {
            map.removeLayer(tempMarker);
            tempMarker = null;
            console.log('Temp marker removed');
        } catch (error) {
            console.error('Error removing marker:', error);
        }
    }
    selectedLatLng = null;
}

async function saveFacility() {
    if (!selectedLatLng) {
        showNotification('Please select a location on the map', 'error');
        return;
    }

    const submitBtn = document.getElementById('submitFacility');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="bi bi-hourglass-split me-1"></i>Saving...';
    }

    try {
        // First, create the map location
        const mapData = {
            longitude: selectedLatLng.lng.toString(),
            latitude: selectedLatLng.lat.toString(),
            locationName: document.getElementById('locationName').value
        };

        console.log('Creating map location:', mapData);

        const mapResponse = await fetch('/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(mapData)
        });

        if (!mapResponse.ok) {
            const errorText = await mapResponse.text();
            console.error('Map creation failed:', errorText);
            throw new Error('Failed to create map location');
        }

        const mapId = await mapResponse.json();
        console.log('Map created with ID:', mapId);

        // Then, create the facility
        const facilityData = {
            name: document.getElementById('facilityName').value,
            address: document.getElementById('address').value,
            contact: document.getElementById('contact').value,
            type: document.getElementById('facilityType').value,
            map_id: mapId
        };

        console.log('Creating facility:', facilityData);

        const facilityResponse = await fetch('/createFaci', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(facilityData)
        });

        if (!facilityResponse.ok) {
            const errorText = await facilityResponse.text();
            console.error('Facility creation failed:', errorText);
            throw new Error('Failed to create facility');
        }

        const facilityId = await facilityResponse.json();
        console.log('Facility created with ID:', facilityId);

        showNotification('Facility added successfully!', 'success');
        
        // Close modal and clear temp marker
        closeModal();
        clearTempMarker();

        // Reload the page to show the new facility
        setTimeout(() => {
            window.location.reload();
        }, 1500);

    } catch (error) {
        console.error('Error saving facility:', error);
        showNotification('Error: ' + error.message, 'error');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="bi bi-check-circle me-1"></i>Save Facility';
        }
    }
}

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    // Trigger animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// Copy suggested address to address field
function copySuggestedAddress() {
    const suggested = document.getElementById('suggestedAddress');
    const address = document.getElementById('address');
    if (suggested && address && suggested.value) {
        address.value = suggested.value;
        showNotification('Address copied!', 'success');
    }
}

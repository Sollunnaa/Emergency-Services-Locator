// User location functionality
let userLocationMarker = null;
let userLocationCircle = null;

function setupLocateMe() {
    const locateMeBtn = document.getElementById('locateMeBtn');
    
    if (locateMeBtn) {
        locateMeBtn.addEventListener('click', function() {
            getUserLocation(true);
        });
    }
    
    // Auto-locate on page load (silent, no alerts)
    getUserLocation(false);
}

function getUserLocation(showMessage = false) {
    if (!navigator.geolocation) {
        if (showMessage) {
            alert('Geolocation is not supported by your browser');
        }
        return;
    }

    const locateMeBtn = document.getElementById('locateMeBtn');
    if (locateMeBtn) {
        locateMeBtn.classList.add('loading');
        locateMeBtn.innerHTML = '<span class="locate-icon">?</span> Locating...';
    }

    navigator.geolocation.getCurrentPosition(
        function(position) {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            const accuracy = position.coords.accuracy;

            // Remove existing user location marker and circle if any
            if (userLocationMarker) {
                map.removeLayer(userLocationMarker);
            }
            if (userLocationCircle) {
                map.removeLayer(userLocationCircle);
            }

            // Add user location marker
            userLocationMarker = L.marker([lat, lng], {
                icon: L.divIcon({
                    className: 'user-location-marker',
                    html: `<div style="background-color: #4285f4; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.4);"></div>`,
                    iconSize: [20, 20],
                    iconAnchor: [10, 10]
                })
            }).addTo(map);

            // Add accuracy circle
            userLocationCircle = L.circle([lat, lng], {
                radius: accuracy,
                color: '#4285f4',
                fillColor: '#4285f4',
                fillOpacity: 0.1,
                weight: 1
            }).addTo(map);

            // Bind popup to user marker
            userLocationMarker.bindPopup(`
                <div class="popup-content">
                    <h3>Your Location</h3>
                    <p><strong>Accuracy:</strong> ±${Math.round(accuracy)} meters</p>
                    <p><strong>Coordinates:</strong><br>${lat.toFixed(6)}, ${lng.toFixed(6)}</p>
                </div>
            `);

            if (showMessage) {
                userLocationMarker.openPopup();
            }

            // Center map on user location
            map.setView([lat, lng], 15);

            // Find and show nearest facilities
            findNearestFacilities(lat, lng);

            // Reset button
            if (locateMeBtn) {
                locateMeBtn.classList.remove('loading');
                locateMeBtn.innerHTML = '<span class="locate-icon">??</span> Locate Me';

                if (showMessage) {
                    setTimeout(() => {
                        locateMeBtn.innerHTML = '<span class="locate-icon">?</span> Located!';
                        setTimeout(() => {
                            locateMeBtn.innerHTML = '<span class="locate-icon">??</span> Locate Me';
                        }, 2000);
                    }, 500);
                }
            }
        },
        function(error) {
            if (locateMeBtn) {
                locateMeBtn.classList.remove('loading');
                locateMeBtn.innerHTML = '<span class="locate-icon">??</span> Locate Me';
            }

            if (showMessage) {
                let errorMessage = '';
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = 'Location access denied. Please enable location permissions.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = 'Location information unavailable.';
                        break;
                    case error.TIMEOUT:
                        errorMessage = 'Location request timed out.';
                        break;
                    default:
                        errorMessage = 'An unknown error occurred.';
                        break;
                }
                alert(errorMessage);
            }
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
}

function findNearestFacilities(userLat, userLng) {
    const facilitiesWithDistance = facilitiesData.map(facility => {
        const mapLocation = mapsData.find(m => m.location_name === facility.map_name);
        if (!mapLocation) return null;

        const facilityLat = parseFloat(mapLocation.latitude);
        const facilityLng = parseFloat(mapLocation.longitude);
        
        const distance = calculateDistance(userLat, userLng, facilityLat, facilityLng);
        
        return {
            ...facility,
            distance: distance,
            lat: facilityLat,
            lng: facilityLng
        };
    }).filter(f => f !== null);

    // Sort by distance
    facilitiesWithDistance.sort((a, b) => a.distance - b.distance);

    // Show top 5 nearest facilities
    const nearest = facilitiesWithDistance.slice(0, 5);
    
    console.log('Nearest facilities:', nearest);

    // Highlight nearest facilities in the list
    highlightNearestFacilities(nearest);
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    // Haversine formula to calculate distance in kilometers
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

function highlightNearestFacilities(nearestFacilities) {
    // Remove existing highlights
    document.querySelectorAll('.facility-card').forEach(card => {
        card.classList.remove('nearest');
        const distanceBadge = card.querySelector('.distance-badge');
        if (distanceBadge) {
            distanceBadge.remove();
        }
    });

    // Add highlights to nearest facilities
    nearestFacilities.forEach((facility, index) => {
        const facilityCard = document.querySelector(`.facility-card[data-map-id="${facility.id}"]`);
        if (facilityCard) {
            facilityCard.classList.add('nearest');
            
            // Add distance badge
            const distanceText = facility.distance < 1 
                ? `${Math.round(facility.distance * 1000)}m away`
                : `${facility.distance.toFixed(1)}km away`;
            
            const badge = document.createElement('div');
            badge.className = 'distance-badge';
            badge.textContent = distanceText;
            
            const facilityInfo = facilityCard.querySelector('.facility-info');
            const firstChild = facilityInfo.firstElementChild;
            if (firstChild && firstChild.nextElementSibling) {
                facilityInfo.insertBefore(badge, firstChild.nextElementSibling);
            } else {
                facilityInfo.appendChild(badge);
            }
        }
    });
}

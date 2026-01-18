// TEMPORARY DIAGNOSTIC SCRIPT
// Add this to your Index.cshtml temporarily to debug

// After the page loads, check if the modal inputs exist
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== DIAGNOSTIC CHECK ===');
    
    setTimeout(() => {
        console.log('\n1. Checking if modal exists in DOM:');
        const modal = document.getElementById('addFacilityModal');
        console.log('Modal element:', modal);
        console.log('Modal display:', modal ? modal.style.display : 'N/A');
        
        console.log('\n2. Checking if form exists:');
        const form = document.getElementById('addFacilityForm');
        console.log('Form element:', form);
        
        console.log('\n3. Checking if inputs exist:');
        const lat = document.getElementById('latitude');
        const lng = document.getElementById('longitude');
        const locName = document.getElementById('locationName');
        
        console.log('Latitude input:', lat);
        console.log('Longitude input:', lng);
        console.log('Location name input:', locName);
        
        if (lat) {
            console.log('  - Latitude ID:', lat.id);
            console.log('  - Latitude name:', lat.name);
            console.log('  - Latitude readonly:', lat.readOnly);
            console.log('  - Latitude parent:', lat.parentElement);
        }
        
        if (form) {
            console.log('\n4. All inputs in form:');
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach((input, i) => {
                console.log(`  ${i}. ${input.tagName} id="${input.id}" name="${input.name}" type="${input.type || 'N/A'}"`);
            });
        }
        
        console.log('\n5. Testing manual population:');
        if (lat && lng && locName) {
            console.log('Attempting to set values manually...');
            lat.value = '14.599500';
            lng.value = '121.024400';
            locName.value = 'Test Location';
            
            console.log('Values after manual set:');
            console.log('  Latitude:', lat.value);
            console.log('  Longitude:', lng.value);
            console.log('  Location:', locName.value);
            
            // Show the modal
            modal.style.display = 'flex';
            console.log('\n6. Modal opened for visual check');
            console.log('Check the modal visually - do you see the values?');
            
            // Close after 5 seconds
            setTimeout(() => {
                modal.style.display = 'none';
                console.log('\n7. Modal closed');
            }, 5000);
        } else {
            console.error('Could not find one or more inputs for manual test!');
        }
        
        console.log('\n=== DIAGNOSTIC CHECK COMPLETE ===');
    }, 2000); // Wait 2 seconds after page load
});

// Test the flow when you click Add Facility
function testAddFacilityFlow() {
    console.log('\n=== TESTING ADD FACILITY FLOW ===');
    
    // Simulate clicking "Add Facility"
    const btn = document.getElementById('addFacilityBtn');
    if (btn) {
        console.log('1. Add Facility button found, clicking...');
        btn.click();
        
        setTimeout(() => {
            console.log('2. Cursor should be crosshair now');
            console.log('3. Click on the map...');
            
            // Simulate map click (you'll need to do this manually)
            console.log('4. After clicking map, check console for:');
            console.log('   - "Map clicked at:"');
            console.log('   - "Modal should be rendered now"');
            console.log('   - "? Values set!"');
        }, 1000);
    }
}

// Run diagnostics automatically
console.log('Diagnostic script loaded. Will run in 2 seconds...');
console.log('Or run testAddFacilityFlow() manually to test the flow');

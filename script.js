document.addEventListener('DOMContentLoaded', function() {
    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                // Obtener información de la ciudad y país usando OpenCage
                fetch(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=f643618d8361401bb592d82ee9fbff47`)
                    .then(response => response.json())
                    .then(data => {
                        if (data.results.length > 0) {
                            const city = data.results[0].components.city || data.results[0].components.town || "Desconocida";
                            const country = data.results[0].components.country || "Desconocido";

                            // Obtener la hora actual
                            const currentTime = new Date().toLocaleString();
                            const locationInfo = `Latitud: ${lat}, Longitud: ${lon}, Ciudad: ${city}, País: ${country}, Hora: ${currentTime}`;

                            // Mostrar la información
                            document.getElementById('locationDisplay').innerText = locationInfo;

                            // Guardar la ubicación en localStorage
                            saveLocation(locationInfo);
                        } else {
                            document.getElementById('locationDisplay').innerText = "No se pudo encontrar la ubicación.";
                        }
                    })
                    .catch(err => {
                        console.error("Error al obtener datos de ubicación:", err);
                        document.getElementById('locationDisplay').innerText = "No se pudo obtener información de la ubicación.";
                    });
            }, (error) => {
                console.error("Error al obtener la ubicación:", error);
                document.getElementById('locationDisplay').innerText = "No se pudo obtener la ubicación.";
            });
        } else {
            console.error("La geolocalización no es soportada por este navegador.");
            document.getElementById('locationDisplay').innerText = "Geolocalización no soportada.";
        }
    }

    function saveLocation(locationInfo) {
        let locations = JSON.parse(localStorage.getItem('locations')) || [];
        locations.push(locationInfo);
        localStorage.setItem('locations', JSON.stringify(locations));
        displayPreviousLocations();
    }

    function displayPreviousLocations() {
        const previousLocations = document.getElementById('previousLocations');
        previousLocations.innerHTML = ''; // Limpiar contenido previo
        let locations = JSON.parse(localStorage.getItem('locations')) || [];
        locations.forEach(location => {
            const locationElement = document.createElement('div');
            locationElement.innerText = location;
            previousLocations.appendChild(locationElement);
        });
    }

    // Cargar ubicación al iniciar
    getLocation();
    displayPreviousLocations();
});


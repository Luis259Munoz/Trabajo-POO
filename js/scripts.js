// Iniciamos el mapa
var mapa = L.map('map').setView([4.570868, -74.297333], 6);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(mapa);

var marcActual, marcDestino, ubiActual, ubiDestino, ruta;

// Obtenems la ubicación actual
document.getElementById('locate').onclick = function () {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;

            ubiActual = { lat, lng };
            mapa.setView([lat, lng], 14);
            marcActual = L.marker([lat, lng]).addTo(mapa)
            .bindPopup("Tu ubicación actual").openPopup();

        }, function (error) {
            alert("Error al obtener la ubicación actual, Intentelo nuevamente: " + error.message);
        });
    } 
};

// Busca el destino
document.getElementById('search').onclick = function () {
    const nomDestino = document.getElementById('destination').value;
    if (!nomDestino) {
        alert("Por favor, ingresa el nombre del Destino.");
        return;
    }

    // Buscamos el Destino
    fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(nomDestino)}&format=json&limit=1`)
        .then(response => response.json())
        .then(data => {
            if (data.length === 0) {
                alert("Destino no encontrado, intenta con otro nombre.");
                return;
            }

            const lat = parseFloat(data[0].lat);
            const lng = parseFloat(data[0].lon);
            ubiDestino = { lat, lng };

            mapa.setView([lat, lng], 14);            
            marcDestino = L.marker([lat, lng]).addTo(mapa).bindPopup(`Destino: ${nomDestino}`).openPopup();
        })
};

// Iniciar la ruta
document.getElementById('route').onclick = function () {
    if (!ubiActual) {
        alert("Debes de agregar tu ubicacion actual.");
        return;
    }
    if (!ubiDestino) {
        alert("Debes ingresar tu destino.");
        return;
    }

    // Llamada a la API de enrutamiento OSRM
    const url = `https://router.project-osrm.org/route/v1/driving/${ubiActual.lng},${ubiActual.lat};${ubiDestino.lng},${ubiDestino.lat}?overview=full&geometries=geojson`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (ruta) {
                mapa.removeLayer(ruta);
            }

            // Dibujar la ruta en el mapa
            const trazarRuta = data.routes[0].geometry;
            ruta = L.geoJSON(trazarRuta, {
                style: {
                    color: 'blue',
                    weight: 4,
                    opacity: 0.8
                }
            }).addTo(mapa);

            // Ajustar la vista al área de la ruta
            mapa.fitBounds(L.geoJSON(trazarRuta).getBounds());
        })
        .catch(error => {
            alert("Error al calcular la ruta: " + error.message);
        });
};

// Cancelar la ruta
document.getElementById('cancel-route').onclick = function () {
    if (ruta) {
        mapa.removeLayer(ruta);
        ruta = null;
    }

    if (marcDestino) {
        mapa.removeLayer(marcDestino);
        marcDestino = null;
        document.getElementById('destination').value = '';
    }

    ubiDestino = null;
};
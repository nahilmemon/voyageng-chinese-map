let maxZoom = 18;
let minZoom = 1;
let zoomLevel = 1;

if (window.innerWidth <= 500) {
    zoomLevel = 1;
} else {
    zoomLevel = 2;
}

var normalm = L.tileLayer.chinaProvider('TianDiTu.Normal.Map', {
        maxZoom: maxZoom,
        minZoom: minZoom
    }),
    normala = L.tileLayer.chinaProvider('TianDiTu.Normal.Annotion', {
        maxZoom: maxZoom,
        minZoom: minZoom
    }),
    imgm = L.tileLayer.chinaProvider('TianDiTu.Satellite.Map', {
        maxZoom: maxZoom,
        minZoom: minZoom
    }),
    imga = L.tileLayer.chinaProvider('TianDiTu.Satellite.Annotion', {
        maxZoom: maxZoom,
        minZoom: minZoom
    });

var normal = L.layerGroup([normalm, normala]),
    image = L.layerGroup([imgm, imga]);

var baseLayers = {
    "Default": normal,
    "Terrain": image,
}

var overlayLayers = {

}

var map = L.map("map", {
    center: [40, 25],
    zoom: zoomLevel,
    layers: [normal],
    zoomControl: false
});

// let marker = L.marker([31.59, 120.29]).addTo(map);

L.control.layers(baseLayers, overlayLayers).addTo(map);
L.control.zoom({
    zoomInTitle: 'Zoom In',
    zoomOutTitle: 'Zoom Out'
}).addTo(map);

let attribution = document.querySelector(".leaflet-control-attribution");
attribution.innerHTML = '<div class="leaflet-control-attribution leaflet-control"><a href="https://leafletjs.com" title="A JS library for interactive maps">Leaflet</a> | Map Data and Imagery © <a href="http://lbs.tianditu.gov.cn/">TianDiTu</a></div>';

// Initialize Firebase

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAjJoBjXhukyCrTUUnHDWlXo6g5SllDGto",
    authDomain: "sissi-voyageng.firebaseapp.com",
    databaseURL: "https://sissi-voyageng-default-rtdb.firebaseio.com",
    projectId: "sissi-voyageng",
    storageBucket: "sissi-voyageng.appspot.com",
    messagingSenderId: "489914893913",
    appId: "1:489914893913:web:1fcf09322e547ed8401348"
};
const app = firebase.initializeApp(firebaseConfig);
const dbRef = firebase.database().ref();
let ref = dbRef.child('cities');
let citiesList = [];
let markersList = [];

customCityMarker = L.Marker.extend({
   options: { 
      cityName: 'unknown'
   }
});

// Attach an asynchronous callback to read the data at our posts reference
ref.on('value', (snapshot) => {
    citiesList = snapshot.val();
    for (let i=0; i<citiesList.length; i++) {
        console.log(citiesList[i].latitude, citiesList[i].longitude);
        markersList[i] = new customCityMarker([citiesList[i].latitude, citiesList[i].longitude], {
            cityName: citiesList[i].cityName
        }).addTo(map);
        console.log(markersList[i]);
        markersList[i].bindPopup(`<b>${markersList[i].options.cityName}</b>`);
        markersList[i].on('click', function() { 
            console.log('Clicked on marker for city:', markersList[i].options.cityName);
            ThunkableWebviewerExtension.postMessage(markersList[i].options.cityName);
        });
    }
}, (errorObject) => {
    console.log('The read failed: ' + errorObject.name);
});

var popup = L.popup();

function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(map);
}

map.on('click', onMapClick);
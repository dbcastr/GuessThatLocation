//import { GoogleMapsAPIKey, MapID } from "./keys.js";

let playerMarker, playerLat, playerLng;
let locationMarker, locationLatLng;
let map;

// Initialize Google Maps API
async function loadGoogleMapsAPI() {
  return new Promise((resolve, reject) => {
    if (window.google?.maps) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCGeuZgEWBDFWzhBC6v3w7Z_ntm9oCEstE&v=weekly&callback=initMap`;
    script.async = true;
    script.defer = true;
    script.onerror = () => reject(new Error("Google Maps API failed to load."));
    document.head.appendChild(script);

    window.initMap = resolve;
  });
}

// Places or updates a marker for the player
function placeMarker(location) {
  if (playerMarker) {
    playerMarker.setPosition(location);
  } else {
    playerMarker = new google.maps.Marker({
      position: location,
      map,
    });
  }

  playerLat = location.lat();
  playerLng = location.lng();
}

// Generates a random Street View location
function generateRandomPoint() {
  const sv = new google.maps.StreetViewService();
  const randomLocation = new google.maps.LatLng(
    Math.random() * 180 - 90,
    Math.random() * 360 - 180
  );

  sv.getPanoramaByLocation(randomLocation, 500, processSVData);
}

// Processes Street View data
function processSVData(data, status) {
  if (status === google.maps.StreetViewStatus.OK) {
    console.log("Street View Location:", data.location.latLng.toUrlValue(6));
    
    locationLatLng = data.location.latLng;

    new google.maps.StreetViewPanorama(document.getElementById("pano"), {
      position: locationLatLng,
      pov: { heading: 34, pitch: 10 },
      disableDefaultUI: true,
    });
  } else {
    generateRandomPoint();
  }
}

// Shows the randomly generated location marker
function showLocation() {

  const svgMarker = {
    path: "M-1.547 12l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM0 0q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
    fillColor: "orange",
    fillOpacity: 1,
    strokeWeight: 0,
    rotation: 0,
    scale: 2,
    anchor: new google.maps.Point(0, 20),
  };

  if (!locationLatLng) {
    console.warn("Location not set yet.");
    return;
  }

  if (!locationMarker) {
    locationMarker = new google.maps.Marker({
      position: locationLatLng,
      map: map,
      icon: svgMarker,
    });

    map.setZoom(7);
    map.panTo(locationMarker.position);
  } else {
    locationMarker.setPosition(locationLatLng);
  }

  console.log("Location marker placed at:", locationLatLng.toUrlValue(6));
}

// Initializes the game and Google Maps
async function initialize() {
  await loadGoogleMapsAPI();
  
  const { Map } = await google.maps.importLibrary("maps");
  map = new Map(document.getElementById("map"), {
    center: { lat: 0, lng: 0 },
    streetViewControl: false,
    zoom: 2,
    mapId: "65a00b1ab9b6811",
  });

  map.addListener("click", (e) => placeMarker(e.latLng));

  generateRandomPoint();
}

// Load the map when the script is ready
initialize();

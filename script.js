// import {GoogleMapsAPIKey, MapID} from "./keys.js"

var playerMarker;
var playerLat;
var playerLng;

var locationMarker;
var locationLatLng;
var map;

(g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=`https://maps.${c}apis.com/maps/api/js?`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})
  ({key: GoogleMapsAPIKey, v: "weekly"});


function placeMarker(location, map) {
  if ( playerMarker ) {
    playerMarker.setPosition(location);
  } else {
    playerMarker = new google.maps.Marker({
      position: location,
      map: map
    });
  }

}

function generateRandomPoint() {
  var sv = new google.maps.StreetViewService();
  sv.getPanoramaByLocation(
    new google.maps.LatLng(Math.random() * 180 - 90, Math.random() * 360 - 180), 500, processSVData
  );
}

function processSVData(data, status) {
  if (status == google.maps.StreetViewStatus.OK) {
    console.log("EE " + data.location.latLng.toUrlValue(6));
    console.log(data);
    locationLatLng = data.location.latLng;

    const panorama = new google.maps.StreetViewPanorama(
      document.getElementById("pano"), {
        position: data.location.latLng,
        pov: {
          heading: 34,
          pitch: 10,
        },
        disableDefaultUI: true,
      }
    );
  } else generateRandomPoint();
}

function showLocation() {
  locationMarker = new google.maps.Marker({
      position: locationLatLng,
      map: map
    });

    console.log(typeof(locationLatLng));
}

//Start of game load, GM Api
async function initialize() {
  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary(
    "marker",
  );

    map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 0, lng: 0 },
    streetViewControl: false,
    zoom: 2,
    mapId: MapID,
  });

  map.addListener("click", (e) => {
    placeMarker(e.latLng, map);
    playerLat = e.latLng.lat();
    playerLng = e.latLng.lng();
  });

  generateRandomPoint();
}

initialize();

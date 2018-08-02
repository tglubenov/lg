// Initial JavaScript for Ligth Guard Inc.


var map = new L.map('mapid', {
  center: new L.LatLng(42.617791, 25.026855),
  zoom: 7
});

var tileLayer = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
  maxZoom: 18,
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
    '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  id: 'mapbox.streets'
});

tileLayer.addTo(this.map);

//Gets the current Bounding Box, lat and lon
function BoundingBox() {
  var bounds = map.getBounds().getSouthWest().lng + "," + map.getBounds().getSouthWest().lat + "," + map.getBounds().getNorthEast().lng + "," + map.getBounds().getNorthEast().lat;
  return bounds;
}

//loads the well markers
wellmaxzoom = 5;
var geoJsonUrl ="http://localhost:8080/geoserver/cite/ows? service=WFS&version=1.0.0&request=GetFeature&typeName=cite:bc_well_data_wgs&maxFeatures=4000&outputFormat=application/json";
var geoPoints = "http://206.81.20.203:8080/lgdata";

var geojsonLayerWells = new L.GeoJSON();

function loadGeoJson(data) {
  console.log(data);

  geojsonLayerWells.clearLayers();
  geojsonLayerWells.addData(data);
}

// $.ajax({
//   url: geoJsonUrl + "&bbox=" + BoundingBox(),
//   dataType : 'json',
//   jsonpCallback: 'loadGeoJson',
//   success: loadGeoJson,
// });

$.ajax({
  url: geoPoints,
  dataType: 'json',
  jsonpCallback: 'loadGeoJson',
  success: loadGeoJson,
});

//console.log(BoundingBox());

var allg = document.querySelector('#showLanes').textContent;

//document.querySelector('#layers').style.display = 'none';

console.log(allg);

map.on('moveend', function(){

  if(map.getZoom() > wellmaxzoom){
    map.addLayer(geojsonLayerWells);
    console.log('hhhhh');
  }
  console.log(map.getZoom());
  console.log(BoundingBox());
});

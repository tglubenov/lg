// Initial JavaScript for Ligth Guard Inc.
var base_uri = "http://206.81.20.203:8080";
//var base_uri = "http://localhost:8085";

var map = new L.map('mapid', {
  center: new L.LatLng(42.761722, 25.237705),
  zoom: 6
});

var tileLayer = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
  maxZoom: 20,
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
//var geoJsonUrl ="http://localhost:8080/geoserver/cite/ows? service=WFS&version=1.0.0&request=GetFeature&typeName=cite:bc_well_data_wgs&maxFeatures=4000&outputFormat=application/json";
var geoPoints = base_uri +"/lgdata";

var SpaceLabIcon = L.icon({
  iconUrl: 'Logo_Empty36.png',
  shadowUrl: 'Logo_Empty36.png',
  iconSize:     [36, 40], // size of the icon
  shadowSize:   [36, 40], // size of the shadow
  iconAnchor:   [18, 40], // point of the icon which will correspond to marker's location
  shadowAnchor: [4, 40],  // the same for the shadow
  popupAnchor:  [-3, -16] // point from which the popup should open relative to the iconAnchor
});

var geojsonLayerWells = new L.GeoJSON().on(
  'layeradd', function(e) {
//    console.log(e.layer.feature.properties);
    //console.log(e.feature.properties);
    var els = e.layer.feature.properties;
    var pop = '<tr><td>Място</td><td>гр.Варна</td></tr><tr><td>Адрес</td><td>ул.Георги Бенковски</td></tr>';
    Object.keys(els).forEach(function (key, index) {
      //console.log(key, index, els[key]);
      if (key == 'lon' || key == 'lat') {
        console.log(els[key]);
      } else if(key=='R1') {
        k = 'Ред 1';
        msg = els[key];
        pop += '<tr><td>' + k + '</td><td>' + msg + '</td></tr>';
      } else if (key == 'R2') {
        k = 'Ред 2';
        msg = els[key];
        pop += '<tr><td>' + k + '</td><td>' + msg + '</td></tr>';
      } else if (key == 'M1') {
//        kM1 = 'M линия 1 и 2';
        msgM1 = els[key];
      } else if (key == 'M2') {
        k = 'M линия 1 и 2';
        if (msgM1) {
          if (els[key] == 1 && msgM1 == 1) {
            msg = 'OK';
          } else {
            msg = 'NOK';
          }
        } else {
          msg = 'NOK'
        }
        pop += '<tr><td>' + k + '</td><td>' + msg + '</td></tr>';
      } else if (key =='SL') {
        k = 'S линии 1 и 2';
        if (els[key] == 1) {
          msg = 'OK';
        } else {
          msg = 'NOK';
        }
        pop += '<tr><td>' + k + '</td><td>' + msg + '</td></tr>';
      } else if (key == 'MR') {
        k = 'М радио сензор';
        if (els[key] == 1) {
          msg = 'OK';
        } else {
          msg = 'NOK';
        }
        pop += '<tr><td>' + k + '</td><td>' + msg + '</td></tr>';
      } else if (key == 'SR') {
        k = 'S радио сензор';
        if (els[key] == 1) {
          msg = 'OK';
        } else {
          msg = 'NOK';
        }
        pop += '<tr><td>' + k + '</td><td>' + msg + '</td></tr>';
      } else if (key == 'TS') {
        k = 'Текущ режим';
        msg = 'Няма пешеходци';
        console.log('TS:==>', els[key]);
        pop += '<tr><td>' + k + '</td><td>' + msg + '</td></tr>';
      } else if (key == 'PD') {
        k = 'Пресекли пешеходци';
        msg = els[key];
        pop += '<tr><td>' + k + '</td><td>' + msg + '</td></tr>';
      }
      else {
        console.log('aaa');
      }
      console.log(key);
//      pop += '<li>' + key + ':' + els[key] + '</li>';
    });
    footerer = '<tr><td>Връзка</td><td><a href="/chart" target="_blank">Графика</a></td></tr>';
    pop = '<table><tr><th>Параметър</th><th>Статус</th></tr>' + pop + footerer + '</table>';
//    console.log(pop);
    var pop1 = e.layer.bindPopup(pop);
  }
);

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
//var allg = document.querySelector('#showLanes').textContent;
//document.querySelector('#layers').style.display = 'none';
//console.log(allg);

map.on('moveend', function(){

  if(map.getZoom() > wellmaxzoom){
    map.addLayer(geojsonLayerWells);
  }
  console.log(map.getZoom());
  console.log(BoundingBox());
});

map.addLayer(geojsonLayerWells);

function checkStatus(event) {
  var p_status = true;
  console.log(event.properties);

  if ('R1' in event.properties) {
    console.log(event.properties.R1);
    var str = event.properties.R1;

    console.log(str);
    if (str.indexOf('_')) {
      console.log('err => _____');
    }
    if (str.indexOf('a')) {
      console.log('err => 00000');
    }
  } else {
    console.log('key R1 does not exist in the line');
  }
  if (event) {
    console.log('err');
  } else if (true) {
    p_status = true;
  } else if (true) {
    p_status = true;
  } else {
    p_status = true;
  }
  return p_status;
}

document.querySelector('#last5Events').addEventListener('click',
  function () {
    console.log('press button event');
    // get ajax call
    $.ajax({
      url: base_uri + "/last5",
      dataType: 'json',
      jsonpCallback: 'loadLast5Events',
      success: loadLast5Events,
    });

    function loadLast5Events(data) {
//      console.log(data);
      //document.getElementById('event_list').innerHTML = "";
      for (i = 0; i < data.length; i++) {
//        console.log(data[i]);
//        var event_id = 'event_' + i;
//        console.log(event_id);
        var sts = checkStatus(data[i]);
        var aa = document.getElementById('event_'+i).innerText = data[i].properties.receive_timestamp;
//        console.log(aa);
      }
    }
  });

// Addons by Thirth parties
map.addControl(new L.Control.Fullscreen());

document.getElementsByTagName('select')[0].onchange = function() {
  var index = this.selectedIndex;
  var inputText = this.children[index].innerText.trim();
  console.log(inputText);
  if (inputText == 'Албена') {
    map.setView(new L.LatLng(43.36878055555555, 28.08228888888889), 16);
    console.log('42.653702777777774,23.34400833333333');
  } else if (inputText == 'София - БАН') {
    map.setView(new L.LatLng(42.677009, 23.367479),16);
//    map.setView(new L.LatLng(42.653702777777774,23.34400833333333), 16);
  } else {
    map.setView(new L.LatLng(42.761722,25.237705), 7);
  }
}

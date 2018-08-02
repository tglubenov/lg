
//var Vue = require('vue');
//var L = require('leaflet');

new Vue({
  el: '#mapapp',
  data() {
    return{
      map: null,
      tileLayer: null,
      layers: [],
      maptitle: 'Light Guard Info'
    }
  },
  mounted() {
    this.initMap();
//
    this.initGeo();
  },
  methods: {
    initMap() {
      this.map = L.map('mapid').setView([42.617791, 25.026855], 8);

      this.tileLayer = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
          '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
          'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox.streets'
      });
      this.tileLayer.addTo(this.map);
    },
    initLayers() {
      var lyrs = this.layers;
      for(i =0; i < lyrs.length; i++) {
        var layer = lyrs[i];
        const markerFeatures = layer.features.filter(feature => feature.type === 'marker');

        markerFeatures.forEach((feature) => {
          feature.leafletObject = L.marker(feature.coords)
            .bindPopup(feature.name);
        });

        // for (var i = 0; i < markerFeatures.length; i++) {
        //   var feature = markerFeatures[i];
        //   feature.leafletObject = L.marker(feature.coords)
        //     .bindPopup(feature.name);
        // }
      }
    },
    initGeo() {
      var gfeatures = [];
      this.$http
        .get('/lgdata')
        .then((res) => {
          console.log(res.data.length);
          this.geodata = res.data;

          for (i = 0; i < this.geodata.length; i++) {
            obj = this.geodata[i].properties;
            if (obj.lat || obj.lon) {
              lgobject = {
                m1: obj.M1,
                m2: obj.M2,
                mr: obj.MR,
                pd: obj.PD,
                r1: obj.R1,
                r2: obj.R2,
                coords: [obj.lat, obj.lon],
                timestamp: obj.receive_timestamp,
                type: 'marker',
                name: 'lg',
                err: ''
              }
              gfeatures.push(lgobject);
            } else {
              console.log('err');
            }
          }
          var lyr1 = {
            id: 0,
            name: 'LG',
            active: false,
            features: gfeatures,
          }

          console.log(lyr1);
          this.layers = lyr1;

          console.log(this.layers);

          this.initLayers();

          console.log(this.layers.length);
        });
    },
    layerChanged(layerId, active) {
      const layer = this.layers.find(layer => layer.id === layerId);

      layer.features.forEach((feature) => {
        /* Show or hide the feature depending on the active argument */
        if (active) {
          feature.leafletObject.addTo(this.map);
        } else {
          feature.leafletObject.removeFrom(this.map);
        }
      });
    }
  }
});

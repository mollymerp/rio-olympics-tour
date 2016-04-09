'use strict';

// global mapboxgl 
var mapboxgl = require('mapbox-gl');
var _each = require('lodash.foreach');

var venueAreas = require('./data/areas');
var markerData = require('./data/captions');
mapboxgl.accessToken = 'pk.eyJ1IjoibW9sbHltZXJwIiwiYSI6ImNpbW1xbXptYTAwNTV2N2tyNXR6cmdpaWQifQ.KPB4laFfAUtauSEKssj3eQ';

var splash = {
  id: 'splash',
  geometry: { coordinates: [-60.774781, -16.394651] },
  properties: { zoom: 3 }
}


var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/satellite-hybrid-v8',
  center: [-60.774781, -16.394651],
  zoom: 3
});
var forward_button = document.getElementById('forward');
var back_button = document.getElementById('back');
var stop_ids = venueAreas.features.map(function(feat) { feat.properties.id });

var state = {
  current: {
    id: 'splash',
    index: 0
  },
  stops: ['splash'].concat(stop_ids),
  features: [splash].concat(venueAreas.features),
  forward: function() {
    var i = (this.current.index >= this.stops.length - 1) ? this._setIndex(0) : this._setIndex(this.current.index + 1);
    this._fly(this.features[i]);
    if (back_button.classList.contains('disabled')) { back_button.classList.toggle('disabled') }
  },
  back: function() {
    if (this.current.index > 1) {
      let i = this._setIndex(this.current.index - 1);
      this._fly(this.features[i]);
    } else if (this.current.index === 1) {
      back_button.classList.toggle('disabled');
      let i = this._setIndex(0);
      this._fly(this.features[i]);
    }
  },
  _fly: function(destination) {
    map.off('moveend');
    map.flyTo({
      center: destination.geometry.coordinates,
      zoom: destination.properties.zoom,
      pitch: destination.properties.pitch || 0,
      bearing: destination.properties.bearing || 0
    });
    map.on('moveend', function() {
      addMarkers(destination.properties.id);
    })
  },
  _setIndex: function(newIndex) {
    this.current.index = newIndex;
    this.current.id = this.stops[newIndex];
    return this.current.index;
  }
};
// var forward = state.forward.bind(state);

map.on('load', function() {
  forward_button.addEventListener('click', state.forward.bind(state));
  back_button.addEventListener('click', state.back.bind(state));

  map.on('move', function() { removeMarkers() });

  map.on('click', function(e) {
    console.log(JSON.stringify([e.lngLat.lng, e.lngLat.lat]));
  })

  window.addEventListener('keydown', function(e) {
    if (e.code === "ArrowRight") {
      state.forward();
    }
    if (e.code === "ArrowLeft") {
      state.back();
    }
  })
});



function addMarkers(id) {
  removeMarkers();
  let markerGroup = document.getElementById('markers')
  _each(markerData[id], function(mark) {
    let marker = document.createElement('div');
    marker.className = 'marker';
    if (mark.coordinates.length) {
      let x = map.project(mark.coordinates)['x'];
      let y = map.project(mark.coordinates)['y'];
      marker.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
    }
    let img = document.createElement('img');
    img.src = 'logo_icon_small.png';
    img.className = 'logo-marker';
    marker.appendChild(img);
    let text = "<h3 class='dark text'>"+ mark.caption+"</h3>";
    marker.addEventListener('click', function(e) {
      var tooltip = new mapboxgl.Popup()
        .setLngLat(map.unproject([e.x, e.y]))
        .setHTML(text)
        .addTo(map);
    })

    // marker.appendChild(text);
    markerGroup.appendChild(marker);
  })
}

function removeMarkers() {
  _each(document.getElementsByClassName('marker'), function(el) {
    if (el) { el.remove() }
  });
}

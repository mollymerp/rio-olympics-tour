'use strict';

// global mapboxgl 
var mapboxgl = require('mapbox-gl');
var venueAreas = require('./data/areas');

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
var stop_ids = venueAreas.features.map((feat) => feat.properties.id);

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
    console.log(this.current.index, this.features[this.current.index])
    if (this.current.index - 1 > 1) {
      let i = this._setIndex(this.current.index-1);
      this._fly(this.features[i]);
    } else if (this.current.index > 0) {
      let i = this._setIndex(0);
      back_button.classList.toggle('disabled');
      this._fly(this.features[i]);
    }
  },
  _fly: function(destination) {
    map.flyTo({
      center: destination.geometry.coordinates,
      zoom: destination.properties.zoom,
      pitch: destination.properties.pitch || 0,
      bearing: destination.properties.bearing || 0
    })
  }, 
  _setIndex: function(newIndex) {
    this.current.index = newIndex;
    this.current.id = this.stops[newIndex];
    return this.current.index;
  }
};
// var forward = state.forward.bind(state);

map.on('load', () => {
  forward_button.addEventListener('click', state.forward.bind(state));
  back_button.addEventListener('click', state.back.bind(state));

  map.on('click', (e) => {
    console.log([e.lngLat.lng, e.lngLat.lat])
  })

  window.addEventListener('keydown', (e) => {
    if (e.code === "ArrowRight") {
      state.forward();
    }
    if (e.code === "ArrowLeft") {
      state.back();
    }
  })
});

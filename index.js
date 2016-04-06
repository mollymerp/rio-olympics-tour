'use strict';

// global mapboxgl 
var mapboxgl = require('mapbox-gl');
var venueAreas = require('./areas');

mapboxgl.accessToken = 'pk.eyJ1IjoibW9sbHltZXJwIiwiYSI6ImNpbW1xbXptYTAwNTV2N2tyNXR6cmdpaWQifQ.KPB4laFfAUtauSEKssj3eQ';
var splash = {
  id: 'splash',
  geometry: { coordinates: [-60.774781, -16.394651] },
  properties: {zoom: 3}
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
    this.current.index = (this.current.index >= this.stops.length - 1) ? 0 : this.current.index + 1;
    this.current.id = this.stops[this.current.index];
    this._fly(this.features[this.current.index]);
    if (back_button.classList.contains('disabled')) { back_button.classList.toggle('disabled') }
  },
  back: function() {
    console.log(this.current.index, this.features[this.current.index])
    if (this.current.index - 1 > 1) {
      this.current.index--;
      this.current.id = this.stops[this.current.index];
      this._fly(this.features[this.current.index]);
    } else if (this.current.index > 0) {
      this.current.index = 0;
      back_button.classList.toggle('disabled');
      this._fly(this.features[this.current.index]);
    }
  },
  _fly: function(destination) {
    map.flyTo({
      center: destination.geometry.coordinates,
      zoom: destination.properties.zoom,
      pitch: destination.properties.pitch || 0,
      bearing: destination.properties.bearing || 0
    })
  }
};
// var forward = state.forward.bind(state);

map.on('load', () => {
  forward_button.addEventListener('click', state.forward.bind(state));
  back_button.addEventListener('click', state.back.bind(state));
});

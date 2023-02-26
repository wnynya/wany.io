'use strict';

const styles = [
  {
    elementType: 'geometry',
    stylers: [
      {
        color: '#000000',
      },
    ],
  },
  {
    elementType: 'labels.icon',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#008000',
      },
    ],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#000000',
      },
    ],
  },
  {
    featureType: 'administrative',
    elementType: 'geometry',
    stylers: [
      {
        color: '#00ff00',
      },
    ],
  },
  {
    featureType: 'administrative.country',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#00b400',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [
      {
        color: '#001400',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [
      {
        color: '#002d00',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: '#00ff00',
      },
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [
      {
        color: '#005000',
      },
    ],
  },
  {
    featureType: 'transit.station',
    elementType: 'geometry',
    stylers: [
      {
        color: '#001400',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [
      {
        color: '#141414',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#005000',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#000000',
      },
    ],
  },
];

window.googleMap = () => {
  const lat = window.coordinate.lat;
  const lng = window.coordinate.lng;

  const map = new google.maps.Map(
    document.querySelector('#network-crystal-results-geoip-map'),
    {
      center: { lat: lat * 1.0, lng: lng * 1.0 },
      zoom: 12,
      mapTypeId: 'roadmap',
      styles: styles,
      disableDefaultUI: true,
    }
  );

  let svg =
    '<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200.1 200.02"><defs><style>.p{fill:none;stroke:#00ff00;stroke-miterlimit:10;stroke-width:3px;}</style></defs><path class="p" d="M.1,100c56.25-5.68,101.16-51.25,100-100h0a100,100,0,0,0,100,100h0a100,100,0,0,0-100,100h0A100,100,0,0,0,.1,100Z"/></svg>';

  new google.maps.Marker({
    position: new google.maps.LatLng(lat, lng),
    icon: {
      url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg),
      scaledSize: new google.maps.Size(120, 120),
      anchor: new google.maps.Point(60, 60),
    },
    optimized: false,
    map: map,
  });
};
var script = document.createElement('script');
script.src = 'https://maps.googleapis.com/maps/api/js';
script.src += '?key=AIzaSyCGgZ6ebMuZB-dls0c_rc6THTlLchRuf1k';
script.src += '&callback=googleMap&v=weekly';
script.async = true;
document.head.appendChild(script);

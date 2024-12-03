mapboxgl.accessToken = 'pk.eyJ1IjoidGF5c2FhYmluYWRlciIsImEiOiJjbTJ4MTZ2dHMwMDQxMmpyNHFwMHlsaDlxIn0.Qhai-MjtxWtJ1Bg1G4rkYw';

const map = new mapboxgl.Map({
  style: 'mapbox://styles/taysaabinader/cm434iwew00zh01sd4tmv0rxd',
  container: 'map', // container ID
  //center: [-74.5, 40], // starting position [lng, lat]. Note that lat must be set between -90 and 90
  zoom: 1.5 // starting zoom
  });

const planeMarker = new mapboxgl.Marker({
      element: createPlaneIcon(),
      anchor: 'center'
    }).setLngLat([0, 0]) // Start position (center of map)
      .addTo(map);



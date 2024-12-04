mapboxgl.accessToken = 'pk.eyJ1IjoidGF5c2FhYmluYWRlciIsImEiOiJjbTJ4MTZ2dHMwMDQxMmpyNHFwMHlsaDlxIn0.Qhai-MjtxWtJ1Bg1G4rkYw';

const map = new mapboxgl.Map({
  style: 'mapbox://styles/taysaabinader/cm434iwew00zh01sd4tmv0rxd',
  container: 'map',
  zoom: 1.5,
});

let planeMarkerOrigin = [25.748151, 61.92411];
let planeMarkerDestination = [25.748151, 61.92411];

const route = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [planeMarkerOrigin, planeMarkerDestination],
      },
    },
  ],
};

const point = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Point',
        coordinates: planeMarkerOrigin,
      },
    },
  ],
};

const steps = 500;
let counter = 0;

map.on('load', () => {
  map.loadImage(
    'https://img.icons8.com/color/96/000000/airplane-mode-on.png',
    (error, image) => {
      if (error) throw error;
      map.addImage('custom-marker', image);
    }

  );

  map.addSource('route', { type: 'geojson', data: route });
  map.addSource('point', { type: 'geojson', data: point });

  map.addLayer({
    id: 'route',
    source: 'route',
    type: 'line',
    paint: { 'line-width': 2, 'line-color': '#007cbf' },
  });

  map.addLayer({
    id: 'point',
    source: 'point',
    type: 'symbol',
    layout: {
      'icon-image': 'custom-marker',
      'icon-size': 0.5,
      'icon-rotate':['+', ['get', 'bearing'], -90],
      'icon-rotation-alignment': 'map',
      'icon-allow-overlap': true,
      'icon-ignore-placement': true,
    },
  });

  function animate() {
    const start = route.features[0].geometry.coordinates[counter >= steps ? counter - 1 : counter];
    const end = route.features[0].geometry.coordinates[counter >= steps ? counter : counter + 1];

    if (!start || !end) {
      running = false;
      return;
    }

    point.features[0].geometry.coordinates = route.features[0].geometry.coordinates[counter];
    point.features[0].properties.bearing = turf.bearing(turf.point(start), turf.point(end));

    map.getSource('point').setData(point);

    if (counter < steps) {
      requestAnimationFrame(animate);
    } else {
      running = false;
    }
    counter++;
  }

  async function navigate(country) {
    try {
      const response = await fetch(`http://127.0.0.1:8000/fetchcoordinates/${country}`);
      const result = await response.json();
      planeMarkerDestination = [result.longitude, result.latitude];

      route.features[0].geometry.coordinates = [planeMarkerOrigin, planeMarkerDestination];

      const arc = [];
      const lineDistance = turf.length(route.features[0]);
      for (let i = 0; i < lineDistance; i += lineDistance / steps) {
        const segment = turf.along(route.features[0], i);
        arc.push(segment.geometry.coordinates);
      }
      route.features[0].geometry.coordinates = arc;

      map.getSource('route').setData(route);

      planeMarkerOrigin = planeMarkerDestination; // Update the origin
      counter = 0;
      animate();
    } catch (error) {
      console.error('Error fetching coordinates:', error);
    }
  }

  navigate('Canada');
});

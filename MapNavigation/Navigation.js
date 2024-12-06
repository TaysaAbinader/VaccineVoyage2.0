mapboxgl.accessToken = 'pk.eyJ1IjoidGF5c2FhYmluYWRlciIsImEiOiJjbTJ4MTZ2dHMwMDQxMmpyNHFwMHlsaDlxIn0.Qhai-MjtxWtJ1Bg1G4rkYw';

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/taysaabinader/cm434iwew00zh01sd4tmv0rxd',
  center: [0, 0],
  zoom: 1.5,
  projection: 'mercator', // Keep the map flat
});

let planeMarkerOrigin = [25.748151, 61.92411];
let planeMarkerDestination = [25.748151, 61.92411];

const route = { //geojson
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
      properties: { bearing: 0 },
      geometry: {
        type: 'Point',
        coordinates: planeMarkerOrigin,
      },
    },
  ],
};

const steps = 500; // Number of steps for smooth interpolation
let counter = 0;
let running = false; // Tracks if animation is in progress
let navigating = false; // Tracks if navigation queue is being processed

const navigationQueue = []; // Queue of countries to navigate

map.on('style.load', () => {
  console.log('Map loaded successfully.');

  map.loadImage(
    'https://i.postimg.cc/bNcXq4Dv/airplane-mode-on.png',
    (error, image) => {
      if (error) {
        console.error('Error loading the image:', error);
        return;
      }
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
      'icon-size': 1.0,
      'icon-rotate': ['+', ['get', 'bearing'], -90],
      'icon-rotation-alignment': 'map',
      'icon-allow-overlap': true,
      'icon-ignore-placement': true,
    },
  });

  function normalizeLongitude(lon) {
    return ((lon + 540) % 360) - 180; // Normalize to range [-180, 180]
  }

  async function animate(resolve) {
    const coordinates = route.features[0].geometry.coordinates;

    if (!coordinates || coordinates.length < 2) {
      console.error('Invalid coordinates for animation:', coordinates);
      running = false;
      resolve();
      return;
    }

    if (counter >= coordinates.length - 1) {
      running = false;
      resolve();
      return;
    }

    const start = coordinates[counter];
    const end = coordinates[counter + 1];

    if (!start || !end || start.length !== 2 || end.length !== 2) {
      console.error('Invalid start or end coordinates:', { start, end });
      running = false;
      resolve();
      return;
    }

    console.log(`Animating from ${start} to ${end} (Step ${counter})`);

    let calculatedBearing = 0;
    try {
      calculatedBearing = turf.bearing(turf.point(start), turf.point(end)) || 0;
    } catch (error) {
      console.warn('Error calculating bearing, defaulting to 0:', error, { start, end });
    }

    // Update the point's position and bearing
    point.features[0].geometry.coordinates = start;
    point.features[0].properties.bearing = calculatedBearing;

    try {
      map.getSource('point').setData(point);
    } catch (error) {
      console.error('Error updating the map point source:', error);
      running = false;
      resolve();
      return;
    }

    if (counter < coordinates.length - 1) {
      counter++;
      requestAnimationFrame(() => animate(resolve));
    } else {
      running = false;
      resolve();
    }
  }

  async function navigate(country) {
    console.log(`Adding ${country} to the queue.`);
    navigationQueue.push(country);

    if (navigating) {
      console.log('Navigation already in progress. Waiting...');
      return;
    }

    navigating = true;

    while (navigationQueue.length > 0) {
      const nextCountry = navigationQueue.shift();
      console.log(`Navigating to: ${nextCountry}`);
      await navigateTo(nextCountry);
    }

    navigating = false;
    console.log('All navigation completed.');
  }

  async function navigateTo(country) {
    if (running) {
      await new Promise(resolve => {
        const checkRunning = () => {
          if (!running) {
            resolve();
          } else {
            requestAnimationFrame(checkRunning);
          }
        };
        checkRunning();
      });
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/fetchcoordinates/${country}`);
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const result = await response.json();
      if (!result || typeof result.longitude !== 'number' || typeof result.latitude !== 'number') {
        throw new Error(`Invalid coordinates received from server: ${JSON.stringify(result)}`);
      }

      planeMarkerDestination = [result.longitude, result.latitude];

      // Normalize longitudes for antimeridian handling
      const adjustedOrigin = [normalizeLongitude(planeMarkerOrigin[0]), planeMarkerOrigin[1]];
      const adjustedDestination = [normalizeLongitude(planeMarkerDestination[0]), planeMarkerDestination[1]];

      console.log('Adjusted Coordinates:', { adjustedOrigin, adjustedDestination });

      // Validate adjusted coordinates
      if (
        !Array.isArray(adjustedOrigin) ||
        adjustedOrigin.length !== 2 ||
        isNaN(adjustedOrigin[0]) ||
        isNaN(adjustedOrigin[1]) ||
        !Array.isArray(adjustedDestination) ||
        adjustedDestination.length !== 2 ||
        isNaN(adjustedDestination[0]) ||
        isNaN(adjustedDestination[1])
      ) {
        throw new Error('Invalid adjusted coordinates');
      }

      // Generate geodesic arc
      let arc = [];
      try {
        console.log('Generating geodesic arc...');
        arc = turf.greatCircle(turf.point(adjustedOrigin), turf.point(adjustedDestination), {
          npoints: steps,
        }).geometry.coordinates;

        // Validate the generated arc
        if (!Array.isArray(arc) || arc.some(coord => coord.length !== 2 || isNaN(coord[0]) || isNaN(coord[1]))) {
          throw new Error('Generated arc is invalid');
        }
      } catch (error) {
        console.error('Error generating geodesic arc:', error);
        console.log('Falling back to straight-line interpolation.');

        // Fallback to straight-line interpolation
        arc = [];
        for (let i = 0; i <= steps; i++) {
          const interpolatedLon = adjustedOrigin[0] + (i / steps) * (adjustedDestination[0] - adjustedOrigin[0]);
          const interpolatedLat = adjustedOrigin[1] + (i / steps) * (adjustedDestination[1] - adjustedOrigin[1]);
          arc.push([interpolatedLon, interpolatedLat]);
        }
      }

      route.features[0].geometry.coordinates = arc;

      map.getSource('route').setData(route);

      console.log(`Generated route for ${country}:`, arc);

      // Reset the animation counter and start animation
      counter = 0;
      running = true;

      await new Promise(resolve => {
        animate(resolve);
      });

      planeMarkerOrigin = planeMarkerDestination;
      console.log(`Navigation to ${country} completed.`);
    } catch (error) {
      console.error('Error navigating to country:', error);
    }
  }

  async function onCorrectCountryFound(countryName) {
    console.log(`Player found the correct country: ${countryName}`);
    await navigate(countryName); // Ensure navigate function is called here
  }

//Test function
  function gameLogic() {
    setTimeout(() => onCorrectCountryFound('Brazil'), 2000);
    setTimeout(() => onCorrectCountryFound('India'), 5000);
    setTimeout(() => onCorrectCountryFound('Australia'), 8000);
    setTimeout(() => onCorrectCountryFound('Peru'), 11000);
    setTimeout(() => onCorrectCountryFound('Germany'), 14000);
    setTimeout(() => onCorrectCountryFound('Panama'), 17000);
    setTimeout(() => onCorrectCountryFound('Egypt'), 20000);
    setTimeout(() => onCorrectCountryFound('Puerto Rico'), 23000);
    setTimeout(() => onCorrectCountryFound('France'), 26000);
    setTimeout(() => onCorrectCountryFound('Cape Verde'), 29000);
    setTimeout(() => onCorrectCountryFound('South Korea'), 31000);
  }

  gameLogic();
});

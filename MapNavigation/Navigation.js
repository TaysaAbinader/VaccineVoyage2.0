
mapboxgl.accessToken = 'pk.eyJ1IjoidGF5c2FhYmluYWRlciIsImEiOiJjbTJ4MTZ2dHMwMDQxMmpyNHFwMHlsaDlxIn0.Qhai-MjtxWtJ1Bg1G4rkYw';


const map = new mapboxgl.Map({
  style: 'mapbox://styles/taysaabinader/cm434iwew00zh01sd4tmv0rxd',
  container: 'map',
  zoom: 1.5
  });


const planeMarkerOrigin = [25.748151, 61.92411]

    //new mapboxgl.Marker({
      //element: createCustomMarker(),
      //anchor: 'center'
    //}).setLngLat([25.748151, 61.92411])
      //.addTo(map);

  //function createCustomMarker() {
    //const div = document.createElement('div');
    //div.style.width = '25px'; // Set marker width
    //div.style.height = '25px'; // Set marker height
    //div.style.backgroundImage = 'url(PlaneMarker.png)'; // Path to your image
    //div.style.backgroundSize = 'contain'; // Ensure the image fits the div
    //div.style.backgroundRepeat = 'no-repeat'; // Prevent repeating
    //div.style.backgroundPosition = 'center'; // Center the image
    //div.style.borderRadius = '50%'; // Optional: Make it circular
    //div.style.border = '1px solid white'; // Optional: Add a border
    //return div; }

    const planeMarkerDestination = [-70.575844, -8.09594]

    const route = {
      'type': 'FeatureCollection',
      'features': [
        {
          'type': 'Feature',
          'geometry': {
            'type': 'LineString',
            'coordinates': [planeMarkerOrigin, planeMarkerDestination]
          }
        }
      ]
    };

    const point = {
      'type': 'FeatureCollection',
      'features': [
        {
          'type': 'Feature',
          'properties': {},
          'geometry': {
            'type': 'Point',
            'coordinates': planeMarkerOrigin
          }
        }]
    };

    const lineDistance = turf.length(route.features[0])

    const arc = [];

    const steps = 500;

    for (let i = 0; i < lineDistance; i += lineDistance / steps) {
      const segment = turf.along(route.features[0], i);
      arc.push(segment.geometry.coordinates);
    }

    route.features[0].geometry.coordinates = arc

    let counter = 0;

    map.on('load', () => {

      map.loadImage(
              'https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png',
              (error, image) => {
                  if (error) throw error;
                  map.addImage('custom-marker', image)});

      map.addSource('point', {
        'type': 'geojson',
        'data': point
      });
      map.addLayer({
        'id': 'route',
        'source': 'route',
        'type': 'line',
        'paint': {
          'line.width': 2,
          'line-color': '#007cbf'
        }
      });

      map.addLayer({
        'id': 'point',
        'source': 'point',
        'type': 'symbol',
        'layout': {
          'icon-image': 'custom-marker',
          'icon-size': 1.5,
          'icon-rotate': ['get', 'bearing'],
          'icon-rotation-alignment': 'map',
          'icon-allow-overlap': true,
          'icon-ignore-placement': true
        }
      });

      let running = false;

      function animate() {
        running = true;
        document.getElementById('go').disabled = true;
        const start = route.features[0].geometry.coordinates[counter >= steps ?
            counter - 1 :
            counter];
        const end = route.features[0].geometry.coordinates[counter >= steps ?
            counter :
            counter + 1];
        if (!start || !end) {
          running = false;
          document.getElementById('go').disabled = false;
          return;
        }
        point.features[0].geometry.coordinates = route.features[0].geometry.coordinates[counter];
        point.features[0].properties.bearing = turf.bearing(turf.point(start), turf.point(end));

        map.getSource('point').setData(point);

        if (counter < steps) {
          requestAnimationFrame(animate);
        }
        counter = counter + 1;
      }

      document.getElementById('go').addEventListener('click', () => {
        if (running) {
          void 0;
        } else {
          point.features[0].geometry.coordinates = origin;
          map.getSource('point').setData(point);
          counter = 0;
          animate(counter);
        }
      });

      animate(counter);
    });

  

async function navigate(country) {
      try {
        const response = await fetch(
            `http://127.0.0.1:8000/fetchcoordinates/${country}`);
        const result = await response.json();
        let longitude = result.longitude;
        let latitude = result.latitude;
        let planeMarker = [longitude, latitude]
        return coordinates;
      } catch (error) {
        console.error(error);
      }
  }
mapboxgl.accessToken = 'pk.eyJ1IjoiamVmZmFsbGVuIiwiYSI6InJOdUR0a1kifQ.fTlTX02Ln0lwgaY4vkubSQ';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/jeffallen/cikwpimqy00ex9flxwn2ntyjp',
    //style: 'mapbox://styles/mapbox/streets-v8',
    center: [138, 17],
    zoom: 1.5,
    attributionControl: false,
});

// add plate boundaries
map.on('style.load', function () {
    map.addSource('plates', {
        'type': 'geojson',
        'data': plates
    });

    map.addLayer({
        'id': 'plates',
        'type': 'line',
        'source': 'plates',
        'layout': {},
        'paint': {
            "line-color": "#000",
            "line-dasharray": [4,2]
        }
    });
});

// add volcano points
map.on('style.load', function () {
    map.addSource("volcanoes", {
        "type": "geojson",
        "data": volcanoes,
    });

    map.addLayer({
        "id": "volcanoes",
        "type": "symbol",
        "interactive": true,
        "source": "volcanoes",
        "layout": {
            "icon-image": "{marker-symbol}",
            "icon-padding": -16,
            "icon-size": 0.72,
        },
        "paint":{
          "icon-opacity": 0.9,
        }
    });
});


// adding pop-ups
var popup = new mapboxgl.Popup();

map.on('click', function (e) {
    map.featuresAt(e.point, {
        radius: 10,
        includeGeometry: true,
        layer: 'volcanoes'
    }, function (err, features) {

        if (err || !features.length) {
            popup.remove();
            return;
        }

        var feature = features[0];

        // 0 elevation to unsepcified = 0 were null in the csv table
        var xy = feature.geometry.coordinates
        var elev = feature.properties.Elevation
        if (elev != 0) {
            var elev = feature.properties.Elevation + "m"
        } else {
            var elev = "unspecified"
        }

        // log some stuff in the console for testing
        console.log(xy)
        console.log(elev)
        console.log(e.lngLat)

        popup.setLngLat(e.lngLat)
            .setHTML(
                    "<b>Name:</b> " + feature.properties.Name + "<br>" +
                    "<b>Type:</b> " + feature.properties.Type + "<br>" +
                    "<b>Elevation: </b>" + elev
                    )
            .addTo(map);
    });
});

map.on('mousemove', function (e) {
    map.featuresAt(e.point, {
        radius: 7.5, // Half the marker size (15px).
        layer: 'volcanoes'
    }, function (err, features) {
        map.getCanvas().style.cursor = (!err && features.length) ? 'pointer' : '';
    });
});


// add zoom and compass controls
map.addControl(new mapboxgl.Navigation({position: 'top-right'}));

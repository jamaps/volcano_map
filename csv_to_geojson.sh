ogr2ogr -f 'GeoJSON' volcano.geojson -t_srs "EPSG:4326" volcano.csv -dialect sqlite -sql "SELECT MakePoint(CAST(Longitude as REAL), CAST(Latitude as REAL), 4326) Geometry, * FROM volcano"

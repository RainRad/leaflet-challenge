var myMap = L.map ("map").setView([34.0522, -104.9903],4);
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);
  
  // Store our API endpoint as queryUrl.
  var earthquakeGeojsonLink = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
  
  var geojson;
  
  // Get the data with d3, apply createFeature to each feature in dataset
d3.json(earthquakeGeojsonLink).then(function(data){
    for (let i = 0; i < data.features.length; i++) {
        var datapoint = data.features[i]
        L.circle([datapoint.geometry.coordinates[1], datapoint.geometry.coordinates[0]], {
            color: getColor(datapoint.geometry.coordinates[2]),
            fillColor: getColor(datapoint.geometry.coordinates[2]),
            fillOpacity: 0.75,
            radius: ((datapoint.properties.mag * 7500))
          }).bindPopup("</strong><br /><br />Estimated depth: " +
          datapoint.geometry.coordinates[2] +"km" + "</strong><br /><br />Estimated magnitude: " +
          datapoint.properties.mag).addTo(myMap); 
        }

        
    
})

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (myMap) {

    var div = L.DomUtil.create('div', 'info legend'),
        depth = [0, 1.5, 2.5, 5, 7.5, 10, 15, 25],
        labels = [];

        var legendInfo = "<h1>Depth of Earthquake (in kms) <br /></h1>" 
      
        div.innerHTML = legendInfo;
    // loop through our depth intervals and generate a label with a colored square for each interval
    for (var i = 0; i < depth.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(depth[i] + 1) + '"></i> ' +
            depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(myMap);     



// Function to assign colors
function getColor(depth) {
    return depth > 25 ? '#800026' :
           depth > 15  ? '#BD0026' :
           depth > 10  ? '#E31A1C' :
           depth > 7.5  ? '#FC4E2A' :
           depth > 5  ? '#FD8D3C' :
           depth > 2.5   ? '#FEB24C' :
           depth > 1.5   ? '#FED976' :
                      '#FFEDA0';
}
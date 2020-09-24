// var width = 700;
// var height = 580;

// Creating map object
var myMap = L.map("map", {
    center: [38, -98],
    zoom: 4
});

// Adding tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "light-v10",
    accessToken: API_KEY
}).addTo(myMap);

// Load in geojson data, link for GeoJSON US States is from https://eric.clst.org/tech/usgeojson/
var geoData = "static/data/gz_2010_us_040_00_5m.json";
var jsonData = "/api/v1.0/travel_trips";

var geojson;
var metricinfo;
var metricData;

// add states data to the map
L.geoJson(statesData, {
    style: {
        color: "#fff",
        fillColor: "lightblue",
        weight: 1,
        fillOpacity: 0.75
    },
}).addTo(myMap);

function init() {
    // var dropdown = d3.select('#selDataset');
    // var months = [];

    // Use d3.json() to fetch data from JSON file
    d3.json(jsonData, data => {
        var dropdown = d3.select('#selDataset');
        // .data(d3.map(data, data.month_year).keys()).enter();

        // for(var i=0; i < data.length; i++) {
        //     months = data[i].month_year;
        //     console.log(months);
        // }

        data.forEach(function(month) {
            dropdown.append("option").text(month.month_year).attr("value",month.month_year);
        });
        getmonth(data[0].month_year);
        metricinfo = "Total Trips";
        // metricData = "total_trips"
        // console.log(data[0].month_year);
    });
};

d3.selectAll("body").on("change", getmonth);

function getmonth(month) {

    d3.json(jsonData, function(data) {
        var filteredinfo = data.filter(d => d.month_year == month);
        // console.log(filteredinfo);

        //loop through data and join wth states data
        for(var i = 0; i < filteredinfo.length; i++) {
            for(var j = 0; j < filteredinfo.length; j++) {
                if(filteredinfo[i].state === statesData.features[j].properties.name) {
                    statesData.features[j].properties.no_travel_pop = filteredinfo[i].no_travel_pop;
                    statesData.features[j].properties.travel_pop = filteredinfo[i].travel_pop;
                    statesData.features[j].properties.total_trips = filteredinfo[i].total_trips;
                    statesData.features[j].properties.trips_1 = filteredinfo[i].trips_1;
                    statesData.features[j].properties.trips_3_5 = filteredinfo[i].trips_3_5;
                    statesData.features[j].properties.trips_10_25 = filteredinfo[i].trips_10_25;
                    statesData.features[j].properties.trips_50_100 = filteredinfo[i].trips_50_100;
                }
            }
        };
        // console.log(filteredinfo[1].state);
        // console.log(filteredinfo[0].total_trips);
        // console.log(statesData.features[0].properties);
    
    // Use D3 to select the dropdown menu
    var dropdownMenu = d3.select("#selDataset-2");
    // Assign the value of the dropdown menu option to a variable
    var dataset = dropdownMenu.node().value;
    
            // function getmetric(metric) {

            switch(dataset) {
                case "People staying at Home":
                    metricinfo = "People at Home";
                    metricData = "no_travel_pop";
                    break;

                case "People traveling":
                    metricinfo = "People traveling";
                    metricData = "travel_pop";
                    break;

                case "Trips 5 to 10 miles":
                    metricinfo = "Trip 5-10 miles";
                    metricData = "trips_5_10";
                    break;

                case "Trips 100 to 250":
                    metricinfo = "Trip 100-250 miles";
                    metricData = "trips_100_250";
                    break;

                case "Trips above 500":
                    metricinfo = "Trip > 500 miles";
                    metricData = "trips_500";
                    break;

                default:
                    metricinfo = "Total Trips";
                    metricData = "total_trips";
                    break;
            }

            geojson = L.choropleth(statesData, {

                // Define what  property in the features to use
                valueProperty: "total_trips",

                // Set color scale
                scale: ["#ffffb2", "#b10026"],

                // Number of breaks in step range
                steps: 12,

                // q for quartile, e for equidistant, k for k-means
                mode: "q",
                style: {
                    // Border color
                    color: "#fff",
                    weight: 1,
                    fillOpacity: 0.8
                },

                // Binding a pop-up to each layer
                onEachFeature: function(feature, layer) {
                    layer.bindPopup(`State: ${feature.properties.name} <br> ${metricinfo}:
                    ${feature.properties.total_trips}`);
                }
            }).addTo(myMap);

            // Set up the legend
            var legend = L.control({ position: "bottomright" });
            legend.onAdd = function() {
                var div = L.DomUtil.create("div", "info legend");
                var limits = geojson.options.limits;
                var colors = geojson.options.colors;
                var labels = [];

                // Add min & max
                var legendInfo = "<h1>"+ metricinfo +"</h1>" +
                "<div class=\"labels\">" +
                    "<div class=\"min\">" + limits[0] + "</div>" +
                    "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
                "</div>";

                div.innerHTML = legendInfo;

                limits.forEach(function(limit, index) {
                labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
                });

                div.innerHTML += "<ul>" + labels.join("") + "</ul>";
                return div;
            };
            // Adding legend to the map
            legend.addTo(myMap)
        // };
        // console.log(statesData.features[0].properties.name);
    });
    // console.log(filteredinfo[0]);
};

function monthChanged(month) {
    getmonth(month);
};

// function metricChanged(metric) {
//     getmetric(metric);
// };

init();
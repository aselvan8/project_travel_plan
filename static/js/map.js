// Creating map object
const map1 = L.map("map_1", {
    center: [38, -98],
    zoom: 4
});

const map2 = L.map("map_2", {
    center: [38, -98],
    zoom: 4
});

const map3 = L.map("map_3", {
    center: [38, -98],
    zoom: 4
});

const map4 = L.map("map_4", {
    center: [38, -98],
    zoom: 4
});

const map5 = L.map("map_5", {
    center: [38, -98],
    zoom: 4
});

const map6 = L.map("map_6", {
    center: [38, -98],
    zoom: 4
});


const mapboxToken = API_KEY;
const mapboxUrl = "https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}";
const mapboxAttribution = ["Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",].join(" ");

const mapbox = (map) => {
    return L.tileLayer(mapboxUrl, {
        id: 'light-v10',
        accessToken: mapboxToken,
        attribution: mapboxAttribution,
    }).addTo(map);
};
[map1, map2, map3, map4, map5, map6].forEach(mapInstance => mapbox(mapInstance));

// add states data to the map
const mapstate = (map) => {
    return L.geoJson(statesData, {
        style: {
            color: "#fff",
            fillColor: "lightblue",
            weight: 1,
            fillOpacity: 0.75
        },
    }).addTo(map);
};
[map1, map2, map3, map4, map5, map6].forEach(mapInstance => mapstate(mapInstance));

// Add a scale
const scaleControl = (map) => {
    return L.control.scale({
    maxWidth: 400,
    metric: false,
    imperial: true,
    position: 'bottomleft'
    });
}
// scaleControl.addTo(map1);
// scaleControl.addTo(map2);
[map1, map2, map3, map4, map5, map6].forEach(mapInstance => scaleControl(mapInstance));

// Initial code for map
// // Adding tile layer
// L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//     attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//     tileSize: 512,
//     maxZoom: 18,
//     zoomOffset: -1,
//     id: "light-v10",
//     accessToken: API_KEY
// }).addTo(myMap);
// var metricinfo;
// var metricData;


// Load in geojson data, link for GeoJSON US States is from https://eric.clst.org/tech/usgeojson/
var geoData = "static/data/gz_2010_us_040_00_5m.json";
var jsonData = "/api/v1.0/travel_trips";
var monthDropdown = "/api/v1.0/month_year";

function init() {

    // Use d3.json() to fetch data from JSON file
    d3.json(jsonData, data => {
        var dropdown = d3.select('#selDataset');

        var unique = [];

        data.forEach(function(month) {
            if(unique.includes(month.month_year)) {

            }
            else {
                unique.push(month.month_year);
                dropdown.append("option").text(month.month_year).attr("value",month.month_year);
            }
        });
        // console.log(unique);
        getmonth(data[0].month_year);
        // console.log(data[0].month_year);
    });
};

// d3.selectAll("body").on("change", getmonth);

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
                    statesData.features[j].properties.trips_5_10 = filteredinfo[i].trips_5_10;
                    statesData.features[j].properties.trips_100_250 = filteredinfo[i].trips_100_250;
                    statesData.features[j].properties.trips_500 = filteredinfo[i].trips_500;
                }
            }
        };
        // console.log(filteredinfo[1].state);
        // console.log(filteredinfo[0].total_trips);
        // console.log(statesData.features[0].properties);



            var geojson_1 = L.choropleth(statesData, {

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
                        layer.bindPopup(`State: ${feature.properties.name} <br> Total Trips:
                        ${feature.properties.total_trips}`);
                    }
                }).addTo(map1);

                var geojson_2 = L.choropleth(statesData, {

                    // Define what  property in the features to use
                    valueProperty: "no_travel_pop",

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
                        layer.bindPopup(`State: ${feature.properties.name} <br> Pop stay at home:
                        ${feature.properties.no_travel_pop}`);
                    }
                }).addTo(map2);


                var geojson_3 = L.choropleth(statesData, {

                    // Define what  property in the features to use
                    valueProperty: "travel_pop",

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
                        layer.bindPopup(`State: ${feature.properties.name} <br> Pop Traveling:
                        ${feature.properties.travel_pop}`);
                    }
                }).addTo(map3);

                var geojson_4 = L.choropleth(statesData, {

                    // Define what  property in the features to use
                    valueProperty: "trips_5_10",

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
                        layer.bindPopup(`State: ${feature.properties.name} <br> Trips between 5-10 miles:
                        ${feature.properties.trips_5_10}`);
                    }
                }).addTo(map4);

                var geojson_5 = L.choropleth(statesData, {

                    // Define what  property in the features to use
                    valueProperty: "trips_100_250",

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
                        layer.bindPopup(`State: ${feature.properties.name} <br> Trips between 100-250 miles:
                        ${feature.properties.trips_100_250}`);
                    }
                }).addTo(map5);

                var geojson_6 = L.choropleth(statesData, {

                    // Define what  property in the features to use
                    valueProperty: "trips_500",

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
                        layer.bindPopup(`State: ${feature.properties.name} <br> Trips above 500 miles:
                        ${feature.properties.trips_500}`);
                    }
                }).addTo(map6);

                // legend.remove(myMap);
                // legend.removeFrom(myMap);
                // myMap.removeControl(legend);
    
                //remove previous element
                // d3.select("div.info legend leaflet-control").remove();
    
                // legend = function() {
                //     if (legend) map.legendControl.removeLegend(legend)
                //     var newLegend = getLegendHTML();
                //     map.legendControl.addLegend(newLegend);
                //     legend = newLegend;
                // }
    
                // if (legend instanceof L.control) { legend.remove(myMap); }
    
                // if (month != "Jan-2019") {
                // document.getElementById("info legend leaflet-control").remove();
                // }
                var legend_1;

                if(legend_1 instanceof L.control){map1.removeControl(legend_1);};
                // Set up the legend
                legend_1 = L.control({ position: "bottomright" });
                legend_1.onAdd = function() {
                    var div = L.DomUtil.create("div", "info legend");
                    var limits = geojson_1.options.limits;
                    var colors = geojson_1.options.colors;
                    var labels = [];

                        // Add min & max
                    var legendInfo_1 = "<h1>Total Trips</h1>" +
                    "<div class=\"labels\">" +
                        "<div class=\"min\">" + limits[0] + "</div>" +
                        "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
                        "</div>";

                    div.innerHTML = legendInfo_1;

                    limits.forEach(function(limit, index) {
                    labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
                        });

                    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
                    return div;
                };
                legend_1.addTo(map1);
                
                var legend_2 = L.control({ position: "bottomright" });
                legend_2.onAdd = function() {
                    var div = L.DomUtil.create("div", "info legend");
                    var limits = geojson_2.options.limits;
                    var colors = geojson_2.options.colors;
                    var labels = [];

                        // Add min & max
                    var legendInfo_2 = "<h1>Pop stay at home</h1>" +
                    "<div class=\"labels\">" +
                        "<div class=\"min\">" + limits[0] + "</div>" +
                        "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
                        "</div>";

                    div.innerHTML = legendInfo_2;

                    limits.forEach(function(limit, index) {
                    labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
                        });

                    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
                    return div;
                };
                legend_2.addTo(map2);

                var legend_3 = L.control({ position: "bottomright" });
                legend_3.onAdd = function() {
                    var div = L.DomUtil.create("div", "info legend");
                    var limits = geojson_3.options.limits;
                    var colors = geojson_3.options.colors;
                    var labels = [];

                        // Add min & max
                    var legendInfo_3 = "<h1>Pop Traveling</h1>" +
                    "<div class=\"labels\">" +
                        "<div class=\"min\">" + limits[0] + "</div>" +
                        "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
                        "</div>";

                    div.innerHTML = legendInfo_3;

                    limits.forEach(function(limit, index) {
                    labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
                        });

                    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
                    return div;
                };
                legend_3.addTo(map3);
                
                var legend_4 = L.control({ position: "bottomright" });
                legend_4.onAdd = function() {
                    var div = L.DomUtil.create("div", "info legend");
                    var limits = geojson_4.options.limits;
                    var colors = geojson_4.options.colors;
                    var labels = [];

                        // Add min & max
                    var legendInfo_4 = "<h1>Trips between 5-10 miles</h1>" +
                    "<div class=\"labels\">" +
                        "<div class=\"min\">" + limits[0] + "</div>" +
                        "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
                        "</div>";

                    div.innerHTML = legendInfo_4;

                    limits.forEach(function(limit, index) {
                    labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
                        });

                    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
                    return div;
                };
                legend_4.addTo(map4);

                var legend_5 = L.control({ position: "bottomright" });
                legend_5.onAdd = function() {
                    var div = L.DomUtil.create("div", "info legend");
                    var limits = geojson_5.options.limits;
                    var colors = geojson_5.options.colors;
                    var labels = [];

                        // Add min & max
                    var legendInfo_5 = "<h1>Trips between 100-250 miles</h1>" +
                    "<div class=\"labels\">" +
                        "<div class=\"min\">" + limits[0] + "</div>" +
                        "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
                        "</div>";

                    div.innerHTML = legendInfo_5;

                    limits.forEach(function(limit, index) {
                    labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
                        });

                    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
                    return div;
                };
                legend_5.addTo(map5);
                
                var legend_6 = L.control({ position: "bottomright" });
                legend_6.onAdd = function() {
                    var div = L.DomUtil.create("div", "info legend");
                    var limits = geojson_6.options.limits;
                    var colors = geojson_6.options.colors;
                    var labels = [];

                        // Add min & max
                    var legendInfo_6 = "<h1>Trips above 500 miles</h1>" +
                    "<div class=\"labels\">" +
                        "<div class=\"min\">" + limits[0] + "</div>" +
                        "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
                        "</div>";

                    div.innerHTML = legendInfo_6;

                    limits.forEach(function(limit, index) {
                    labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
                        });

                    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
                    return div;
                };
                legend_6.addTo(map6);

            // // Adding legend to the map
            // legend.addTo(mapOne);
            // legend.addTo(mapTwo);
        // };
        // console.log(statesData.features[0].properties.name);
    });
    // console.log(filteredinfo[0]);
};

function monthChanged(month) {
    getmonth(month);
};

init();


// initial effor on secound listener

    // Use D3 to select the dropdown menu
    // var dropdownMenu = d3.select("#selDataset-2");
    // Assign the value of the dropdown menu option to a variable
    // var dataset = "total_trips";

    //         // function getmetric(metric) {

    //         switch(dataset) {
    //             case "People staying at Home":
    //                 metricinfo = "People at Home";
    //                 metricData = "no_travel_pop";
    //                 break;

    //             case "People traveling":
    //                 metricinfo = "People traveling";
    //                 metricData = "travel_pop";
    //                 break;

    //             case "Trips 5 to 10 miles":
    //                 metricinfo = "Trip 5-10 miles";
    //                 metricData = "trips_5_10";
    //                 break;

    //             case "Trips 100 to 250":
    //                 metricinfo = "Trip 100-250 miles";
    //                 metricData = "trips_100_250";
    //                 break;

    //             case "Trips above 500":
    //                 metricinfo = "Trip > 500 miles";
    //                 metricData = "trips_500";
    //                 break;

    //             default:
    //                 metricinfo = "Total Trips";
    //                 metricData = "total_trips";
    //                 break;
    //         }

            // var x = document.getElementsByClassName("info legend leaflet-control");
            // x.innerHTML = '';

// function choroplethProp(dataset) {

//     switch(dataset) {
//         case "People staying at Home":
//             return "no_travel_pop";

//         case "People traveling":
//             return "travel_pop";

//         case "Trips 5 to 10 miles":
//             return "trips_5_10";

//         case "Trips 100 to 250":
//             return "trips_100_250";

//         case "Trips above 500":
//             return "trips_500";

//         default:
//             return "total_trips";
//     }
// };


// function metricChanged(metric) {
//     getmetric(metric);
// };


// legend.remove(myMap);
            // legend.removeFrom(myMap);
            // myMap.removeControl(legend);

            //remove previous element
            // d3.select("div.info legend leaflet-control").remove();

            // legend = function() {
            //     if (legend) map.legendControl.removeLegend(legend)
            //     var newLegend = getLegendHTML();
            //     map.legendControl.addLegend(newLegend);
            //     legend = newLegend;
            // }

            // if (legend instanceof L.control) { legend.remove(myMap); }

            // if (month != "Jan-2019") {
            // document.getElementById("info legend leaflet-control").remove();
            // }
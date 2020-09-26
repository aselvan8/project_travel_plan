// @TODO: YOUR CODE HERE!
var svgWidth = 1300;
var svgHeight = 800;

var margin = {
    top: 40,
    right: 40,
    bottom: 70,
    left: 140
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// select the area to insert graph
var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// read data from csv
chart("2019");
function chart(selectedYear) {
    d3.json("http://127.0.0.1:5000/api/v1.0/travel_summary").then(function (jsondata) {
        var travelData = jsondata.filter(d => d.year === selectedYear);

        d3.select("g").html("")
        // Parse data as numbers
        travelData.forEach(function (data) {
            data.travel_pop = +data.travel_pop;
            data.trips_500 = +data.trips_500;
        });
        console.log(travelData);

        // create scales
        var xLinearScale = d3.scaleLinear()
            .domain([d3.min(travelData, d => d.travel_pop)-500000, d3.max(travelData, d => d.travel_pop)])
            .range([0, width]);

        var yLinearScale = d3.scaleLinear()
            .domain([d3.min(travelData, d => d.trips_500)-10000, d3.max(travelData, d => d.trips_500)])
            .range([height, 0]);

        // create axis functions
        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);

        // append axis to chart
        chartGroup.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(bottomAxis);

        chartGroup.append("g")
            .call(leftAxis);

        // create circles
        var circlesGroup = chartGroup.selectAll("circle")
            .data(travelData)
            .enter()
            .append("circle")
            .classed("stateCircle", true)
            .attr("cx", d => xLinearScale(d.travel_pop))
            .attr("cy", d => yLinearScale(d.trips_500))
            .attr("r", d => (d.trips_500 / d.travel_pop) * 3500)
            .attr("opacity",0.7)
            // .attr("r", "20")
            .merge(chartGroup)

        // append state to circles
        chartGroup.append("g")
            .selectAll("text")
            .data(travelData)
            .enter()
            .append("text")
            .classed("stateText", true)
            .attr("x", d => xLinearScale(d.travel_pop))
            .attr("y", d => yLinearScale(d.trips_500))
            .text(function (d) { return d.state_code })



        // Create axes labels
        chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left + 40)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .attr("class", "axisText")
            .text("Trips > 500 miles")
            .classed("active", true);

        chartGroup.append("text")
            .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
            .attr("class", "axisText")
            .text("Population with Travel Records")
            .classed("active", true);

        // Step 1: Append tooltip div
        var toolTip = d3.select("body")
            .append("div")
            .classed("d3-tip", true);

        // Step 2: Create "mouseover" event listener to display tooltip
        circlesGroup.on("mouseover", function (d) {
            var population = (d.trips_500 / d.travel_pop)*100
            toolTip.style("display", "block")
                .html(
                    `<strong>${d.state}</strong>
                     <p>${population}</p>
                     <p>Trips by Population</p>`)
                .style("left", d3.event.pageX + "px")
                .style("top", d3.event.pageY + "px");
        })

            // Step 3: Create "mouseout" event listener to hide tooltip
            .on("mouseout", function () {
                toolTip.style("display", "none");
            });



    })
        // catch errors
        .catch(function (error) {
            console.log(error);
        });
};
// update drop down menu
function updateDropDown() {

    var years = ["2019", "2020"]
    // d3.json("http://127.0.0.1:5000/api/v1.0/travel_summary").then(function (jsondata) {
    var dropdownmenu = d3.select("#selDataset");
    // console.log('dropdown', jsondata);

    for (var i = 0; i < years.length; i++) {
        dropdownmenu
            .append("option")
            .text(years[i])
            .property("value", years[i]);

    };
    // });

};
updateDropDown();

// get value when drop down value is changed by user

function optionChanged(selectedYear) {
    // run this code whendropdown changes
    console.log(`option changed for ${selectedYear}`)

    // get data for selected option
    chart(selectedYear);
    // buildTable(selectedYear);
};

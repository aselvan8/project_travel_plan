month_year = "http://127.0.0.1:5000/api/v1.0/month_year"

travel_trips = "http://127.0.0.1:5000/api/v1.0/travel_trips"

csvPath = "../data/travel_data.csv"

function unpack(rows, index){
  return rows.map(function (row) {
    return row[index];
  });
}

function buildPlot(){
  d3.json(travel_trips, function(data){
      console.log(data);

      var notHome = data.pop_not_stay_at_home.map(row => row[2]);
      console.log(notHome);

    });
  }

    
      
//       var monthYear = data.month_year;
    
//     console.log(data);
    
//   var trace1 = {
//     x: monthYear,
//     y: home,
//     name: 'Staying Home',
//     autobinx: false, 
//     histnorm: "count", 
//     marker: {
//       color: "rgba(255, 100, 102, 0.7)", 
//       line: {
//         color:  "rgba(255, 100, 102, 1)", 
//         width: 1
//       }
//     },  
//     opacity: 0.5, 
//     type: "histogram" 
//   };
//   var trace2 = {
//     x: monthYear,
//     y: notHome, 
//     autobinx: false, 
//     marker: {
//             color: "rgba(100, 200, 102, 0.7)",
//             line: {
//               color:  "rgba(100, 200, 102, 1)", 
//               width: 1
//       } 
//         }, 
//     name: "Not Staying At Home", 
//     opacity: 0.75, 
//     type: "histogram"
//   };
//   var data = [trace1, trace2];
//   var layout = {
//     bargap: 0.05, 
//     bargroupgap: 0.2, 
//     barmode: "overlay", 
//     title: "Stay at Home VS Not Staying at Home (2019-2020)", 
//     xaxis: {title: "Date (Month/Year)"}, 
//     yaxis: {title: "Population"}
//   };
//   Plotly.newPlot('plot', data, layout);
//   })
// }

buildPlot();
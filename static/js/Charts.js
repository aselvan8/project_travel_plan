var trip_total = 0
d3.json("http://127.0.0.1:5000/api/v1.0/travel_trips", async (data) => {
    console.log(data);
    let data_object = await populate(data);
    let data_2019_array = await updateArray(data_object.data_2019);
    let data_2020_array = await updateArray(data_object.data_2020);
    let trips_10_25_2019_array = await updateArray(data_object.trips_10_25_2019);
    let trips_10_25_2020_array = await updateArray(data_object.trips_10_25_2020);
    let trips_50_100_2019_array = await updateArray(data_object.trips_50_100_2019);
    let trips_50_100_2020_array = await updateArray(data_object.trips_50_100_2020);
    let trips_250_500_2019_array = await updateArray(data_object.trips_250_500_2019);
    let trips_250_500_2020_array = await updateArray(data_object.trips_250_500_2020);
    // console.log(data_2019_array);


    var ctx = document.getElementById('myChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            datasets: [
                {
                    data: data_2019_array,
                    label: "2019",
                    fill: false,
                    backgroundColor: 'green',
                    borderColor: 'blue',
                    borderWidth: 1
                },

                {
                    data: data_2020_array,
                    label: "2020",
                    fill: false,
                    backgroundColor: 'black',
                    borderColor: 'red',
                    borderWidth: 1
                }
            ]
        },

        options: {
            title: {
                display: true,
                text: 'Total Trips'
            },
            scales: {
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: '# of Trips',
                        fontStyle: 'bold',
                }
            }],
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Month',
                        fontStyle: 'bold',
                        },
                    ticks: {
                        beginAtZero: true
                     }
            }]
        }
    
    }
})



    var ctx_2 = document.getElementById('myChart_2').getContext('2d');
    var myChart = new Chart(ctx_2, {
        type: 'line',
        data: {
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            datasets: [
                {
                    data: trips_10_25_2019_array,
                    label: "2019",
                    fill: false,
                    backgroundColor: 'green',
                    borderColor: 'blue',
                    borderWidth: 1
            },

            {
                data: trips_10_25_2020_array,
                label: "2020",
                fill: false,
                backgroundColor: 'black',
                borderColor: 'red',
                borderWidth: 1
            }
        ]
    },

    options: {
        title: {
            display: true,
            text: 'Trips Within 10 to 25 Miles'
        },
        scales: {
            yAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: '# of Trips',
                    fontStyle: 'bold',
            }
        }],
            xAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'Month',
                    fontStyle: 'bold',
                    },
                ticks: {
                    beginAtZero: true
                 }
        }]
    }
}

});

    var ctx_3 = document.getElementById('myChart_3').getContext('2d');
    var myChart = new Chart(ctx_3, {
        type: 'line',
        data: {
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            datasets: [
                {
                    data: trips_50_100_2019_array,
                    label: "2019",
                    fill: false,
                    backgroundColor: 'green',
                    borderColor: 'blue',
                    borderWidth: 1
                },

                {
                    data: trips_50_100_2020_array,
                    label: "2020",
                    fill: false,
                    backgroundColor: 'black',
                    borderColor: 'red',
                    borderWidth: 1
                 }
            ]       
        },

        options: {
            title: {
                display: true,
                text: 'Trips Within 50 to 100 Miles'
            },
            scales: {
                yAxes: [{
                scaleLabel: {
                display: true,
                labelString: '# of Trips',
                fontStyle: 'bold',
            }
         }],
            xAxes: [{
            scaleLabel: {
                display: true,
                labelString: 'Month',
                fontStyle: 'bold'
                },
            ticks: {
                beginAtZero: true
             }
    }]
}
}

});

    var ctx_4 = document.getElementById('myChart_4').getContext('2d');
    var myChart = new Chart(ctx_4, {
        type: 'line',
        data: {
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            datasets: [
                {
                    data: trips_250_500_2019_array,
                    label: "2019",
                    fill: false,
                    backgroundColor: 'green',
                    borderColor: 'blue',
                    borderWidth: 1
            },

                {
                    data: trips_250_500_2020_array,
                    label: "2020",
                    fill: false,
                    backgroundColor: 'black',
                    borderColor: 'red',
                    borderWidth: 1
                 }
            ]             
        },

        options: {
            title: {
                display: true,
                text: 'Trips Within 250 to 500 Miles'
            },
            scales: {
                yAxes: [{
                scaleLabel: {
                display: true,
                labelString: '# of Trips',
                fontStyle: 'bold'
            }
        }],
                xAxes: [{
                scaleLabel: {
                display: true,
                labelString: 'Month',
                fontStyle: 'bold'
            },
            ticks: {
                beginAtZero: true
         }
}]
}
}

});


});

async function updateArray(object_map) {
    let array = [];
    for (let i = 1; i <= object_map.size; i++) {
        array.push(object_map.get("" + i));
    }
    return array;
}

// populate(data, "1-5")
     // if (type === "1-5")
        // 

async function populate(data, type) {
    return new Promise((resolve, reject) => {
        let data_object = {
            data_2019: new Map(),
            data_2020: new Map(),
            trips_10_25_2019: new Map(),
            trips_10_25_2020: new Map(),
            trips_50_100_2019: new Map(),
            trips_50_100_2020: new Map(),
            trips_250_500_2019: new Map(),
            trips_250_500_2020: new Map(),

        }
        data.forEach(function (object) {
            let data_2019 = data_object.data_2019;
            let data_2020 = data_object.data_2020;
            let year = object.year;
            let month = object.month;
            if (year === "2019") {
                if (!data_2019.has(month)) {
                    data_2019.set(month, object.total_trips);
                } else {
                    let new_current_total_trips = data_2019.get(month) + object.total_trips;
                    data_2019.set(month, new_current_total_trips);
                }           
            } else { // 2020
                if (!data_2020.has(month)) {
                    data_2020.set(month, object.total_trips);
                } else {
                    let new_current_total_trips = data_2020.get(month) + object.total_trips;
                    data_2020.set(month, new_current_total_trips);
                }
            }
        });

        data.forEach(function (object) {
            let trips_10_25_2019 = data_object.trips_10_25_2019;
            let trips_10_25_2020 = data_object.trips_10_25_2020;
            let year = object.year;
            let month = object.month;
            if (year === "2019") {
                if (!trips_10_25_2019.has(month)) {
                    trips_10_25_2019.set(month, object.trips_10_25);
                } else {
                    let trips_10_25 = trips_10_25_2019.get(month) + object.trips_10_25;
                    trips_10_25_2019.set(month, trips_10_25);
                }
            } else { // 2020
                if (!trips_10_25_2020.has(month)) {
                    trips_10_25_2020.set(month, object.trips_10_25);
                } else {
                    let trips_10_25 = trips_10_25_2020.get(month) + object.trips_10_25;
                    trips_10_25_2020.set(month, trips_10_25);
                }
            }
        });

        data.forEach(function (object) {
            let trips_50_100_2019 = data_object.trips_50_100_2019;
            let trips_50_100_2020 = data_object.trips_50_100_2020;
            let year = object.year;
            let month = object.month;
            if (year === "2019") {
                if (!trips_50_100_2019.has(month)) {
                    trips_50_100_2019.set(month, object.trips_50_100);
                } else {
                    let trips_50_100 = trips_50_100_2019.get(month) + object.trips_50_100;
                    trips_50_100_2019.set(month, trips_50_100);
                }
            } else { // 2020
                if (!trips_50_100_2020.has(month)) {
                    trips_50_100_2020.set(month, object.trips_50_100);
                } else {
                    let trips_50_100 = trips_50_100_2020.get(month) + object.trips_50_100;
                    trips_50_100_2020.set(month, trips_50_100);
                }
            }
        });

        data.forEach(function (object) {
            let trips_250_500_2019 = data_object.trips_250_500_2019;
            let trips_250_500_2020 = data_object.trips_250_500_2020;
            let year = object.year;
            let month = object.month;
            if (year === "2019") {
                if (!trips_250_500_2019.has(month)) {
                    trips_250_500_2019.set(month, object.trips_250_500);
                } else {
                    let trips_250_500 = trips_250_500_2019.get(month) + object.trips_250_500;
                    trips_250_500_2019.set(month, trips_250_500);
                }
            } else { // 2020
                if (!trips_250_500_2020.has(month)) {
                    trips_250_500_2020.set(month, object.trips_250_500);
                } else {
                    let trips_250_500 = trips_250_500_2020.get(month) + object.trips_250_500;
                    trips_250_500_2020.set(month, trips_250_500);
                }
            }
        });

        resolve(data_object)
    });
}

//     if(year.year === "2019") {
//     trip_total += year.total_trips;
// console.log(trip_total);
// for(var i=0; i>data.length; i++) {
//     if(data[i].year === "2019") {
//         var trips_2019 = data[i].total_trips
//         console.log(trips_2019);
//     }
// } 


//     function data(total) {
//         var total_trips_2019 = total.map(function(e) {
//             if(e.year === "2019") {
//             return e.total_trips;
//             }
//     })
//         var total_trips_2020 = total.map(function(e) {
//             if(e.year === "2020") {
//             return e.total_trips;
//         }
//         var months = total.map(function(e) {
//             return e.month_abbr
//         })
//         console.log(total_trips_2019);
//         console.log(total_trips_2020);
//         console.log(months);
// })

// trips = data_2019["trips"]
// month = data_2019["month_abbr"]
// jan_sum = 0
// feb_sum = 0
// mar_sum = 0
// apr_sum = 0
// may_sum = 0
// jun_sum = 0
// jul_sum = 0
// aug_sum = 0
// sep_sum = 0

// total_trips = []                             
// trips_5_10 = []                
// trips_10_25 = []              
// trips_25_50 = []               
// trips_50_100 = []                     
// trips_250_500 = []            
// trips_500 = []              

// for index, row in data_2019.iterrows():

//     try:
//         if(row['month_abbr'] == "Jan"):
//             jan_sum+=row['trips']
//         elif(row['month_abbr'] == "Feb"):
//             feb_sum+=row['trips']
//         elif(row['month_abbr'] == "Mar"):
//             mar_sum+=row['trips']
//         elif(row['month_abbr'] == "Apr"):
//             apr_sum+=row['trips']
//         elif(row['month_abbr'] == "May"):
//             may_sum+=row['trips']
//         elif(row['month_abbr'] == "Jun"):
//             jun_sum+=row['trips']
//         elif(row['month_abbr'] == "Jul"):
//             jul_sum+=row['trips']
//         elif(row['month_abbr'] == "Aug"):
//             aug_sum+=row['trips']
//         elif(row['month_abbr'] == "Sep"):
//             sep_sum+=row['trips']




// function data(travel) {
//     var months = travel.map(function(e) {
//         return e.Months;
//     });
//     var trips_2019 = travel.map(function(e) {
//         return e.Total_trips_2019;
//     });
//     var trips_2020 = travel.map(function(e) {
//         return e.Total_trips_2020;
//     });


// var ctx = document.getElementById('myChart').getContext('2d');
// var myChart = new Chart(ctx, {
//     type: 'line',
//     data: {
//         labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
//         datasets: [
//             {
//                 data: data_2019_array,
//                 label: "2019",
//                 fill: false,
//                 backgroundColor: 'rgba(255, 99, 132, 0.2)',
//                 borderColor: 'blue',
//                 borderWidth: 1
//             },

//             {
//                 data: data_2020_array,
//                 label: "2020",
//                 fill: false,
//                 backgroundColor: 'rgba(255, 99, 132, 0.2)',
//                 borderColor: 'red',
//                 borderWidth: 1
//             }
//         ]
//     },

//     options: {
//         scales: {
//             yAxes: [{
//                 ticks: {
//                     beginAtZero: true
//                 }
//             }]
//         }
//     }

// });

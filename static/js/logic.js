
/*
d3.json("http://127.0.0.1:5000/api/v1.0/travel_summary", function(error, data) {
    if (error) throw error;
    console.log(data);
  });
/*
d3.json("http://127.0.0.1:5000/api/v1.0/travel_summary").then(function(data) {
    console.log(data);
});
*/
// from flask import url_for
// url_for('static', filename='service_status.json')


d3.json("http://127.0.0.1:5000/api/v1.0/month_year", function(data) {
    console.log(data);
  });

# import libraries
import numpy as np
import datetime as dt
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
from config_db import password_db
from flask import Flask, jsonify
import pandas as pd
import json

# call database
# engine = create_engine("sqlite:///Resources/hawaii.sqlite")

connection_string = 'postgres:'+password_db+'@localhost:5432/travel_data'

engine=create_engine(f"postgresql://{connection_string}")

# reflect an existing database into a new model
Base = automap_base()

# reflect the tables
Base.prepare(engine, reflect = True)

# Save references to each table
travel_details = Base.classes.travel_data_details()

Travel_Details = Base.classes.travel_data_details
Travel_Details.__dict__




# no_travel

# Setup Flask
app = Flask(__name__)

# Flask routes
# main page
@app.route("/")
def home():
    """List all available api routes."""
    return (
        f"Available Routes:<br/>"
        f"/api/v1.0/notravel<br/>"
        f"/api/v1.0/geomap<br/>"
        f"/api/v1.0/test<br/>"
        f"/api/v1.0/test2<br/>"
        f"/api/v1.0/'start_date'<br/>"
        f"/api/v1.0/'start_date'/'end_date'<br/>"
        )
# # this is to call the index.html - place it when html is ready
# def home():
#     mars_data = mongo.db.collection.find_one()
#     return render_template('index.html',mars_info = mars_data)


# precipitation
@app.route("/api/v1.0/notravel")
def notravel():
    session = Session(engine)


    no_travel = session.query(Travel_Details.year, Travel_Details.month, Travel_Details.state,func.avg(Travel_Details.pop_stay_at_home)).\
    group_by(Travel_Details.year, Travel_Details.month,Travel_Details.state).\
    order_by(Travel_Details.year, Travel_Details.state,Travel_Details.month).all()
   
    # no_travel = [(int(travel_tuple[0]), int(travel_tuple[1]), travel_tuple[2], round(float(travel_tuple[3]))) for travel_tuple in no_travel]
    no_travel = [(int(no_travel_tuple[0]), int(no_travel_tuple[1]), no_travel_tuple[2], round(float(no_travel_tuple[3])))\
             for no_travel_tuple in no_travel]
    session.close()

    # no_travel = list(np.ravel(prec_data))

    return jsonify(no_travel)


# stations available
@app.route("/api/v1.0/geomap")
def geomap():
    session=Session(engine)
    # query station data
    geomap_travel = session.query(Travel_Details.year, Travel_Details.month, Travel_Details.state, Travel_Details.latitude,\
                              Travel_Details.longitude, func.avg(Travel_Details.pop_not_stay_at_home)).\
                              group_by(Travel_Details.year, Travel_Details.month,Travel_Details.state, \
                              Travel_Details.latitude, Travel_Details.longitude).\
                              order_by(Travel_Details.year, Travel_Details.state,Travel_Details.month, \
                              Travel_Details.latitude, Travel_Details.longitude).all()
    geomap_travel = [(int(gp_travel_tuple[0]), int(gp_travel_tuple[1]), gp_travel_tuple[2], gp_travel_tuple[3], \
                  gp_travel_tuple[4], round(float(gp_travel_tuple[5]))) for gp_travel_tuple in geomap_travel]
    session.close()

    # all_stations = list(np.ravel(stations_data))

    return jsonify(geomap_travel)


@app.route("/api/v1.0/test")
def test():
    connection = engine.connect()
    test_travel_df = pd.read_sql("""select year, month, month_abbr, month_year, state, 
        round(avg(pop_stay_at_home),0) as no_travel_pop, round(avg(pop_not_stay_at_home),0) as travel_pop, 
        round(avg(trips),0) as total_trips, round(avg(trips_1),0) as trips_1, round(avg(trips_1_3),0) as trips_1_3,
        round(avg(trips_3_5),0) as trips_3_5, round(avg(trips_5_10),0) as trips_5_10, round(avg(trips_10_25),0) as trips_10_25,
        round(avg(trips_25_50),0) as trips_25_50, round(avg(trips_50_100),0) as trips_50_100,
        round(avg(trips_100_250),0) as trips_100_250, round(avg(trips_250_500),0) as trips_250_500,
        round(avg(trips_500),0) as trips_500 from travel_data_details 
        GROUP BY state, month_year, year, month, month_abbr
        order by state, year, month, month_year, month_abbr """, connection)
    test_travel_json1 = json.dumps(test_travel_df.to_dict('records'))
    # session.close()

    return test_travel_json1

@app.route("/api/v1.0/test2")
def test2():
    connection = engine.connect()
    test_travel_df = pd.read_sql('select year, month, state, round(avg(pop_stay_at_home),0) as no_travel_pop from travel_data_details GROUP BY year, month, state', connection)
    test_travel_json = test_travel_df.to_json()
    # session.close()

    return test_travel_json




# # temperature observation
# @app.route("/api/v1.0/tobs")
# def tobs():
#     session=Session(engine)

#     # Calculate the date 1 year ago from the last data point in the database
#     count_station = session.query(Measurement.station,(func.count(Measurement.station))).\
#     group_by(Measurement.station).order_by(func.count(Measurement.station).desc()).all()
    
#     # unpack tuple
#     unpack = [station for station,count in count_station]
    
#     # get the most active station
#     most_active_station = unpack[0]
    
#     # find the last date available in dataset for the most active station
#     last_date = session.query(Measurement.date).\
#     filter(Measurement.station==most_active_station).\
#     order_by(Measurement.date.desc()).first() 

#     # get date to format and calculate last year
#     dateparts = last_date[0].split('-')
#     previousyear = dt.date(int(dateparts[0]),int(dateparts[1]),int(dateparts[2]))- dt.timedelta(days=365)

#     # find temperature list for previous year for the most active station
#     tobs_data = session.query(Measurement.date,Measurement.tobs).\
#     filter(Measurement.date > previousyear).\
#     filter(Measurement.station==most_active_station).\
#     order_by(Measurement.date.desc()).all()

#     session.close()

#     all_tobs = list(np.ravel(tobs_data))

#     return jsonify(all_tobs)

# # get MIN,AVG,MAX greater and equal to start date
# @app.route("/api/v1.0/<start_date>")
# def start(start_date):
#     """Data displayed as MIN, AVG, MAX temperatures"""
#     session=Session(engine)

#     # get data based on start date entered
#     start_data = session.query(func.min(Measurement.tobs),\
#     func.avg(Measurement.tobs),func.max(Measurement.tobs)).\
#     filter(Measurement.date>=start_date).all()
     
#     session.close()

#     result = list(np.ravel(start_data))

#     return jsonify(result)


# # get MIN,AVG,MAX between start date and end date, inclusive
# @app.route("/api/v1.0/<start_date>/<end_date>")
# def startend(start_date,end_date):
#     """Data displayed as MIN, AVG, MAX temperatures for the interval"""
#     session=Session(engine)

#     # get data based on interval dates entered
#     start_end_data = session.query(func.min(Measurement.tobs),\
#     func.avg(Measurement.tobs),func.max(Measurement.tobs)).\
#     filter(Measurement.date>=start_date).\
#     filter(Measurement.date<=end_date).all()
     
#     session.close()

#     result1 = list(np.ravel(start_end_data))

#     return jsonify(result1)
   

if __name__ == '__main__':
    app.run(debug=True)
# import libraries
import numpy as np
import datetime as dt
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
from config_db import password_db
from flask import Flask, jsonify, render_template, redirect
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

# verify table content
Travel_Details = Base.classes.travel_data_details
Travel_Details.__dict__

# Setup Flask
app = Flask(__name__)

# Flask routes
# main page
@app.route("/")
def home():
    # """List all available api routes."""
    # return (
    #     f"Available Routes:<br/>"
    #     f"/api/v1.0/month_year<br/>" #to be retired
    #     f"/api/v1.0/geomap<br/>" #to be retired
    #     f"/api/v1.0/travel_trips<br/>"
    #     f"/api/v1.0/travel_summary<br/>"

    #     )


# # this is to call the index.html - place it when html is ready
# def home():
#     mars_data = mongo.db.collection.find_one()
    return render_template('index.html')


# precipitation
@app.route("/api/v1.0/month_year")
def monthyear():
    # session = Session(engine)

    connection = engine.connect()
    travel_months_df = pd.read_sql("""select distinct(month_year), year, month from travel_data_details""", connection)
    travel_months_df['month'] = travel_months_df['month'].astype('int')
    travel_months_df.sort_values (by= ['year','month'], inplace=True, ascending=False) 
    travel_months_json = json.dumps(travel_months_df.to_dict('records'))
    # session.close()

    # no_travel = list(np.ravel(prec_data))

    return jsonify(travel_months_json)


# stations available
@app.route("/api/v1.0/geomap")
def geomap():
    # session=Session(engine)
    # query station data
    connection = engine.connect()
    travel_geomap_df = pd.read_sql("""select year, month, month_abbr, month_year, state, 
        round(avg(pop_stay_at_home),0) as no_travel_pop, round(avg(pop_not_stay_at_home),0) as travel_pop, 
        round(avg(trips),0) as total_trips, round(avg(trips_5_10),0) as trips_5_10, 
        round(avg(trips_100_250),0) as trips_100_250, round(avg(trips_500),0) as trips_500 from travel_data_details 
        GROUP BY state, month_year, year, month, month_abbr
        order by state, year, month, month_year, month_abbr """, connection)

    travel_geomap_df['no_travel_pop'] = travel_geomap_df['no_travel_pop'].astype('int')
    travel_geomap_df['travel_pop'] = travel_geomap_df['travel_pop'].astype('int')
    travel_geomap_df['total_trips'] = travel_geomap_df['total_trips'].astype('int')
    travel_geomap_df['trips_5_10'] = travel_geomap_df['trips_5_10'].astype('int')
    travel_geomap_df['trips_100_250'] = travel_geomap_df['trips_100_250'].astype('int')
    travel_geomap_df['trips_500'] = travel_geomap_df['trips_500'].astype('int')

    travel_geomap_json = json.dumps(travel_geomap_df.to_dict('records'))
    # session.close()

    # all_stations = list(np.ravel(stations_data))

    return jsonify(travel_geomap_json)


@app.route("/api/v1.0/travel_trips")
def traveltrips():
    connection = engine.connect()
    travel_trips_df = pd.read_sql("""select year, month, month_abbr, month_year, state, 
        round(avg(pop_stay_at_home),0) as no_travel_pop, round(avg(pop_not_stay_at_home),0) as travel_pop, 
        round(avg(trips),0) as total_trips, round(avg(trips_1),0) as trips_1, round(avg(trips_1_3),0) as trips_1_3,
        round(avg(trips_3_5),0) as trips_3_5, round(avg(trips_5_10),0) as trips_5_10, round(avg(trips_10_25),0) as trips_10_25,
        round(avg(trips_25_50),0) as trips_25_50, round(avg(trips_50_100),0) as trips_50_100,
        round(avg(trips_100_250),0) as trips_100_250, round(avg(trips_250_500),0) as trips_250_500,
        round(avg(trips_500),0) as trips_500 from travel_data_details 
        GROUP BY state, month_year, year, month, month_abbr
        order by state, year, month, month_year, month_abbr """, connection)

    travel_trips_df['no_travel_pop'] = travel_trips_df['no_travel_pop'].astype('int')
    travel_trips_df['travel_pop'] = travel_trips_df['travel_pop'].astype('int')
    travel_trips_df['total_trips'] = travel_trips_df['total_trips'].astype('int')
    travel_trips_df['trips_1'] = travel_trips_df['trips_1'].astype('int')
    travel_trips_df['trips_1_3'] = travel_trips_df['trips_1_3'].astype('int')
    travel_trips_df['trips_3_5'] = travel_trips_df['trips_3_5'].astype('int')
    travel_trips_df['trips_5_10'] = travel_trips_df['trips_5_10'].astype('int')
    travel_trips_df['trips_10_25'] = travel_trips_df['trips_10_25'].astype('int')
    travel_trips_df['trips_25_50'] = travel_trips_df['trips_25_50'].astype('int')
    travel_trips_df['trips_50_100'] = travel_trips_df['trips_50_100'].astype('int')
    travel_trips_df['trips_100_250'] = travel_trips_df['trips_100_250'].astype('int')
    travel_trips_df['trips_250_500'] = travel_trips_df['trips_250_500'].astype('int')
    travel_trips_df['trips_500'] = travel_trips_df['trips_500'].astype('int')


    travel_detail_json = json.dumps(travel_trips_df.to_dict('records'))
    # session.close()

    return travel_detail_json

@app.route("/api/v1.0/travel_summary")
def travelsummary():
    connection = engine.connect()
    travel_summary_df = pd.read_sql("""select year, month, month_abbr, month_year, state, latitude, longitude,
        round(avg(pop_stay_at_home),0) as no_travel_pop, round(avg(pop_not_stay_at_home),0) as travel_pop from travel_data_details 
        GROUP BY state, month_year, year, month, month_abbr, latitude, longitude
        order by state, year, month, month_year, month_abbr """, connection)

    travel_summary_df['no_travel_pop'] = travel_summary_df['no_travel_pop'].astype('int')
    travel_summary_df['travel_pop'] = travel_summary_df['travel_pop'].astype('int')

    travel_summary_json = json.dumps(travel_summary_df.to_dict('records'))
    # session.close()

    return travel_summary_json



if __name__ == '__main__':
    app.run(debug=True)
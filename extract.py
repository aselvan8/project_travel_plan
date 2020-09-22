import json
import requests
import pandas as pd
from pprint import pprint
from sodapy import Socrata
from config import SODAPY_APPTOKEN
from config_db import password_db
import os
import datetime as dt
from sqlalchemy import create_engine

def scrape ():

    # Unauthenticated client only works with public data sets. Note 'None'
    # in place of application token, and no username or password:
    client = Socrata("data.bts.gov",
                    SODAPY_APPTOKEN) #add your API token here

    # Example authenticated client (needed for non-public datasets):
    # client = Socrata(data.bts.gov,
    #                  MyAppToken,
    #                  userame="user@example.com",
    #                  password="AFakePassword")

    # First 2000 results, returned as JSON from API / converted to Python list of
    # dictionaries by sodapy.
    results = client.get("w96p-f2qv", Level = "State", limit=100000)

    # Convert to pandas DataFrame
    results_df = pd.DataFrame.from_records(results)
    results_df

    # sort dates to analyze
    results_date_sort = results_df.sort_values('date')
    results_date_sort

    # derive date into year/month/day columns
    results_date_sort['year'] = pd.DatetimeIndex(results_date_sort['date']).year
    results_date_sort['month'] = pd.DatetimeIndex(results_date_sort['date']).month
    results_date_sort['day'] = pd.DatetimeIndex(results_date_sort['date']).day

    results_date_sort

    # copy dataset into new dataset
    results_convert = results_date_sort

    # convert datatypes
    results_convert['level'] = results_date_sort['level'].astype('str')
    results_convert['date'] = results_date_sort['date'].astype('str')
    results_convert['state_fips'] = results_date_sort['state_fips'].astype('int')
    results_convert['state_code'] = results_date_sort['state_code'].astype('str')
    results_convert['pop_stay_at_home'] = results_date_sort['pop_stay_at_home'].astype('float').astype('int')
    results_convert['pop_not_stay_at_home'] = results_date_sort['pop_not_stay_at_home'].astype('float').astype('int')
    results_convert['trips'] = results_date_sort['trips'].astype('float').astype('int')
    results_convert['trips_1'] = results_date_sort['trips_1'].astype('float').astype('int')
    results_convert['trips_1_3'] = results_date_sort['trips_1_3'].astype('float').astype('int')
    results_convert['trips_3_5'] = results_date_sort['trips_3_5'].astype('float').astype('int')
    results_convert['trips_5_10'] = results_date_sort['trips_5_10'].astype('float').astype('int')
    results_convert['trips_10_25'] = results_date_sort['trips_10_25'].astype('float').astype('int')
    results_convert['trips_25_50'] = results_date_sort['trips_25_50'].astype('float').astype('int')
    results_convert['trips_50_100'] = results_date_sort['trips_50_100'].astype('float').astype('int')
    results_convert['trips_100_250'] = results_date_sort['trips_100_250'].astype('float').astype('int')
    results_convert['trips_250_500'] = results_date_sort['trips_250_500'].astype('float').astype('int')
    results_convert['trips_500'] = results_date_sort['trips_500'].astype('float').astype('int')
    results_convert['year'] = results_date_sort['year'].astype('str')
    results_convert['month'] = results_date_sort['month'].astype('str')
    results_convert['day'] = results_date_sort['day'].astype('str')

    results_convert

    # webscrape coordinates for geomapping
    url_coord = 'https://inkplant.com/code/state-latitudes-longitudes'
    table_coord = pd.read_html(url_coord)
    table_coord


    # get datascrapped into dataframe
    df_coord = table_coord[0]
    df_coord['Latitude'] = round(df_coord['Latitude'],6)
    df_coord['Longitude'] = round(df_coord['Longitude'],6)

    df_coord.head()

    # webscrape State short code in order to join with transactional data
    url_states ='https://www.factmonster.com/us/postal-information/state-abbreviations-and-state-postal-codes'
    table_state = pd.read_html(url_states)
    table_state

    # convert state dataset into dataframe
    df_state = table_state[0]
    df_state.head()

    # drop Abbreviation column
    df_state = df_state.drop(['Abbreviation'],axis=1)
    df_state.head()

    # merge state dataset and coordinates dataset
    merged_state = pd.merge(df_coord,df_state, how = 'inner', on='State')
    merged_state

    # rename columns prior to join to transactional data
    merged_state = merged_state.rename(columns={'Postalcode':'state_code','State':'state','Latitude':'latitude',
                                                'Longitude':'longitude'})
    merged_state

    # merge state/coordinates dataset with transactional data
    merged_travel = pd.merge(results_convert,merged_state, how = 'left', on='state_code')
    merged_travel

    # drop nan values
    merged_travel.dropna(axis=0, how='any', inplace=True)
    merged_travel

    # drop time out of data values
    merged_travel['date']= merged_travel['date'].str.split('T', n = 1, expand = True)
    merged_travel

    # drop level column
    merged_travel = merged_travel.drop(['level'],axis=1)
    merged_travel

    # create dataset for initial validation and testing
    merged_travel.to_csv('data/travel_data.csv')

    # verify datatypes prior to drop data into database
    merged_travel.dtypes

    # create connection string to postgres
    connection_string = 'postgres:'+password_db+'@localhost:5432/travel_data'

    engine=create_engine(f"postgresql://{connection_string}")

    # verify table created in database
    engine.table_names()

    # push data into table already created in pgadmin
    merged_travel.to_sql(name='travel_data_details', con=engine, if_exists='append', index=True)


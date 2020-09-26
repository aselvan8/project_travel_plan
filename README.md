# project_travel_plan

Our mission is to understand how the current events of pandemic affected the travel patterns in the US. 
Since the pandemic has hit the country starting in 2020, we’ve collected data from prior year up to today in order to find correlations and identify if such occurrence has affected traveling behaviors. With the data collected from the Bureau of Transportations Statistics, we analyzed a range of KPIs such as Number of Trips, Number of Trips by Distance, Population with Active Trips, and Population without Travel.
As a result, we’ve created visualizations that enhances the user’s understanding of short and long-distance trips, elaborated graphs based on all travels independent of type of transportation throughout the timeline and demonstrate how this major event impacted the way Americans’ travel behaviors.

## Instructions

- Run command "pip install sodapy" on your python instance

- Nagivate to the link below and in section "App Tokens", click on the button "Sign up for an app Token!"
https://dev.socrata.com/foundry/data.bts.gov/w96p-f2qv

- On the following screen, click on "Sign up" and enter your information as follow:
* email address:
* Name
* password, and confirm your password
* Accept the license agreement

- Next, under App Tokens section, click on "Create New App Token"
* When the window pops up, fill the information requested such as:
* application name
* description
* Save it

- Note: you can use the link below to review and retrieve the token
https://data.bts.gov/profile/edit/developer_settings

- Once saved the form, your APP Token will be created. Copy the token generated and follow below steps.

### Jupyter Notebook
create the following files for data extraction:
- config.py >> create this file and place it under python_code folder
sample code in file:
SODAPY_APPTOKEN= "API KEY HERE -- this is APP Token created above"

- config_db.py >> create this file and place it under /python_code folder, and under the root folder where app.py resides
sample code in file
password_db = "POSTGRES DATABASE PASSWORD HERE -- this is your own database password"

### PostgresSQL Database
- create a new database called "travel_data"
- run the travel_data_sql.sql script from folder /db_script from the "travel_data" database created above in Postgres (PG Admin was used for this project)

### Exception note for retrieving data using Flask and Live Server (CHROME)

In order to run this application, please make sure to install an extension or similar solution which will bypass the CORS verification when launching data from Flask in combination with Live Server. Below is an extension from Chrome that we used:
https://chrome.google.com/webstore/detail/moesif-origin-cors-change/digfbfaphojjndkpccljibejjbppifbc?hl=en-US

Please install this extension and turn it ON.

### Java Script

- Register for a MapBox token in order to retrive the GeoMap. Here's the link to register and obtain a token.
https://account.mapbox.com/access-tokens/

- Once the token is created, navigate /static/js and create a config.js file and add the following to the file:
Sample code:
* var API_KEY = "ADD YOUR TOKEN HERE"

### Application
- make sure the Postgres PGAdmin  is running
- make sure the Chrome extension installed above is turned ON
- from Visual Studio, source activate PythonData then go to root directory and run app.py
- once app.py is launched, navigate to the folder templates/index.html and start the Live server
- step above will launch your browser and go to localhost or typically (http://127.0.0.1:5000/) to navigate through the website and visualizations
 


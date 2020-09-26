# project_travel_plan

- Run command "pip install sodapy" on your python instance

Nagivate to the link below and in section "App Tokens", click on the button "Sign up for an app Token!"
https://dev.socrata.com/foundry/data.bts.gov/w96p-f2qv

On the following screen, click on "Sign up" and enter your information as follow:
-email address:
-Name
-password, and confirm your password

Accept the license agreement

Next, under App Tokens section, click on "Create New App Token"
When the window pops up, fill the information requested such as:
-application name
-description

Save it

-Note: you can use the link below to review and retrieve the token
https://data.bts.gov/profile/edit/developer_settings

Once saved the form, your APP Token will be created. Copy the token generated and follow below steps.


## Jupyter Notebook
create the following files for data extraction:
- config.py >> create this file and place it under python_code folder
sample code in file:
SODAPY_APPTOKEN= "API KEY HERE -- this is APP Token created above"

- config_db.py >> create this file and place it under python_code folder, and under the root folder where app.py resides
sample code in file
password_db = "POSTGRES DATABASE PASSWORD HERE -- this is your own database password"

## PostgresSQL Database
- create a new database called "travel_data"
- run the travel_data_sql.sql script from folder "db_script" from the "travel_data" database created above in Postgres (PG Admin was used for this project)

## Application
- make sure the PGAdmin Postgres is running
- go to root directory and run app.py (activate the PythonData beforehand), and it run using Python
- once app.py is launched, navigate to the folder templates/index.html and start the Live server
- Step above will launch your browser and go to localhost or typically (http://127.0.0.1:5000/) to navigate through the website and visualizations

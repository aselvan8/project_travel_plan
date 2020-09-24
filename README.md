# project_travel_plan

## Jupyter Notebook
create the following files for data extraction:
- config.py
code in file:
SODAPY_APPTOKEN= "API KEY HERE"
- config_db.py
password_db = "POSGRES DATABASE PASSWORD HERE"

## PostgresSQL Database
- create a new database called "travel_data"
- run the travel_data_sql.sql script from folder "db_script" from the "travel_data" database created above in Postgres (PG Admin was used for this project)

## Application
- go to root directory and run app.py (activate the PythonData beforehand), and it run using Python
- once app.py is launched, open your browser and go to localhost or typically (http://127.0.0.1:5000/) to call the index.html to visualize charts

# Starting from Scratch

## Building the Docker Image

Clone the tcat-grafana repo:
`git clone git@github.com:tamu-edu/tcat-grafana.git`

Go into the repo and checkout the tcat-tweaks branch.

`cd tcat-grafana`

`git checkout tcat-tweaks`

Build the docker image
`make build-docker-full`

The new image should be named 'grafana/grafana-oss'.

## Setting up the Postgres Container

Now we have to create a postgres container for the postgres database.
The postgres database is not required for grafana itself but is used as a datasource.

To persist the data in postgres we will first create a volume for postgres.
`docker volume create pgdata`

Next we will run a postgres container.
`<PASSWORD>` will be the password used to connect to the postgres database.
`docker run -p 5432:5432 --name postgres-container -e POSTGRES_PASSWORD=<PASSWORD> -v pgdata:/var/lib/postgresql/data -d postgres`

Finally, we will run the following command and take note of the IP address it returns.
The address is the address of the postgres database and will be used when configuring the postgres datasource in grafana.
`docker inspect postgres-container | grep IPAddress`

## Setting up Grafana

Now we will setup grafana.

To persist the data in grafana across updates and restarts we will create a volume for grafana.
`docker volume create grafana-storage`

Setting this envrionment variable installs the plugins when the container starts.
This is faster than manually installing the plugins every time.
`-e "GF_INSTALL_PLUGINS=yesoreyeram-boomtheme-panel,yesoreyeram-infinity-datasource"`


Setting this envrionment variable enables an important feature needed for this project, namely public dashboards.
`-e GF_FEATURE_TOGGLES_ENABLE=publicDashboards`

The full command:
`docker run -p 3000:3000 -e "GF_INSTALL_PLUGINS=yesoreyeram-boomtheme-panel,yesoreyeram-infinity-datasource" -e GF_FEATURE_TOGGLES_ENABLE=publicDashboards -v grafana-storage:/var/lib/grafana grafana/grafana-oss:dev`

Grafana should now be running and should be accessable on port 3000.

Open grafana and sign in as the admin.
The username and password is admin.
After signing in you will be prompted to change the admin password.
After changing the password, create a new postgres datasource.
For the host field, put in the result from the `docker inspect ...` command above.
The databse field should be set to hsc, this is just how Christopher has configured his databse.
The user field should be set to postgres.
The password field should be set to the same password used when creating the postgres container.
TLS/SSL Mode should be set to disable. This is because the postgres image does not come with SSL by default.

## Updating the Source Code

To update the source code when new versions of Grafana are released:
First sync the main branch using the sync fork feature on Git
Then clone the tcat-grafana source code.
Then checkout the tcat-tweaks branch and rebase ontop of main.
Afterwards rebuild the docker image and do all of the steps above.

# Dashboard Notes

Grafana template variables are not usable in public dashboards for now.
This should be fixed in the future so the source code will need to be rebased on top of the release commit where this is fixed.

Instead of directly loading geojson files into the geomap panel, use infinity datasource instead.
By using this datasource you can perform operations on the geojson data that would not be possible by just loading it directly.

## Using Infinity Datasource

- set the type to JSON
- set the parser to backend (this is because we cannot use frontend parsers in public dashboards)
- set the source to inline and put in your data

After doing the steps above, if you reload the panel and go to table view, you should be able to see all the data.
If it seems that the parser is looking in the wrong place for the data, then expand the "Parsing options & Result fields" tab and select the correct root.
The selection syntax is basically the same as accessing fields in JS, Ex: `root.main.data`, the only catch is that you have to access array values with dots instead of brackets: `root.array.1`.
Once you have the correct root, you can begin adding columns in the same tab.
The selector is the same syntax as the selector of the root.
The title will be the name of the field.
Note, if you want to plot the data on a geomap, a number format is necessary for coordinate or latitude/longitude fields.

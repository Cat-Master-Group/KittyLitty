# Getting Started
## Setup
Before getting started you'll need the following:
* [Visual Studio Code](https://code.visualstudio.com/)
* [MongoDB](https://www.mongodb.com/)
* Package manager of your choice
* [git](https://git-scm.com/)

Using your package manager you'll also need to install:
* [nodemon](https://www.npmjs.com/package/nodemon)

Afterward, clone the repo using `git clone https://github.com/Cat-Master-Group/KittyLitty.git` and install the node modules using your package manager's install command.

## Running The Project
Before running the project, you'll need to startup MongoDB. The project assumes that the database is being run on the same machine on port 27017.

Listed below are the scripts that can be used to start the app using your package manager:
* `start` - starts the app in its prod configuration
* `start-dev` - starts the app in its dev configuration using nodemon
* `start-dev-no-login` - starts the app in its dev configuration using nodemon without user authentication

## Other Scripts
* `clean` - empties the entire database
* `seed` - seeds the database with some prepopulated users

## Development Recommendations
Read the [Guide To Making Components](https://github.com/Cat-Master-Group/KittyLitty/wiki/Guide-to-Making-Components) and stay tuned for updates.
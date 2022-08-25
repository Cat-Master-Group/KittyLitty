# KittyLitty
Social media web application to help connect cat owners to find playmates for their cat. Users can match, have conversations, and report other users.

# Getting Started
## Setup
Before getting started you'll need the following:
* [Visual Studio Code](https://code.visualstudio.com/)
* [MongoDB](https://www.mongodb.com/)
* Package manager of your choice
* [git](https://git-scm.com/)


1. In your terminal type `git clone https://github.com/Cat-Master-Group/KittyLitty.git` to clone it to your computer.
2. Then type `cd KittyLitty` to access the folder
3. To install the required modules type `npm i`
4. Run our seed file on by typing in `npm run seed`
5. Type `npm run start` in your terminal and you can view KittyLitty on `localhost:3000/`


## Running The Project
Before running the project, you'll need to startup MongoDB. The project assumes that the database is being run on the same machine on port 27017.

Listed below are the scripts that can be used to start the app using your package manager:
* `start` - starts the app in its prod configuration
* `start-dev` - starts the app in its dev configuration using nodemon
* `start-dev-no-login` - starts the app in its dev configuration using nodemon without user authentication

## Dummy data
email: `rparker@yahoo.com` (Recommended Account to test)
password: `ilovecats` (Recommended Account to test)

email: `leetpeet@seekpeet.com`
password: `hideandseekpeet`

email: `from@dexterLab.com`
password: `fancyUnicorn`

email: `youknowthe@bestnickshow.com`
password: `cynthiabeautiful`

email: `walt@sueus.com`
password: `mousefriend`

## Other Scripts
* `clean` - empties the entire database
* `seed` - seeds the database with some prepopulated users

## Development Recommendations
Read the [Guide To Making Components](https://github.com/Cat-Master-Group/KittyLitty/wiki/Guide-to-Making-Components) and stay tuned for updates.
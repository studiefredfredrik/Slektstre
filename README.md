# Slektstre
A page where you can build your own family tree.
Features a admin mode for adding people and details (images, birth dates, stories etc).
And a usermode that is read-only, so you can let your family visit the page without
having to worry about them accidentally deleting everything.

Slektstre is norwegian for family tree. The project is a mix of english/norwegian at the moment.
It was done as a hobby project.

## Instructions
1. Clone the repo
2. Install packages: `npm install`
3. Run an instance of MongoDB
4. Change out the database configuration in `config/database.js`
5. Change out auth keys in `config/auth.js`
6. There is a file named `%userhash%ISADMINUSER` in `\app\json` with the word 'false' in it. 
To enable admin mode for that user/userhash change this word to `true`
Example file name:
`\app\json\564cb81b5ffc654401ab0d05ISADMINUSER`
The userfiles is generated on a users first login.
7. Launch: `node server.js`
8. Page hosted at: `http://localhost:10080`

## Screenshots
* Overview medium size
![Overview medium size](https://raw.githubusercontent.com/studiefredfredrik/Slektstre-beta/master/screencaps/Overview-medium.PNG)

* Overview small size
![Overview small size](https://raw.githubusercontent.com/studiefredfredrik/Slektstre-beta/master/screencaps/Overview-small.PNG)

* Detail view small
![Detail view small](https://raw.githubusercontent.com/studiefredfredrik/Slektstre-beta/master/screencaps/Detail-view-small.PNG)

* Detail view expanded
![Detail view expanded](https://raw.githubusercontent.com/studiefredfredrik/Slektstre-beta/master/screencaps/Detail-view-expanded.PNG)

#License
Supplied under the MIT license, which can be viewed in the LICENSE file.
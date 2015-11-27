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
4. Change out the database configuration in config/database.js
5. Change out auth keys in config/auth.js
6. Add a file named %userhash%ISADMINUSER to \app\json with the word 'true' in it 
	to enable admin mode for that user/userhash
	example, if the userhash is:564cb81b5ffc654401ab0d05 then the file will be:
	\app\json\564cb81b5ffc654401ab0d05ISADMINUSER
7. Launch: `node server.js`
8. Page hosted at: `http://localhost:10080`
var Nightmare = require("nightmare");
var Promise = require("promise");

/**
 * @param {string} email
 * @param {string} password
 * @param {string} kidId (eg. 'kid123456')
 * @returns {promise}
 * @todo  split out login and kid select logic
 */
 module.exports = function (email, password) {
	return new Promise(function (fulfill, reject){
		var timeSinceBottle;
		var babyConnect = new Nightmare()
			.goto("https://www.baby-connect.com/login")
			.wait("#email")
			.type("#email", email)
			.wait(100)
			.type("#pass", password)
			.wait(100)
			.click("#save")
			.wait(2000)
			.evaluate(function() {
				var lastBottle = {};
				var bottleString = document.querySelector('#ago_bib').innerText;
				lastBottle.hour = /\d{1,2}(?=h)/g.exec(bottleString);
				if (lastBottle.hour){
					lastBottle.hour = parseInt(lastBottle.hour);
					lastBottle.minute = /h(\d{1,2})/g.exec(bottleString);
						if (lastBottle.minute) {
							lastBottle.minute = parseInt(lastBottle.minute.slice(1));
					}
				} else {
					lastBottle.minute = parseInt(/\d{1,2}(?=min)/g.exec(bottleString));
				}
				return lastBottle;
			})
			.end()
			.then(function(results) {
				console.log(results);
				timeSinceBottle = results;
				fulfill(timeSinceBottle);
			})
			//catch errors if they happen
			.catch(function(error){
				reject(error);
			});
	});
};
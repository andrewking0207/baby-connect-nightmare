var Nightmare = require("nightmare");
var Promise = require("promise");

/**
 * @param {string} email
 * @param {string} password
 * @param {string} kidId (eg. 'kid123456')
 * @returns {promise}
 * @todo  split out login and kid select logic
 */
 module.exports = function (email, password, kidId) {
	return new Promise(function (fulfill, reject){
		var timeSinceDiaper;
		var babyConnect = new Nightmare()
			.goto("https://www.baby-connect.com/login")
			.wait("#email")
			.type("#email", email)
			.wait(100)
			.type("#pass", password)
			.wait(100)
			.click("#save")
			.wait(5000)
			.click("#" + kidId + " > a")
			.wait(500)
			.evaluate(function() {
				var lastDiaper = {};
				var diaperString = document.querySelector('#ago_diaper').innerText;
				lastDiaper.hour = /\d{1,2}(?=h)/g.exec(diaperString);
				if (lastDiaper.hour){
					lastDiaper.hour = parseInt(lastDiaper.hour);
					lastDiaper.minute = parseInt(/h(\d{1,2})/g.exec(diaperString).slice(1));
				} else {
					lastDiaper.minute = parseInt(/\d{1,2}(?=min)/g.exec(diaperString));
				}
				return lastDiaper;
			})
			.end()
			.then(function(results) {
				console.log(results);
				timeSinceDiaper = results;
				fulfill(timeSinceDiaper);
			})
			//catch errors if they happen
			.catch(function(error){
				reject(error);
			});
	});
};
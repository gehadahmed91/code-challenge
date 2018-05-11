var fs = require('fs');
var async = require('async');

var order = process.argv[2];
var actionRes = "";

async.waterfall([
	//get object of objects from dictionary.txt file
	function(callback){
		fs.readFile('dictionary.txt', function(err, data) {
			if (err) {
				// file is not exist
				fs.appendFile('dictionary.txt', '{}', function (err) {
					if (err) throw err;
					callback(null, {});
				});
			}else{
				callback(null, JSON.parse(data));
			}
		 });
	},
	function(oldObj, callback){
		// get the new object to save
		var newObj = oldObj;
		
		// add new key/value
		if(order == 'add'){
			if(process.argv[3] && process.argv[4])
				newObj[process.argv[3]] = {"key":process.argv[3],"value":process.argv[4]};
			else
			{
				console.log("There is missing arguments");
				actionRes = 'missingArgs';
			}
		}
		// list the current keys/values
		else if(order == 'list'){
			console.log(newObj);
		}
		// get value for specific key
		else if(order == 'get'){
			if(process.argv[3])
				if(newObj[process.argv[3]])
					console.log(newObj[process.argv[3]]);
				else
					console.log('Ther is No Values for this Key');
			else
			{
				console.log("There is missing arguments");
				actionRes = 'missingArgs';
			}
		}
		// remove value for specific key
		else if(order == 'remove'){

			if(process.argv[3])
				delete newObj[process.argv[3]];
			else
			{
				console.log("There is missing arguments");
				actionRes = 'missingArgs';
			}
		}
		// clear all keys/values
		else if( order == 'clear'){
			newObj = {};
		}
		else{
			console.log("This action is not valid")
			actionRes = 'invalid';
		}
		callback(null, newObj);
	},
	function(newObj, callback){
		fs.writeFile('dictionary.txt', JSON.stringify(newObj, null , 4), function (err) {
	 		if (err) throw err;
	 		callback(null, newObj);
	 	});
	}
	],function(err, results){
		if(err) throw err;
		if(actionRes == 'missingArgs')
			console.log("Enter All Required Arguments");
		else if(actionRes == 'invalid')
			console.log("Enter a Valid Action");
		else{
			console.log(results);
			console.log("=================================");
			console.log("Action Applied Successfuly");
		}
	});

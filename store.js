var fs = require('fs');
var async = require('async');

var order = process.argv[2];


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
			newObj[process.argv[3]] = {"key":process.argv[3],"value":process.argv[4]};
		}
		// list the current keys/values
		else if(order == 'list'){
			console.log(newObj);
		}
		// get value for specific key
		else if(order == 'get'){
			console.log(newObj[process.argv[3]]);
		}
		// remove value for specific key
		else if(order == 'remove'){
			delete newObj[process.argv[3]];
			console.log(newObj);
		}
		// clear all keys/values
		else if( order == 'clear'){
			newObj = {};
		}
		else{
			console.log("This action is not valid")
		}
		callback(null, newObj);
	},
	function(newObj, callback){
		fs.writeFile('dictionary.txt', JSON.stringify(newObj), function (err) {
	 		if (err) throw err;
	 	});
	}
	],function(err, results){
		if(err) throw err;
		console.log("Action Applied Successfuly");
	});

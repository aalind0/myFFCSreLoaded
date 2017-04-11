var mongoose = require('mongoose');
var promise = require('bluebird');
var bcrypt = require('bcrypt');
var user = mongoose.Schema({
	name:{
		type:String
	},
	regno:{
		type:String,
		unique:true
	},
	passwd:{
		type:String,
		bcrypt:true
	}
});

var User = mongoose.model("User",user);

function userPresent(regno){
	return new promise(function(fullfill,reject){
		User.find({regno:regno},function(err,data){
			if (err) reject("Mongo error: "+err);
			else if(data.length>0){
				fullfill(true);
			}
			else{
				fullfill(false);
			}
		});
	});
}

function encryptAndSave(name,regno,passwd){
	return new promise(function(fullfill,reject){
		bcrypt.hash(passwd,10,function(err,hash){
			if (err) 
				reject("Bcrypt error :"+err);
			else{
				passwd= hash;
				var newUser = new User({
					name:name,
					regno:regno,
					passwd:passwd
				});
				newUser.save(function(error, data){
					if(err)
						reject('Mongo error: '+error);
					else{
						fullfill('User inserted :'+ name);
					}
				});
			}

		});
	});
}

function userInsert(name,regno,passwd){
	return new promise(function(fullfill,reject){
		userPresent(regno)
		.then(function(is){
			if(is){
				fullfill('You have already registered once');
			}
			else{
				return encryptAndSave(name,regno,passwd);
			}
		})
		.catch(function(e){
			reject(e);
		})
		.then(function(res){
			fullfill(res)
		})
		.catch(function(e){
			reject(e);
		});
		

		
	});
}

exports.insertUser = userInsert;
exports.User= User;

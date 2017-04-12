var express = require("express");
var router = express.Router();
var promise = require('bluebird');
var user = require('../models/user');
var course = require('../models/courses');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');
var auth = require('../authentication/auth');


// course.allCourseCode(null, null).then((res) => {			//slot,crsnm
// 	console.log(res);
// });

// course.allSlots("CSE2006", null).then((res) => {			//crscd,faculty
// 	console.log(res);
// });

// course.allFaculty(null, "L1+L2").then((res) => {			//crscd,slot
// 	console.log(res);
// });

// course.allCourseName("CSE3009").then((res) => {			//crscd
// 	console.log(res);
// });

router.get('/', function (req, res) {
	res.render('home', { data: false });
});

router.post('/register', function (req, res) {
	user.insertUser(data.name, data.regno, data.password)
		.then(function (action) {
			console.log('adjba');
			res.render('home', { data: true, message: action });
		}).catch(function (error) {
			res.render('home', { data: true, message: error });
		});
});



router.post('/login', passport.authenticate('local', { successRedirect: '/home', failureRedirect: '/failed' }));

router.get('/home', (req, res) => {
	if (req.user == undefined) {
		res.redirect('/');
	} else {
		course.all().then((res1) => {
			course.allCourseCode(null, null).then((res2) => {
				course.allSlots("CSE2006", null).then((res3) => {
					res.render('newtt', { user: req.user, data: res1, codes: res2, slots: res3 });
				});

			});

		});
	}

});


router.get('/getslot/', (req, res) => {
	var crscd = req.query.q;
	course.allSlots(crscd, null)
	.then((res1) => {
		res.send(res1);
	})
	.catch((res2)=>{
		console.log(res2);
	});
});


router.get("/getcourse/",(req,res)=>{
	course.all(req.query.courseCode,req.query.slots)
	.then((res1)=>{
		res.send(res1);
	})
	.catch((res2)=>{
		console.log(res2);
	});
});

router.get('/failed', function (req, res) {
	res.render('home', { message: "Invalid Credentials", data: true });
});


router.get('/oldtimetable',(req,res)=>{
	if(req.user ==undefined){
		res.render('home',{data:true,message:"Login First"});
		res.location('/');
	}
	else{
		res.render('oldtt',{user:req.user});
	}
});

router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
});

module.exports = router;
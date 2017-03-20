var express = require('express');
var exRouter = express.Router();
var router = express.Router();
var models = require('service/models');
var async = require('async');

exRouter.use("/", router);

router.all("/:company/login.html", function(req, res, next){
	models.StoreInfo.findAll({
		where : {
			companyId : req.params.company,
			delYn : 'N',
			useYn:'Y'
		},
		attributes: ['storeId', 'storeName'],
		order:[['showOrder','ASC']]
	})
	.then(function (result) {
		res.locals.list = result;
		next();
	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});
},function(req,res,next){
	models.CompanyInfo.findOne({
		where : {
			companyId : req.params.company
		},
		attributes : ['integrationPointYn']
	}).then(function(result){
		res.locals.integrationPointYn = result.integrationPointYn;
		next();
	})
	.catch(function(err){
		process.nextTick(function () {throw err});
	});
});

router.all("/:company/login", function(req, res, next){
	
	models.StoreInfo.findOne({
		where : {
			storeId : req.body.storeId,
			companyId : req.params.company,
			pwd : req.body.pwd,
			useYn : 'Y',
			delYn : 'N'
		}
	})
	.then(function (result) {
		if(result){
			var toSession = {};
			toSession.storeId = result.storeId;
			toSession.companyId = result.companyId;
			toSession.storeName = result.storeName;
			toSession.integrationPointYn = req.body.integrationPointYn;
            req.session.member = toSession;
            res.send({
        		msg: true
	        });
		}else{
			res.send({
				msg: false
	                });
		}
	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});

});


module.exports = exRouter;

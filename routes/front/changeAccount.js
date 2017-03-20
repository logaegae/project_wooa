var express = require('express');
var exRouter = express.Router();
var router = express.Router();
var models = require('service/models');
var async = require('async');
var uuid = require('uuid');
var role = require('service/role');

exRouter.use("/", router);

var balance = null;

router.all("/:company/check.html", role('user'), function(req, res, next){

	if(Object.keys(req.body).length != 0){
		//원장기록 인스턴스생성
		var data = req.body;
		var phoneNumber = data.phoneNumber;
		delete data.phoneNumber;

		if(data.issueType == 'P'){
			data.desc = "적립";
		}else if(data.issueType == 'M'){
			data.desc = "소진";
			data.issuePoint *= -1;
		}

		data.recordId = uuid.v4();
		data.registDate = new Date();
		data.storeId = req.session.member.storeId;
		models.PointRecord.create(data)
		.then(function (result) {
			var accountId = result.accountId;
			models.MemberAccount.findOne({
				where : {
					accountId :  accountId,
					companyId : req.params.company
				}
			})
			.then(function (result2) {

				balance = Number(result2.pointBalance);
				balance += Number(data.issuePoint);
				//개인계정 업데이트
				models.MemberAccount.update({
					pointBalance : balance
				},{
					where : {
						accountId : accountId,
						companyId : req.params.company
					}
				})
				.then(function (result3) {
					var getData = {};
					getData.phoneNumber = phoneNumber;
					getData.issuePoint = data.issuePoint;
					getData.desc = data.desc;
					//통합포인트일경우
					if(req.session.member.integrationPointYn == 'Y'){
						res.locals.pointBalance = balance;
					}
					res.locals.result = getData;
			    		next();
			    	})
			    	.catch(function (err) {
			    		process.nextTick(function () {throw err});
			    	});

		    	})
		    	.catch(function (err) {
		    		process.nextTick(function () {throw err});
		    	});
		})
		.catch(function (err) {
			process.nextTick(function () {throw err});
		});
	}else{
		next();
	}

},function(req,res,next){
	if(Object.keys(req.body).length != 0){

		var accountId = req.body.accountId;
		var storeId = req.session.member.storeId;
		console.log(req.body)
		//지점별 원장기록
		models.StoreAccount.findOne({
			where : {
				accountId : accountId,
				storeId : storeId
			}
		})
		.then(function (result) {
			if(result){
				balance = Number(result.pointBalance);

				balance += Number(req.body.issuePoint);

				models.StoreAccount.update({
					pointBalance : balance,
					accessDate : new Date()
				},
				{
					where: {
						accountId : accountId,
						storeId : storeId
					}
				})
				.then(function (reslut) {
					//통합포인트일경우
					if(req.session.member.integrationPointYn == 'N'){
						res.locals.pointBalance = balance;
					}
					balance = null;
			    		next();
			    	})
			    	.catch(function (err) {
			    		process.nextTick(function () {throw err});
			    	});
			}else{
				models.StoreAccount.create({
					accountId : accountId,
					storeId : storeId,
					pointBalance : balance,
					registDate : new Date()
				})
				.then(function (reslut) {
					balance = null;
			    		next();
			    	})
			    	.catch(function (err) {
			    		process.nextTick(function () {throw err});
			    	});
			}
	    	})
	    	.catch(function (err) {
	    		process.nextTick(function () {throw err});
	    	});
	}else{
		next();
	}

});

module.exports = exRouter;

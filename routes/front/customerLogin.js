var express = require('express');
var exRouter = express.Router();
var router = express.Router();
var models = require('service/models');
var async = require('async');
var uuid = require('uuid');
var role = require('service/role');

exRouter.use("/", router);

var memberData = {};
var check = {};

router.all("/:company/customer.html", role('user'));

router.all("/:company/clerk.html", role('user'), function(req, res, next){
	if(memberData.phoneNumber){
		models.MemberAccount.findOne({
			where : {
				companyId : req.params.company,
				memberId : memberData.memberId
			}
		})
		.then(function (result) {
			var data = result;
			var accountId = data.accountId;
			var storeId = req.session.member.storeId;
			var page = req.query.page ? parseInt(req.query.page) : 1;
			var pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 5;
			data.phoneNumber = memberData.phoneNumber;
			check.accountId = accountId;

			//통합포인트일 경우
			if(req.session.member.integrationPointYn == 'Y'){
				check.pointBalance = data.pointBalance;
				res.locals.list = data;
				models.PointRecord.findAndCountAll({
					where : where = {
						accountId : accountId
					},
			        order : 'registDate DESC',
					offset : (page-1)*pageSize,
					limit : pageSize
			    })
			    .then(function (result2) {
			        res.locals.totalCount = result2.count;
					res.locals.records = result2.rows;
					res.locals.page = page;
					res.locals.pageSize = pageSize;
			        next();
			    })
			    .catch(function (err) {
			        process.nextTick(function () {throw err});
			    });
			}
			//통합포인트가 아닐 경우
			else if(req.session.member.integrationPointYn == 'N'){
				models.StoreAccount.findOne({
					where : {
						storeId : storeId,
						accountId : accountId
					}
				})
				.then(function (result2) {
					var list = {};
					list.phoneNumber=memberData.phoneNumber;
					list.storeId=storeId;
					list.accountId=accountId;
					list.pointBalance=result2.pointBalance;
					check.pointBalance = result2.pointBalance;
					res.locals.list = list;

					models.PointRecord.findAndCountAll({
						where : where = {
							accountId : accountId,
							storeId : storeId
						},
				        order : 'registDate DESC',
						offset : (page-1)*pageSize,
						limit : pageSize
				    })
				    .then(function (result3) {
				        res.locals.totalCount = result3.count;
						res.locals.records = result3.rows;
						res.locals.page = page;
						res.locals.pageSize = pageSize;
				        next();
				    })
				    .catch(function (err) {
				        process.nextTick(function () {throw err});
				    });
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
		//비정상접근
		next();
	}
},function(req,res,next){
	//원장과 누적포인트 대조
	var companyId = req.params.company;
	var memberId = memberData.memberId;
	var storeId = req.session.member.storeId;
	var where = {
		accountId : check.accountId
	}

	//통합포인트가 아닐 경우
	if(req.session.member.integrationPointYn == 'N') where.storeId = req.session.member.storeId;
	models.PointRecord.findAll({
		where : where
	})
	.then(function (result) {
		var temp = 0;
		result.forEach(function(e,i){
			temp += Number(e.issuePoint);
		});
		if(temp != check.pointBalance){
			res.locals.valid=false;
		}
		else{
			res.locals.valid=true;
		}
		check = {};
		next();
	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});
});

router.all("/:company/inputTelNumber", function(req, res, next){
	var phoneNumber = req.body.phoneNumber;
	//회원정보 조회
	models.MemberInfo.findOne({
		where : {
			phoneNumber : phoneNumber
		}
	})
	.then(function (result) {
		//회원인 경우
		if(result){
			memberData = result;
			memberData.phoneNumber = phoneNumber;
			// 개인계좌조회
			models.MemberAccount.findOne({
				where : {
					memberId : memberData.memberId,
					companyId : req.params.company
				}
			})
			.then(function (result2) {
				// 개인계좌가 있는경우
				if(result2){
					var accountId = result2.accountId;
					//접속정보 업데이트
					models.MemberAccount.update({
						accessDate : new Date()
					},{
						where:{
							memberId : memberData.memberId
						}
					})
					.then(function (result3) {
						//회원의 지점별 계좌 조회
						models.StoreAccount.findOne({
							where : {
								accountId : accountId,
								storeId : req.session.member.storeId
							}
						})
						.then(function (result4) {
							//지점계좌가 있는 경우
							if(result4){
								res.send({
									msg: 'login'
								});
							}
							//지점계좌가 없는 경우
							else{
								//회원의 지점계좌 생성
								models.StoreAccount.create({
									accountId : accountId,
									storeId : req.session.member.storeId,
									pointBalance : 0,
									registDate : new Date(),
									accesssDate : new Date()
								})
								.then(function (result5) {
									//최종승인
									res.send({
										msg: 'signUp'
									});
								})
								.catch(function (err) {
									process.nextTick(function () {throw err});
								});
							}
						})
						.catch(function (err) {
							process.nextTick(function () {throw err});
						});
					}).catch(function (err) {
						process.nextTick(function () {throw err});
					});
				}
				// 개인계좌가 없는 경우
				else{
					//개인계좌 생성
					models.MemberAccount.create({
						accountId : accountId,
						memberId : memberId,
						companyId : req.params.company,
						pointBalance : 0,
						registDate : new Date(),
						accesssDate : new Date()
					})
					.then(function (result2) {
						if(result2){
							memberData.phoneNumber = phoneNumber;
							memberData.memberId = result2.memberId;
							//지점계좌 생성
							models.StoreAccount.create({
								accountId : accountId,
								storeId : req.session.member.storeId,
								pointBalance : 0,
								registDate : new Date(),
								accesssDate : new Date()
							})
							.then(function (result2) {
								//최종승인
								res.send({
									msg: 'signUp'
				                });
							})
							.catch(function (err) {
								process.nextTick(function () {throw err});
							});

						}else{
							res.send({
								msg:false
							});
						}
					})
					.catch(function (err) {
						process.nextTick(function () {throw err});
					});
				}
			})
			.catch(function (err) {
				process.nextTick(function () {throw err});
			});
		}
		//회원이 아닌경우
		else{
			//회원가입창이 따로 없는 경우 / 조회시 데이터 없으면 생성
			//인스턴스 생성 / 회원가입
			var memberId = uuid.v4()
			models.MemberInfo.create({
				memberId : memberId ,
				phoneNumber : phoneNumber,
				registDate : new Date()
			})
			.then(function (result) {
				var accountId = uuid.v4()
				//개인계좌 생성
				models.MemberAccount.create({
					accountId : accountId,
					memberId : memberId,
					companyId : req.params.company,
					pointBalance : 0,
					registDate : new Date(),
					accesssDate : new Date()
				})
				.then(function (result2) {
					if(result2){
						memberData.phoneNumber = phoneNumber;
						memberData.memberId = result2.memberId;
						//지점계좌 생성
						models.StoreAccount.create({
							accountId : accountId,
							storeId : req.session.member.storeId,
							pointBalance : 0,
							registDate : new Date(),
							accesssDate : new Date()
						})
						.then(function (result2) {
							//최종승인
							res.send({
								msg: 'signUp'
			                });
						})
						.catch(function (err) {
							process.nextTick(function () {throw err});
						});

					}else{
						res.send({
							msg:false
						});
					}
				})
				.catch(function (err) {
					process.nextTick(function () {throw err});
				});
			})
			.catch(function (err) {
				process.nextTick(function () {throw err});
			});
		}
	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});
});

router.all("/:company/signUpStep1", function(req, res, next){
	var phoneNumber = req.body.phoneNumber


	//중복확인
	models.MemberInfo.findOne({
		where : {
			phoneNumber : phoneNumber
		}
	})
	.then(function (result) {
		if(result){
			memberData = result;
			memberData.phoneNumber = phoneNumber;
			res.send({
				msg: false
            });
		}else{
			memberData = {};
			res.send({
				msg: true
            });
		}
	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});
});

router.all("/:company/signUpStep2", function(req, res, next){
	var phoneNumber = req.body.phoneNumber

	//인스턴스 생성
	var memberId = uuid.v4()
	models.MemberInfo.create({
		memberId : memberId ,
		phoneNumber : phoneNumber,
		registDate : new Date()
	})
	.then(function (result) {
		models.MemberAccount.create({
			accountId : uuid.v4(),
			memberId : memberId,
			companyId : req.params.company,
			pointBalance : 0,
			registDate : new Date(),
			accesssDate : new Date()
		})
		.then(function (result) {

			//최종승인
			res.send({
				msg: true
            });
		})
		.catch(function (err) {
			process.nextTick(function () {throw err});
		});
	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});
});


module.exports = exRouter;

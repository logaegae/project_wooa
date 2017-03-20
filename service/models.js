var Sequelize = require('sequelize');

//sequelize-auto -o "./service/models" -d himedia -h i-make.kr -u root -p 3306 -x acac1202 -e mysql


var host = process.platform === "win32" || process.platform === "darwin" ? "i-make.kr" : "localhost";
var sequelize = new Sequelize('mysql://root:acac1202@'+host+'/wooa',{
	define : {
		timestamps: false
	},
	logging: true,
	timezone:'+09:00'
});
var fs = require("fs");
var path = require("path");
var db = {};
fs.readdirSync(__dirname+"/"+"models").forEach(function(file) {
	if(file.indexOf(".js") > -1) {
		var name = file.replace(".js","");
		db[name] = sequelize.import(path.join(__dirname+"/models", file));
	}
});
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.MemberAccount.hasMany(db.PointRecord, {foreignKey: 'accountId', useJunctionTable: false});
db.MemberAccount.belongsTo(db.StoreAccount, {foreignKey: 'accountId', targetKey: 'accountId'});
//
//db.Board.belongsTo(db.Branch, {foreignKey: 'branchCode', targetKey: 'branchCode'});
//db.Board.hasMany(db.BoardComment, {foreignKey: 'boardId', useJunctionTable: false});
//db.JobInterview.belongsTo(db.Branch, {foreignKey: 'branchCode', targetKey: 'branchCode'});
//db.JobCondition.belongsTo(db.Branch, {foreignKey: 'branchCode', targetKey: 'branchCode'});
//
//
//db.Branch.belongsTo(db.AttachFile, {foreignKey: 'fileUUID'});
//db.Branch.AttachSets = db.Branch.belongsToMany(db.AttachFile, {through: db.AttachSet, as : 'AttachSets', otherKey : 'fileUUID'});
//
//db.Portfolio.belongsTo(db.AttachFile, {foreignKey: 'fileUUID'});
//db.Portfolio.AttachSets = db.Portfolio.belongsToMany(db.AttachFile, {through: db.AttachSet, as : 'AttachSets', otherKey : 'fileUUID'});
//db.Portfolio.belongsTo(db.Branch, {foreignKey: 'branchCode', targetKey: 'branchCode'});
//db.Portfolio.belongsTo(db.CodeInfo, {foreignKey: 'portfolioType', targetKey: 'codeId'});
//
//db.JobConsultant.belongsTo(db.AttachFile, {foreignKey: 'fileUUID', targetKey: 'fileUUID'});
//db.JobConsultant.belongsTo(db.Branch, {foreignKey: 'branchCode', targetKey: 'branchCode'});
//db.CourseField.belongsTo(db.AttachFile, {foreignKey: 'fileUUID', targetKey: 'fileUUID'});
//db.JobInterview.belongsTo(db.AttachFile, {foreignKey: 'fileUUID', targetKey: 'fileUUID'});
//db.Teacher.belongsTo(db.AttachFile, {foreignKey: 'fileUUID', targetKey: 'fileUUID'});
//db.Teacher.belongsTo(db.CourseField, {foreignKey: 'fieldId', targetKey: 'fieldId'});
//
//db.CourseReview.belongsTo(db.Branch, {foreignKey: 'branchCode', targetKey: 'branchCode'});
//db.CourseReview.belongsTo(db.CourseField, {foreignKey: 'fieldId', targetKey: 'fieldId'});
//
//db.Popup.belongsTo(db.AttachFile, {foreignKey: 'fileUUID', targetKey: 'fileUUID'});
//db.Slide.belongsTo(db.AttachFile, {foreignKey: 'fileUUID', targetKey: 'fileUUID'});
//
//db.Toon.hasMany(db.ToonComment, {foreignKey: 'toonId', useJunctionTable: false});
//
//db.Teacher.hasMany(db.BranchTeacher, {foreignKey: 'teacherSeq', useJunctionTable: false});
//
//db.Popup.belongsTo(db.BranchPopup, {foreignKey: 'popupId', targetKey: 'popupId'});
//db.Slide.belongsTo(db.BranchSlide, {foreignKey: 'slideId', targetKey: 'slideId'});

//db.BranchPopup.hasOne(db.Popup, {foreignKey: 'popupId', targetKey: 'popupId'});
//db.BranchSlide.hasOne(db.Slide, {foreignKey: 'slideId', useJunctionTable: false});

/*
db.Store.hasMany(db.AttachFile, {foreignKey: 'storeId', useJunctionTable: false});
db.Group.hasMany(db.Store, {foreignKey: 'groupId', useJunctionTable: false});
db.Contact.hasMany(db.ContactComment, {foreignKey: 'contactId', useJunctionTable: false});
db.Contact.hasMany(db.ContactComment, {foreignKey: 'contactId', useJunctionTable: false});
db.Contact.belongsTo(db.Store, {foreignKey: 'storeId', targetKey: 'storeId'});
*/
module.exports = db;

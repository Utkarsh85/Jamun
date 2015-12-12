"use strict"
var monk = require('monk');
var wrap = require('co-monk');
var requireDir = require('require-dir');
var db = monk('localhost/test');
var inspector = require('schema-inspector');

var userdefinedmodels = requireDir('../api/models');//Find all the user defined models

/////////////////////////////////////////////////////
class mdl
{
	constructor(db,model)
	{
		this.db=db;
		this.model=model;
	}

	*findOne(params)
	{
		return yield this.db.findOne(params);
	}

	*find(params)
	{
		return yield this.db.find(params);
	}

	*create(params)
	{
		if(this.model.beforeValidate)
		params=yield this.model.beforeValidate(params);// Before Validate Routine
		//Do validation
		
		yield this.validate(params);

		//Validation Over
		if(this.model.afterValidate)
		yield this.model.afterValidate(params);//After Validate Routine

		//Add update and create params
		params=this.Add_create_and_update_tag(params);

		//Before create routine
		if(this.model.beforeCreate)
		params= yield this.model.beforeCreate(params);
		//Go and create record
		var createdrecord= yield this.db.insert(params);
		//After create routine
		if(this.model.afterCreate)
		yield this.model.afterCreate(createdrecord);

		return createdrecord;
	}

	*update(condition,params)
	{
		if(this.model.beforeValidate)
		params=yield this.model.beforeValidate(params);// Before Validate Routine
		//Do validation
		
		yield this.validate(params);

		//Validation Over
		if(this.model.afterValidate)
		yield this.model.afterValidate(params);//After Validate Routine

		//Add update and create params
		params=this.Add_update_tag(params);

		//Before create routine
		if(this.model.beforeUpdate)
		params= yield this.model.beforeUpdate(params);

		//Go and update record
		var updatedRecord= yield this.db.update(condition,params);

		if(this.model.afterUpdate)
		yield this.model.afterUpdate(updatedRecord);

		return updatedRecord;
	}

	// *updateById(id,params)
	// {
	// 	if(this.model.beforeValidate)
	// 	params=yield this.model.beforeValidate(params);// Before Validate Routine
	// 	//Do validation
		
	// 	yield this.validate(params);

	// 	//Validation Over
	// 	if(this.model.afterValidate)
	// 	yield this.model.afterValidate(params);//After Validate Routine

	// 	//Add update and create params
	// 	params=this.Add_update_tag(params);

	// 	//Before create routine
	// 	if(this.model.beforeUpdate)
	// 	params= yield this.model.beforeUpdate(params);

	// 	//Go and update record
	// 	var updatedRecord= yield this.db.updateById(id,params);

	// 	if(this.model.afterUpdate)
	// 	yield this.model.afterUpdate(updatedRecord);

	// 	return updatedRecord;
		
	// }

	*destroy(params)
	{
		//Before destroy routine
		if(this.model.beforeDestroy)
		params= yield this.model.beforeDestroy(params);

		//Go and destroy record
		var destroyedRecord= yield this.db.remove(params);

		//After destroy routine
		if(this.model.afterDestroy)
		yield this.model.afterDestroy(destroyedRecord);

		return destroyedRecord;
	}

	*validate(params)
	{
		// var result = inspector.validate(this.model.attributes, params);

		// if(!result.valid)
		// 	throw new Error("Validation unsuccessfull");
		// return ;

		var schema = require('simple-mongo-schema')(this.model.attributes);
		yield schema.validate(params);
		return;
	}

	Add_create_and_update_tag(params) {
		
		if(this.model.autoCreatedAt==false)
		{}
		else
		{
			params.createdAt=new Date();
		}

		if(this.model.autoUpdatedAt==false)
		{}
		else
		{
			params.updatedAt=new Date();
		}

		return params;
	}

	Add_update_tag(params) {
		
		if(this.model.autoUpdatedAt==false)
		{}
		else
		{
			params.updatedAt=new Date();
		}

		return params;
	}


}

var Model={}; 

for(var key in userdefinedmodels)
{
	Model[key]=new mdl(wrap(db.get(key)),userdefinedmodels[key]);
}


module.exports=Model;
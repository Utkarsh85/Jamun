var Model= require('./Model');
var parse= require('co-body');

function getmodel (path) {
	return capitalise(path.split('/')[1]);
}
function capitalise(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

module.exports=
{
	find: function* () {
		var model= getmodel(this.request.path);
		
		if(this.params.id)
			this.body= yield Model[model].findOne(this.params.id);
		
		else
			this.body= yield Model[model].find(this.request.query);
	},

	create: function* () {

		var body = yield parse.json(this);
		var model= getmodel(this.request.path);

		try
		{
			var createdvalue=yield Model[model].create(body);
		}
		catch(err)
		{
		    this.throw(400, err);
		}

		this.body=createdvalue;
	},

	update: function* (id) {
		var body = yield parse.json(this);
		console.log(body);
		var model= getmodel(this.request.path);

		if(!this.params.id)
			this.throw(400,"Id not passed");

		try
		{
			updatesuccess= yield Model[model].update(this.params.id,body);
		}
		catch(err)
		{
		    this.throw(400, err);
		}

		this.body=body;
	},

	destroy: function* () {


		var model= getmodel(this.request.path);

		if(!this.params.id)
			this.throw(400,"Id not passed");

		try
		{
			destroysuccess= yield Model[model].destroy({_id:this.params.id});
		}

		catch(err)
		{
		    this.throw(400, err);
		}

		this.body="Record Destroyed";

	}
}
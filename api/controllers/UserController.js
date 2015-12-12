/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var User= require('../../util/Model').User;
var parse= require('co-body');

module.exports = {
	create: function* () {

		var body = yield parse.json(this);

		try
		{
			var users=yield User.create(body);
		}
		catch(err)
		{
		    this.throw(400, err);
		}

		this.body=users;
	},

	find: function* () {
		
		this.body= yield User.find(this.request.query);
	},

	update: function* (id) {
		var body = yield parse.json(this);

		this.body= yield User.update(this.params.id,body);

	},

	destroy: function* () {

		this.body= yield User.destroy({_id:this.params.id});
	}
};


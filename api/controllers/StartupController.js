"use strict";

var Mongorito = require('mongorito');
var Model = Mongorito.Model;

Mongorito.connect('localhost/utkarsh');

class Post extends Model {};

module.exports=
{
	find: function* (id) {
		// if(id)
		// this.body = {msg:'Hello '+id};
		// else
		// this.body={msg:"Hello World"};
		console.log(this.params);
		var posts = yield Post.where('author.name', 'John Doe').find();

		this.body= posts;
	},

	create: function* () {

		

		var post = new Post({
		    title: 'Node.js with --harmony rocks!',
		    body: 'Long post body',
		    author: {
		        name: 'John Doe'
		    }
		});

		var createdpost=yield post.save();

		this.body=createdpost;
	},
	relate: function* (next) {

		console.log("In controller relate");		
		this.body="From relate";
	},

	early: function* (next) {
		
		console.log("In controller early");
		yield next;
	}
}
var koa = require('koa');  
var app = koa();
var router= require('koa-router')();
var requireDir = require('require-dir');
var compose = require('koa-compose');
var merge = require('merge')
///////////////////////////////////////////////////////////////////////////////////////////

function ControllerNametoModelName (name) {
	return name.split('Controller')[0].toLowerCase();
}
var routelist= require('./config/routes.js');

var blueprint= require('./util/Blueprint');

var controllers = requireDir('./api/controllers');
for(var controllername in controllers)
{
	if(!controllers[controllername].hasOwnProperty('find'))
	{
		controllers[controllername].find=blueprint.find;
		var action={};
		action[controllername]='find';
		routelist['GET /'+ControllerNametoModelName(controllername)+'/:id?']=[action];
	}
	if(!controllers[controllername].hasOwnProperty('create'))
	{
		controllers[controllername].create=blueprint.create;
		var action={};
		action[controllername]='create';
		routelist['POST /'+ControllerNametoModelName(controllername)]=[action];
	}
	if(!controllers[controllername].hasOwnProperty('update'))
	{
		controllers[controllername].update=blueprint.update;
		var action={};
		action[controllername]='update';
		routelist['PUT /'+ControllerNametoModelName(controllername)+'/:id']=[action];
	}
	if(!controllers[controllername].hasOwnProperty('destroy'))
	{
		controllers[controllername].destroy=blueprint.destroy;
		var action={};
		action[controllername]='destroy';
		routelist['DELETE /'+ControllerNametoModelName(controllername)+'/:id']=[action];
	}
}

console.log(routelist);
var policies = requireDir('./api/policies');
var merged=merge(controllers,policies);
// console.log(merged);

function parsekey (key) {
	// var get=/(get)/i;
	// var post=/(post)/i;
	// var put=/(put)/i;
	// var deletek=/(delete)/i;

	// if(get.test(key))
	// {
	// 	return {'key':key.slice(4,key.length),method:'get'};
	// }

	// if(post.test(key))
	// {
	// 	return {'key':key.slice(5,key.length),method:'post'};
	// }

	// if(put.test(key))
	// {
	// 	return {'key':key.slice(4,key.length),method:'put'};
	// }

	// if(deletek.test(key))
	// {
	// 	return {'key':key.slice(7,key.length),method:'delete'};
	// }
	return {key:key.split(' ')[1],method:key.split(' ')[0].toLowerCase()};
}

for(var key in routelist)
{
	var parsedkey=parsekey(key);

	var middlewares= routelist[key];

	var mfunctions=middlewares.map(function (middleware) {

		var ctrlname=Object.keys(middleware)[0];
		var actionname= middleware[ctrlname];
		console.log(ctrlname,actionname);
		if(!(merged.hasOwnProperty(ctrlname) && merged[ctrlname].hasOwnProperty(actionname)))
			throw new Error("Controller action not found for route = \""+parsedkey.key+"\"");

		return merged[ctrlname][actionname];

	});

	console.log(parsedkey,mfunctions);
	router[parsedkey.method](parsedkey.key,compose(mfunctions));
}





// router.get('/foo',compose([function *(next) {
//     this.body = {};
//     console.log("First");
//     yield next;
//   },
//   function *(next) {
//     this.body.foo = 'foo';
//     console.log("Second");
//     yield next;
//   },
//   function *(next) {
//   	console.log("Third");
//     this.body.bar = 'bar';
//     yield next;
//   }])
//   );
app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(3000); 
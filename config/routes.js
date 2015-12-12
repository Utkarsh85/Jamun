
module.exports=
{
	'GET /user/:id?': [{'superuser':'tokenok'},{'UserController':'find'}],
	'POST /user': [{'superuser':'tokenok'},{'UserController':'create'}],
	'PUT /user/:id': [{'superuser':'tokenok'},{'UserController':'update'}],
	'DELETE /user/:id': [{'superuser':'tokenok'},{'UserController':'destroy'}],
}
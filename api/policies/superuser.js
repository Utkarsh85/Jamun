module.exports= {

	tokenok:function* (next) {
		console.log("In the superuser policy");
		yield next;
	}
}
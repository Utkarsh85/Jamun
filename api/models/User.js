/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {


  autoCreatedAt:false,

  // attributes: {
  // 	type: 'object',
  //   properties: {
  //       firstname: { type: 'string', minLength: 1 },
  //       lastname: { type: 'string', minLength: 1 },
  //       jobs: {
  //           type: 'array',
  //           items: { type: 'string', minLength: 1 }
  //       },
  //       email: { type: 'string', pattern: 'email' }
  //   }
  // },

  attributes: {
		name: {
			type: String,
			required: true
		},
		born: {
			type: Date,
		},
		numChildren: {
			type: Number,
		},
  },

  beforeValidate: function* (params) {
  	
  	console.log("In before validation",params);
  	return params;
  }
};


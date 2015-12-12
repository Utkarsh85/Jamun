var anchor = require('anchor');
console.log(anchor);
var obj={
  'name': 'string',
  // 'avatar': {
  //   'path': 'string',
  //   'name': 'string',
  //   'size': 'int',
  //   'type': 'string'
  // }
}
var requirements = anchor(obj);

// Unvalidated data from the user
var userData = {
  'name': 'Elvis',
  // 'avatar': {
  //   'path': '/tmp/2Gf8ahagjg42.jpg',
  //   'name': '2Gf8ahagjg42.jpg',
  //   'size': 382944,
  //   'type': 'image/jpeg'
  // }
};

// Verify that the userData at least contains your requirements
// It can have EXTRA keys, but it MUST have the keys you specify
console.log(anchor(userData).to(requirements));
var users = [];

var assinar = function(user) {
	users.push(user);
	console.log("novo usuario cadastrado: " + user.username);
	console.log("usuarios totais: " + users.length);
};

var cancelar = function(user) {
	users = users.filter(function(u) {
		return u.id != user.id;
	});
	console.log("removendo usuario: " + user.username);
	console.log("usuarios totais: " + users.length);
};

var getUsers = function() {
	return users;
}

module.exports = {
	assinar: assinar,
	cancelar: cancelar,
	usuarios: getUsers,
}
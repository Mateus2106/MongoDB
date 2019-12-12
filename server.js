var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/listaRegistros');

var Schema = mongoose.Schema;

var RegistroSchema = new Schema({
	nome: String,
	cpf: String,
	rg: String,
	idade: String,
	cidade: String
});

mongoose.model('Registro', RegistroSchema);

var Registro = mongoose.model('Registro');

var app = express();

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

app.get('/api/registros', function(req, res) {
	Registro.find(function(err, docs) {
		docs.forEach(function(item) {
			console.log("Recebido uma requisição GET para o id: " + item._id);
		})
		res.send(docs);
	});
});

app.post('/api/registros', function(req, res) {
	console.log('Recebido uma requisição POST:')
	for (var key in req.body) {
		console.log(key + ': ' + req.body[key]);
	}
	var registro = new Registro(req.body);
	registro.save(function(err, doc) {
		res.send(doc);
	});
});

app.delete('/api/registros/:id', function(req, res) {
	console.log('Recebido uma requisição DELETE para o id: ' + req.params.id);
	Registro.remove({_id: req.params.id}, function(err, doc) {
		res.send({_id: req.params.id});
	});
});

app.put('/api/registros/:id', function(req, res) {
	console.log('Recebido uma requisição UPDATE para o id: ' + req.params.id);
	Registro.update({_id: req.params.id}, req.body, function(err) {
		res.send({_id: req.params.id});
	});
});

var port = 3000;

app.listen(port);
console.log('server hospedado em ' + port);
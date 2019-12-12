Backbone.Model.prototype.idAttribute = '_id';

var Registro = Backbone.Model.extend({
	defaults: {
		nome: '',
		cpf: '',
		rg: '',
		idade: '',
		cidade: ''
	}
});

var Registros = Backbone.Collection.extend({
	url: 'http://localhost:3000/api/registros'
});

var registros = new Registros();

var RegistroView = Backbone.View.extend({
	model: new Registro(),
	tagName: 'tr',
	initialize: function() {
		this.template = _.template($('.registros-list-template').html());
	},
	events: {
		'click .edit-registro': 'edit',
		'click .update-registro': 'update',
		'click .cancel': 'cancel',
		'click .delete-registro': 'delete'
	},
	edit: function() {
		$('.edit-registro').hide();
		$('.delete-registro').hide();
		this.$('.update-registro').show();
		this.$('.cancel').show();

		var nome = this.$('.nome').html();
		var cpf = this.$('.cpf').html();
		var rg = this.$('.rg').html();
		var idade = this.$('.idade').html();
		var cidade = this.$('.cidade').html();

		this.$('.nome').html('<input type="text" class="form-control nome-update" value="' + nome + '">');
		this.$('.cpf').html('<input type="text" class="form-control cpf-update" value="' + cpf + '">');
		this.$('.rg').html('<input type="text" class="form-control rg-update" value="' + rg + '">');
		this.$('.idade').html('<input type="text" class="form-control idade-update" value="' + idade + '">');
		this.$('.cidade').html('<input type="text" class="form-control cidade-update" value="' + cidade + '">');
	},
	update: function() {
		this.model.set('nome', $('.nome-update').val());
		this.model.set('cpf', $('.cpf-update').val());
		this.model.set('rg', $('.rg-update').val());
		this.model.set('idade', $('.idade-update').val());
		this.model.set('cidade', $('.cidade-update').val());

		this.model.save(null, {
			success: function(response) {
				console.log('Sucesso ao atualizar o registro com o id: ' + response.toJSON()._id);
			},
			error: function(err) {
				console.log('Falha ao atualizar o registro!');
			}
		});
	},
	cancel: function() {
		registrosView.render();
	},
	delete: function() {
		this.model.destroy({
			success: function(response) {
				console.log('Sucesso ao deletar o registro com o id: ' + response.toJSON()._id);
			},
			error: function(err) {
				console.log('Falha ao deletar o registro!');
			}
		});
	},
	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	}
});

var RegistrosView = Backbone.View.extend({
	model: registros,
	el: $('.registros-list'),
	initialize: function() {
		var self = this;
		this.model.on('add', this.render, this);
		this.model.on('change', function() {
			setTimeout(function() {
				self.render();
			}, 30);
		},this);
		this.model.on('remove', this.render, this);

		this.model.fetch({
			success: function(response) {
				_.each(response.toJSON(), function(item) {
					console.log('Sucesso ao pegar o registro com o id: ' + item._id);
				})
			},
			error: function() {
				console.log('Falha ao pegar o registro!');
			}
		});
	},
	render: function() {
		var self = this;
		this.$el.html('');
		_.each(this.model.toArray(), function(registro) {
			self.$el.append((new RegistroView({model: registro})).render().$el);
		});
		return this;
	}
});

var registrosView = new RegistrosView();

$(document).ready(function() {
	$('.add-registro').on('click', function() {
		var registro = new Registro({
			nome: $('.nome-input').val(),
			cpf: $('.cpf-input').val(),
			rg: $('.rg-input').val(),
			idade: $('.idade-input').val(),
			cidade: $('.cidade-input').val()
		});
		$('.nome-input').val('');
		$('.cpf-input').val('');
		$('.rg-input').val('');
		$('.idade-input').val('');
		$('.cidade-input').val('');
		registros.add(registro);
		registro.save(null, {
			success: function(response) {
				console.log('Sucesso ao salvar o registro com o id: ' + response.toJSON()._id);
			},
			error: function() {
				console.log('Falha ao salvar o registro!');
			}
		});
	});
})
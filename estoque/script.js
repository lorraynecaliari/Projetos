document.getElementById('form').addEventListener('submit', adicionarProduto);

function adicionarProduto(e){
	var nome = document.getElementById('nome').value;
	var qtd = document.getElementById('qtd').value;
	var valor = document.getElementById('valor').value;

	if(!nome && !qtd && !valor){
		
		alert("Preencha todos os campos!");
		return false;
	} 

	//array
	produto = {
		nome: nome,
		qtd: qtd,
		valor: valor
	};

	//localStorage.setItem('teste','teste1'); - armazenar dados no navegador
	//console.log(localStorage.getItem('teste')) - retorna o valor

	if(localStorage.getItem('armazena') === null){
		var produtos = [];
		produtos.push(produto);
		localStorage.setItem('armazena', JSON.stringify(produtos));
	} else {
		var produtos = JSON.parse(localStorage.getItem('armazena'));
		produtos.push(produto);
		localStorage.setItem('armazena', JSON.stringify(produtos));
	}

	document.getElementById('form').reset();

	mostraProduto();

	e.preventDefault();
}

function removeProduto(nome){
	if(confirm("Deseja deletar o produto " + nome)){ //pergunta para o usuario
	var armazena = JSON.parse(localStorage.getItem('armazena'));
	console.log(armazena);

	 for(var i = 0 ; i < armazena.length; i++){
		if(armazena[i].nome == nome){
			armazena.splice(i, 1);
		}
	}

	localStorage.setItem('armazena', JSON.stringify(armazena));

	mostraProduto();
	}
}

function editaProduto(qtd){

}

function pesquisarProduto(nome){

}

function mostraProduto(){
	var produtos = JSON.parse(localStorage.getItem('armazena'));
	var armResultado = document.getElementById('resultado');

	armResultado.innerHTML = ''; //mostrar na tabela

	for(var i = 0; i < produtos.length; i++){
		var nome = produtos[i].nome;
		var qtd = produtos[i].qtd;
		var valor = produtos[i].valor;

		armResultado.innerHTML += '<tr><td>'+ nome + '</td>'+
		 			'<td>'+ qtd + '</td>' +
		 			'<td>'+ valor + '</td>' +
		 			'<td><button onclick="removeProduto(\''+ nome +'\')" class="btnRem">Remover</button>'+ 
					'<button onclick="editaProduto(\''+ qtd +'\')" class="btnEdt">Atualizar</button></td>'+
		 			'</tr>';
	}
}

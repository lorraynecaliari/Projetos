class Produto{

	constructor(){
		this.id = 1;
		this.arrayProdutos = [];
		this.editId = null;
	}

	salvar(){
		let produto = this.lerDados();

		if(this.validar(produto)){
			if(this.editId == null){
				this.adicionar(produto);
			}else{
			this.atualizar(this.editId, produto);
		}
	}

		this.listaTabela();
		this.cancelar();
	}

	listaTabela(){
		let saida = document.getElementById('saida');
		saida.innerText = '';

		for(let i = 0; i < this.arrayProdutos.length; i++){
			//adicionar linha
			let tr = saida.insertRow();

			//adicionar coluna
			let td_id= tr.insertCell();
			let td_produto= tr.insertCell();
			let td_qtd= tr.insertCell();
			let td_valor= tr.insertCell();
			let td_acao= tr.insertCell();

			//adiconar dados na coluna
			td_id.innerText = this.arrayProdutos[i].id;
			td_produto.innerText = this.arrayProdutos[i].nomeProduto;
			td_qtd.innerText = this.arrayProdutos[i].qtd;
			td_valor.innerText = this.arrayProdutos[i].valor;

			//botão editar
			let btnEdit = document.createElement('button');
			btnEdit.innerHTML = "Editar";
            btnEdit.setAttribute("onclick", "produto.editar("+ JSON.stringify(this.arrayProdutos[i]) +")");

			//botão deletar
			let btnDelete = document.createElement('button');
			btnDelete.innerHTML = "Deletar";
			btnDelete.setAttribute("onclick", "produto.deletar("+ this.arrayProdutos[i].id +")");

			td_acao.appendChild(btnEdit);
            td_acao.appendChild(btnDelete);
            
            //estilizar o btn
            btnEdit.style.backgroundColor = "#008CBA";
            btnEdit.style.color = "white";
            btnEdit.style.border = "none";
            btnEdit.style.padding = "12px 16px";
            btnEdit.style.cursor = "pointer";
            btnEdit.style.marginRight = "4px";

            btnDelete.style.backgroundColor = "#f44336";
            btnDelete.style.color = "white";
            btnDelete.style.border = "none";
            btnDelete.style.padding = "12px 16px";
            btnDelete.style.cursor = "pointer";

		}
	}

	adicionar(produto){
		produto.qtd = parseFloat(produto.qtd);
		produto.valor = parseFloat(produto.valor);
		//adicionar elementos no array
		this.arrayProdutos.push(produto);
		this.id++;
	}

	atualizar(id, produto){
		for(let i = 0; i < this.arrayProdutos.length; i++){
			if(this.arrayProdutos[i].id == id){
				this.arrayProdutos[i].nomeProduto = produto.nomeProduto;
				this.arrayProdutos[i].qtd = produto.qtd;
				this.arrayProdutos[i].valor = produto.valor;
			}
		}
	}

	editar(dados){
		this.editId = dados.id;

		document.getElementById('produto').value = dados.nomeProduto;	
		document.getElementById('qtd').value = dados.qtd;
		document.getElementById('valor').value = dados.valor;

		//mudar botao para atualizar
		document.getElementById('btn').innerText = 'Atualizar';
	}

	lerDados(){
		let produto ={}

		produto.id = this.id;
		produto.nomeProduto = document.getElementById('produto').value;
		produto.qtd = document.getElementById('qtd').value;
		produto.valor = document.getElementById('valor').value;

		return produto;
	}

	validar(produto){
		let msg = '';

		if(produto.nomeProduto == ''){
			msg += 'Informe o nome do produto \n';
		}

		if(produto.valor == ''){
			msg += 'Informe o valor do produto \n';
		}

		if(produto.qtd == ''){
			msg += 'Informe a quantidade do produto \n';
		}

		if(msg != ''){
			alert(msg);
			return false
		}
		return true;
	}

	cancelar(){
		document.getElementById('produto').value = '';
		document.getElementById('qtd').value = '';
		document.getElementById('valor').value = '';

		document.getElementById('btn').innerText = 'Salvar';
		this.editId = null;
	}

	deletar(id){
		if(confirm('Deseja deletar o produto ' + id)){
		let saida = document.getElementById('saida');

		for(let i = 0; i < this.arrayProdutos.length; i++){
			if(this.arrayProdutos[i].id == id){
				this.arrayProdutos.splice(i,1);
				saida.deleteRow(i);
			}
		}
	}
}
}

var produto = new Produto();

document.addEventListener("DOMContentLoaded", function() {

    function mostrarErro(mensagem, detalhes) {
        const errorMessage = document.getElementById('error-message');
        errorMessage.innerHTML = ''; // Limpa o conteúdo existente

        const errorText = document.createElement('p');
        errorText.textContent = mensagem;
        errorMessage.appendChild(errorText);

        if (detalhes) {
            const detailsList = document.createElement('ul');
            for (const [key, messages] of Object.entries(detalhes)) {
                messages.forEach(msg => {
                    const listItem = document.createElement('li');
                    listItem.textContent = `${key}: ${msg}`;
                    detailsList.appendChild(listItem);
                });
            }
            errorMessage.appendChild(detailsList);
        }

        errorMessage.classList.remove('d-none');
    }

    function listarVendas(status = '') {
        obterToken(function(accessToken) {
            const headers = new Headers();
            headers.append('Authorization', 'Bearer ' + accessToken);
            headers.append('Cache-Control', 'no-cache'); // Indica ao navegador para não armazenar em cache a resposta

            let url = 'https://api-celcash.celcoin.com.br/v2/charges?startAt=0&limit=100';
            if (status) {
                url += `&status=${status}`;
            }

            fetch(url, {
                method: 'GET',
                headers: headers
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(error => {
                        throw new Error(JSON.stringify(error));
                    });
                }
                return response.json();
            })
            .then(data => {
                console.log("Resposta da API:", data); // Mostra a resposta da API no console

                const charges = data.Charges;
                const totalVendas = data.totalQtdFoundInPage;

                const tbody = document.querySelector('table tbody');
                tbody.innerHTML = ''; // Limpa o conteúdo existente

                const totalVendasElement = document.getElementById('totalVendas');
                totalVendasElement.textContent = `Vendas encontradas: ${totalVendas}`;

                const noSalesAlert = document.getElementById('no-sales-alert');
                const errorMessage = document.getElementById('error-message');

                if (totalVendas === 0) {
                    noSalesAlert.classList.remove('d-none');
                } else {
                    noSalesAlert.classList.add('d-none');
                }

                // Esconde a mensagem de erro ao listar com sucesso
                errorMessage.classList.add('d-none');

                charges.forEach(charges => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <th scope="row">${charges.galaxPayId || ''}</th>
                        <td>${charges.Customer.name || ''}</td>
                        <td>${charges.Customer.document || ''}</td>
                        <td>${formatarValorParaReais(charges.value) || ''}</td>
                        <td>${charges.mainPaymentMethodId || ''}</td>
                        <td>${charges.status || ''}</td>
                        <td>
                            <button class="btn btn-info btn-sm details-btn">Detalhes</button>
                            <button class="btn btn-danger btn-sm delete-btn">Cancelar</button>
                        </td>
                    `;

                    // Adiciona eventos aos botões após a linha ser adicionada à tabela
                    tbody.appendChild(row);

                    // Evento para botão de detalhes
                    row.querySelector('.details-btn').addEventListener('click', () => {
                        const paymentLink = charges.paymentLink || '';
                        if (paymentLink) {
                            window.location.href = paymentLink;
                        } else {
                            alert('Link de pagamento não encontrado.');
                        }
                    });

                    // Evento para botão de excluir
                    row.querySelector('.delete-btn').addEventListener('click', () => {
                        const galaxPayId = charges.galaxPayId || '';
                        const nomeCliente = charges.Customer.name || '';
                        confirmarExclusaoVenda(galaxPayId, nomeCliente, row);
                    });
                });
            })
            .catch(error => {
                try {
                    const errorData = JSON.parse(error.message);
                    mostrarErro('Erro ao buscar dados das Vendas: ' + (errorData.error.message || 'Erro desconhecido'), errorData.error.details);
                } catch (e) {
                    mostrarErro('Erro ao buscar dados das Vendas: ' + error.message);
                }
            });
        });
    }

    function excluirVenda(galaxPayId, accessToken, row) {
        fetch(`https://api-celcash.celcoin.com.br/v2/charges/${galaxPayId}/galaxPayId`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(error => {
                    throw new Error(JSON.stringify(error));
                });
            }
            return response.json();
        })
        .then(data => {
            if (data.type === true) {
                alert('Venda cancelada com sucesso');
                // Após excluir a venda com sucesso, atualize a listagem de vendas
                listarVendas();
            } else {
                throw new Error('Erro ao excluir Venda');
            }
        })
        .catch(error => {
            try {
                const errorData = JSON.parse(error.message);
                mostrarErro('Erro ao excluir venda: ' + (errorData.error.message || 'Erro desconhecido'), errorData.error.details);
            } catch (e) {
                mostrarErro('Erro ao excluir venda: ' + error.message);
            }
        });
    }

    function confirmarExclusaoVenda(galaxPayId, nomeCliente, row) {
        const confirmacao = confirm(`Tem certeza de que deseja cancelar a venda "${galaxPayId}" do cliente "${nomeCliente}"?`);

        if (confirmacao) {
            obterToken(function(accessToken) {
                excluirVenda(galaxPayId, accessToken, row);
            });
        } else {
            // Se o usuário cancelar a exclusão, atualize a lista de vendas
            listarVendas();
        }
    }

    function formatarValorParaReais(valorEmCentavos) {
        const valorEmReais = valorEmCentavos / 100; // Convertendo centavos para reais
        return valorEmReais.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    // Adicionar evento de mudança ao dropdown de filtro
    const statusFilter = document.getElementById('statusFilter');
    statusFilter.addEventListener('change', function() {
        const status = this.value;
        listarVendas(status);
    });

       // Função genérica para filtrar 
   function filtrar(inputValue, coluna) {
    const linhas = document.querySelectorAll('table tbody tr');

    linhas.forEach(linha => {
        const valorCliente = linha.querySelector(`td:nth-child(${coluna})`) || linha.querySelector('th');
        const valorTexto = valorCliente.textContent.trim().toLowerCase();
        if (valorTexto.includes(inputValue)) {
            linha.style.display = ''; // Exibe a linha se o valor do cliente corresponder
        } else {
            linha.style.display = 'none'; // Oculta a linha se o valor do cliente não corresponder
        }
    });
}

    document.getElementById('galaxPayId').addEventListener('input', function() {
        const codigo = this.value.trim().toLowerCase();
        filtrar(codigo, 1);
    });

    document.getElementById('nomeCliente').addEventListener('input', function() {
        const nome = this.value.trim().toLowerCase();
        filtrar(nome, 2);
    });
    
    document.getElementById('documentoCliente').addEventListener('input', function() {
        const documento = this.value.trim().toLowerCase();
        filtrar(documento, 3);
    });
    
    document.getElementById('valorVenda').addEventListener('input', function() {
        const valor = this.value.trim().toLowerCase();
        filtrar(valor, 4);
    });

    document.getElementById('statusFilterPayment').addEventListener('change', function() {
        const metodoPagamento = this.value.trim().toLowerCase();
        filtrar(metodoPagamento, 5);
    });

    // Obter o token e listar vendas automaticamente ao carregar a página sem filtro de status
    obterToken(() => listarVendas(''));
});

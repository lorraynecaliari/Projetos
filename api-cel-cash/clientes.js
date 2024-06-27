document.addEventListener("DOMContentLoaded", function() {

    // Função para exibir mensagens de erro
    function mostrarErro(mensagem, detalhes) {
        const errorMessage = document.getElementById('error-message');
        errorMessage.innerHTML = mensagem;
    
        if (detalhes) {
            const detailsList = document.createElement('ul');
            if (Array.isArray(detalhes)) {
                detalhes.forEach(msg => {
                    const listItem = document.createElement('li');
                    listItem.textContent = msg;
                    detailsList.appendChild(listItem);
                });
            } else if (typeof detalhes === 'object') {
                for (const [key, value] of Object.entries(detalhes)) {
                    const listItem = document.createElement('li');
                    listItem.textContent = `${key}: ${value}`;
                    detailsList.appendChild(listItem);
                }
            } else {
                const listItem = document.createElement('li');
                listItem.textContent = detalhes;
                detailsList.appendChild(listItem);
            }
            errorMessage.appendChild(detailsList);
        }
    
        // Exibe a mensagem de erro na interface
        errorMessage.classList.remove('d-none');

        // Define um temporizador para ocultar a mensagem após 1 minuto (60000 milissegundos)
    setTimeout(() => {
        errorMessage.classList.add('d-none');
    }, 40000);
    }

    // Função para listar clientes
    function listarClientes() {
        obterToken(function(accessToken) {
            const headers = new Headers();
            headers.append('Authorization', 'Bearer ' + accessToken);
            headers.append('Cache-Control', 'no-cache'); // Indica ao navegador para não armazenar em cache a resposta
            
            fetch('https://api-celcash.celcoin.com.br/v2/customers?startAt=0&limit=100', {
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
    
                const customers = data.Customers;
                const totalClientes = data.totalQtdFoundInPage;
    
                if (!customers || !Array.isArray(customers)) {
                    throw new Error('Dados dos clientes não encontrados na resposta da API');
                }
    
                const tbody = document.querySelector('table tbody');
                tbody.innerHTML = ''; // Limpa o conteúdo existente
    
                const totalClientesElement = document.getElementById('totalClientes');
                totalClientesElement.textContent = `Clientes encontrados: ${totalClientes}`;
    
                customers.forEach(customer => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <th scope="row">${customer.galaxPayId || ''}</th>
                        <td>${customer.name || ''}</td>
                        <td>${customer.document || ''}</td>
                        <td>${customer.emails ? customer.emails.join(', ') : ''}</td>
                        <td>${customer.phones ? customer.phones.join(', ') : ''}</td>
                        <td>
                            <button class="btn btn-info btn-sm details-btn">Detalhes</button>
                            <button class="btn btn-danger btn-sm delete-btn">Excluir</button>
                        </td>
                    `;
                    
                    // Adiciona eventos aos botões após a linha ser adicionada à tabela
                    tbody.appendChild(row);
    
                    // Evento para botão de detalhes
                    row.querySelector('.details-btn').addEventListener('click', () => {
                        const params = new URLSearchParams({
                            galaxPayId: customer.galaxPayId || '',
                            name: customer.name || '',
                            document: customer.document || '',
                            emails: customer.emails ? customer.emails.join(',') : '',
                            phones: customer.phones ? customer.phones.join(',') : '',
                            zipCode: customer.Address?.zipCode || '',
                            street: customer.Address?.street || '',
                            number: customer.Address?.number || '',
                            complement: customer.Address?.complement || '',
                            neighborhood: customer.Address?.neighborhood || '',
                            city: customer.Address?.city || '',
                            state: customer.Address?.state || ''
                        }).toString();
    
                        window.location.href = `detalhescliente.html?${params}`;
                    });
    
                    // Evento para botão de excluir
                    row.querySelector('.delete-btn').addEventListener('click', () => {
                        const galaxPayId = customer.galaxPayId || '';
                        const nomeCliente = customer.name || '';
                        confirmarExclusaoCliente(galaxPayId, nomeCliente, row);
                    });
                });
            })
            .catch(error => {
                mostrarErro('Erro ao buscar dados dos clientes', [error.message]);
            });
        });
    }

    // Função para excluir cliente
    function excluirCliente(galaxPayId, accessToken, row) {
        fetch(`https://api-celcash.celcoin.com.br/v2/customers/${galaxPayId}/galaxPayId`, {
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
                // Exibe uma mensagem de sucesso no console
                console.log('O cliente foi excluído com sucesso.');
                // Exibe uma mensagem de sucesso na interface, se necessário
                alert('Cliente excluído com sucesso');
                // Chama a função para listar clientes novamente
                listarClientes();
            } else {
                // Exibe a mensagem de erro retornada pela API na interface
                const errorMessage = data.error ? data.error.message : 'Erro desconhecido ao excluir cliente.';
                mostrarErro('Alerta:', errorMessage);
                // Chama a função para listar clientes novamente
                listarClientes();
            }
        })
        .catch(error => {
            // Exibe uma mensagem de erro genérica na interface
            mostrarErro('Alerta:', error.message);
            // Chama a função para listar clientes novamente
            listarClientes();
        });
    }

    // Função para confirmar exclusão de cliente
    function confirmarExclusaoCliente(galaxPayId, nomeCliente, row) {
        const confirmacao = confirm(`Tem certeza de que deseja excluir o cliente "${nomeCliente}"?`);

        if (confirmacao) {
            obterToken(function(accessToken) {
                excluirCliente(galaxPayId, accessToken, row);
            });
        }
    }

   // Função genérica para filtrar clientes
   function filtrarClientes(inputValue, coluna) {
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

// Adiciona eventos de input aos campos de filtro
document.getElementById('nomeCliente').addEventListener('input', function() {
    const nome = this.value.trim().toLowerCase();
    filtrarClientes(nome, 2);
});

document.getElementById('galaxPayId').addEventListener('input', function() {
    const codigo = this.value.trim().toLowerCase();
    filtrarClientes(codigo, 1);
});

document.getElementById('documentoCliente').addEventListener('input', function() {
    const documento = this.value.trim().toLowerCase();
    filtrarClientes(documento, 3);
});

document.getElementById('emailCliente').addEventListener('input', function() {
    const email = this.value.trim().toLowerCase();
    filtrarClientes(email, 4);
});

document.getElementById('telefoneCliente').addEventListener('input', function() {
    const telefone = this.value.trim().toLowerCase();
    filtrarClientes(telefone, 5);
});

    // Obter o token e listar clientes automaticamente ao carregar a página
    obterToken(listarClientes);
});

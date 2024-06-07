document.addEventListener("DOMContentLoaded", function() {

    function mostrarErro(mensagem, detalhes) {
        const errorMessage = document.getElementById('error-message');
    
        if(errorMessage) { // Verifica se o elemento foi encontrado
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
        } else {
            console.error("Elemento de mensagem de erro não encontrado.");
        }
    }
    
    function listarAssinatura(status = '') {
        // Restante do seu código permanece o mesmo
        // Certifique-se de adicionar a lógica de verificação para o alerta de falta de assinaturas
    }
    
    // Adicionar evento de mudança ao dropdown de filtro
    const statusFilter = document.getElementById('statusFilter');
    statusFilter.addEventListener('change', function() {
        const status = this.value;
        listarAssinatura(status);
    });
    
    // Obter o token e listar assinaturas automaticamente ao carregar a página sem filtro de status
    obterToken(() => listarAssinatura(''));
    

    function listarAssinatura(status = '') {
        obterToken(function(accessToken) {
            const headers = new Headers();
            headers.append('Authorization', 'Bearer ' + accessToken);
            headers.append('Cache-Control', 'no-cache'); // Indica ao navegador para não armazenar em cache a resposta

            let url = 'https://api-celcash.celcoin.com.br/v2/subscriptions?startAt=0&limit=100';
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

                const subscriptions = data.Subscriptions;
                const totalAssinaturas = data.totalQtdFoundInPage;

                const tbody = document.querySelector('table tbody');
                tbody.innerHTML = ''; // Limpa o conteúdo existente

                const totalAssinaturasElement = document.getElementById('totalAssinaturas');
                totalAssinaturasElement.textContent = `Assinaturas encontradas: ${totalAssinaturas}`;

                const noSubscriptionsAlert = document.getElementById('no-subscriptions-alert');
                const errorMessage = document.getElementById('error-message');

                if (totalAssinaturas === 0) {
                    noSubscriptionsAlert.classList.remove('d-none');
                } else {
                    noSubscriptionsAlert.classList.add('d-none');
                }

                // Esconde a mensagem de erro ao listar com sucesso
                errorMessage.classList.add('d-none');

                subscriptions.forEach(subscriptions => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <th scope="row">${subscriptions.galaxPayId || ''}</th>
                        <td>${subscriptions.Customer.name || ''}</td>
                        <td>${subscriptions.Customer.document || ''}</td>
                        <td>${formatarValorParaReais(subscriptions.value) || ''}</td>
                        <td>${subscriptions.mainPaymentMethodId || ''}</td>
                        <td>${subscriptions.status || ''}</td>
                        <td>
                            <button class="btn btn-info btn-sm details-btn">Detalhes</button>
                            <button class="btn btn-danger btn-sm delete-btn">Cancelar</button>
                        </td>
                    `;

                    // Adiciona eventos aos botões após a linha ser adicionada à tabela
                    tbody.appendChild(row);

                    // Evento para botão de detalhes
                    row.querySelector('.details-btn').addEventListener('click', () => {
                        const paymentLink = subscriptions.paymentLink || '';
                        if (paymentLink) {
                            window.location.href = paymentLink;
                        } else {
                            alert('Link de pagamento não encontrado.');
                        }
                    });

                    // Evento para botão de excluir
                    row.querySelector('.delete-btn').addEventListener('click', () => {
                        const galaxPayId = subscriptions.galaxPayId || '';
                        const nomeCliente = subscriptions.Customer.name || '';
                        confirmarExclusaoAssinatura(galaxPayId, nomeCliente, row);
                    });
                });
            })
            .catch(error => {
                try {
                    const errorData = JSON.parse(error.message);
                    mostrarErro('Erro ao buscar dados das Assinaturas: ' + (errorData.error.message || 'Erro desconhecido'), errorData.error.details);
                } catch (e) {
                    mostrarErro('Erro ao buscar dados das Assinaturas: ' + error.message);
                }
            });
        });
    }

    function excluirAssinatura(galaxPayId, accessToken, row) {
        fetch(`https://api-celcash.celcoin.com.br/v2/subscriptions/${galaxPayId}/galaxPayId`, {
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
                alert('Assinatura cancelada com sucesso');
                // Após excluir a assinatura com sucesso, atualize a listagem de assinatura
                listarAssinatura();
            } else {
                throw new Error('Nenhuma assinatura encontrada para cancelar.');
            }
        })
        .catch(error => {
            try {
                const errorData = JSON.parse(error.message);
                mostrarErro('Erro ao excluir Assinatura: ' + (errorData.error.message || 'Erro desconhecido'), errorData.error.details);
            } catch (e) {
                mostrarErro('Erro ao excluir Assinatura: ' + error.message);
            }
        });
    }    

    function confirmarExclusaoAssinatura(galaxPayId, nomeCliente, row) {
        const confirmacao = confirm(`Tem certeza de que deseja cancelar a Assinatura "${galaxPayId}" do cliente "${nomeCliente}"?`);

        if (confirmacao) {
            obterToken(function(accessToken) {
                excluirAssinatura(galaxPayId, accessToken, row);
            });
        } else {
            // Se o usuário cancelar a exclusão, atualize a lista de assinaturas
            listarAssinatura();
        }
    }

    function formatarValorParaReais(valorEmCentavos) {
        const valorEmReais = valorEmCentavos / 100; // Convertendo centavos para reais
        return valorEmReais.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    document.getElementById('nomeCliente').addEventListener('input', function() {
        const nome = this.value.trim().toLowerCase();
        filtrarClientesPorNome(nome);
    });

    function filtrarClientesPorNome(nome) {
        const linhas = document.querySelectorAll('table tbody tr');
    
        linhas.forEach(linha => {
            const nomeCliente = linha.querySelector('td:nth-child(2)').textContent.trim().toLowerCase();
            if (nomeCliente.includes(nome)) {
                linha.style.display = ''; // Exibe a linha se o nome do cliente corresponder
            } else {
                linha.style.display = 'none'; // Oculta a linha se o nome do cliente não corresponder
            }
        });
    }

    // Obter o token e listar assinaturas automaticamente ao carregar a página sem filtro de status
    obterToken(() => listarAssinatura(''));
});

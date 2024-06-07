function cadastrarCliente() {

    var name = document.getElementById('name').value;
    var documentValue = document.getElementById('document').value;
    var emails = [document.getElementById('emails').value];
    var phones = [document.getElementById('phones').value];
    var zipCode = document.getElementById('zipCode').value;
    var street = document.getElementById('street').value;
    var numberAddress = document.getElementById('numberAddress').value;
    var complement = document.getElementById('complement').value;
    var neighborhood = document.getElementById('neighborhood').value;
    var city = document.getElementById('city').value;
    var state = document.getElementById('state').value;

    // Construir o objeto jsonData com os dados e o hash
    var jsonData = {
        name: name,
        document: documentValue,
        emails: emails,
        phones: phones,
        Address: {
            zipCode: zipCode,
            street: street,
            number: numberAddress,
            complement: complement,
            neighborhood: neighborhood,
            city: city,
            state: state
        }
    };

    obterToken(function(accessToken) {
        const headers = new Headers();
        headers.append('Authorization', 'Bearer ' + accessToken);
        headers.append('Cache-Control', 'no-cache'); // Indica ao navegador para não armazenar em cache a resposta

        fetch('https://api-celcash.celcoin.com.br/v2/customers', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(jsonData)
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
            
            if (data.type === true) {
                alert("Cliente cadastrado com sucesso!");
                window.location.href = "clientes.html"; // Redireciona para clientes.html
            }    
        })
        .catch(error => {
            console.error("Erro ao chamar a API:", error); // Trata o erro ao chamar a API
            const errorMessageDiv = document.getElementById("error-message");
            errorMessageDiv.textContent = "Erro ao cadastrar cliente: " + error.message;
            errorMessageDiv.style.display = "block"; // Exibe a mensagem de erro
        });
    });
}

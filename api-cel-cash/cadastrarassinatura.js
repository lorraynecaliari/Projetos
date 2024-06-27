function cadastrarAssinatura() {

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

    var value = parseFloat(document.getElementById('value').value);
    var quantity = document.getElementById('quantity').value;
    var periodicity = document.getElementById('periodicity').value;
    var firstPayDayDate = document.getElementById('firstPayDayDate').value;
    var mainPaymentMethodId = document.getElementById('mainPaymentMethodId').value;

    // Construir o objeto jsonData com os dados e o hash
    var jsonData = {
        value: value,
        quantity: quantity,
        periodicity: periodicity,
        firstPayDayDate: firstPayDayDate,
        mainPaymentMethodId: mainPaymentMethodId,
        Customer:{
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
    }
    };

    obterToken(function(accessToken) {
        const headers = new Headers();
        headers.append('Authorization', 'Bearer ' + accessToken);
        headers.append('Cache-Control', 'no-cache'); // Indica ao navegador para não armazenar em cache a resposta

        fetch('https://api-celcash.celcoin.com.br/v2/subscriptions', {
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
                alert("Assinatura cadastrada com sucesso!");
                window.location.href = "assinatura.html"; // Redireciona para assinatura.html
            }    
        })
        .catch(error => {
            console.error("Erro ao chamar a API:", error); // Trata o erro ao chamar a API
            const errorMessageDiv = document.getElementById("error-message");
            errorMessageDiv.textContent = "Erro ao cadastrar Assinatura: " + error.message;
            errorMessageDiv.style.display = "block"; // Exibe a mensagem de erro
        });
    });
}

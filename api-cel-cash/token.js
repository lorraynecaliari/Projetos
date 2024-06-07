function obterToken(callback) {
    var galaxId = "19786";
    var galaxHash = "AmWzSz7w2pV7LaWt47UuPtMd8aK6C3Au3h0kFaYk";
    var header = {
        "Authorization": "Basic " + btoa(galaxId + ":" + galaxHash)
    };

    var body = {
        "grant_type": "authorization_code",
        "scope": "customers.read customers.write plans.read plans.write transactions.read transactions.write webhooks.write cards.read cards.write card-brands.read subscriptions.read subscriptions.write charges.read charges.write boletos.read carnes.read payment-methods.read"
    };

    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                var chaves = JSON.parse(xhr.responseText);
                var accessToken = chaves.access_token;

                // Chama a função de callback passando o token para continuar o processo
                callback(accessToken);
            } else {
                try {
                    var errorResponse = JSON.parse(xhr.responseText);
                    mostrarErro("Erro ao obter token: " + (errorResponse.error.message || xhr.statusText), errorResponse.error.details);
                } catch (e) {
                    mostrarErro("Erro ao obter token: " + xhr.statusText);
                }
            }
        }
    };

    xhr.open("POST", "https://api-celcash.celcoin.com.br/v2/token", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", header.Authorization);

    var requestBody = JSON.stringify(body);

    // Envie a requisição após configurar o XMLHttpRequest
    xhr.send(requestBody);
}

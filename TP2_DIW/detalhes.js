function detalhes() {
    var query = location.search.slice(1);
    var partes = query.split('&');
    var valor;

    partes.forEach(function(parte) {
        var chaveValor = parte.split('=');
        valor = chaveValor[1];
    });

    fetch(`https://diwserver.vps.webdock.cloud/products/${valor}`)
        .then(response => response.json())
        .then(product => {
            const productsContainer = document.getElementById('tela_detalhes');

            productsContainer.className = 'product';
            productsContainer.innerHTML = `
              <img src="${product.image}" style="max-width:180px;" alt="${product.title}">
              <h3>${product.title}</h3>
              <p>Gênero: ${product.gender}</p>
              <p>Cor: ${product.baseColour}</p>
              <p>${product.description}</p>
            `;
        })
}

detalhes();

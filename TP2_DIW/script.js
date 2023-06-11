function fetchProducts() {
    fetch('https://diwserver.vps.webdock.cloud/products?page=1&page_items=100')
        .then(response => response.json())
        .then(data => {

            const productsContainer = document.getElementById('productList');
            let products = data.products; // Variável para armazenar todos os produtos

            function displayProducts(products) {
                productsContainer.innerHTML = ''; // Limpa o conteúdo atual

                products.forEach((product, index) => {
                    const productElement = document.createElement('div');
                    productElement.className = 'product';
                    productElement.innerHTML = `
                        <img src="${product.image}" style="max-width:180px;" alt="${product.title}">
                        <h3>${product.title}</h3>
                        <p>${product.brandName} - ${product.category}</p>
                        <p>R$ ${product.price}</p>
                        <a class="btn btn-dark" href="detalhes.html?id=${product.id}">Detalhes</a>
                    `;
                    productsContainer.appendChild(productElement);

                    if ((index + 1) % 3 === 0) {
                        productsContainer.appendChild(document.createElement('br'));
                    }
                });
            }

            function searchProducts(searchTerm) {
                const filteredProducts = products.filter(product =>
                    product.title.toLowerCase().includes(searchTerm.toLowerCase())
                );
                displayProducts(filteredProducts);
            }

            function filterProductsByCategory(category) {
                const filteredProducts = products.filter(product =>
                    product.category.toLowerCase() === category.toLowerCase()
                );
                displayProducts(filteredProducts);
            }

            displayProducts(products);

            const dropdownItems = document.querySelectorAll('.dropdown-item');
            dropdownItems.forEach(item => {
                item.addEventListener('click', event => {
                    event.preventDefault();
                    const selectedCategory = item.textContent.trim();
                    filterProductsByCategory(selectedCategory);
                });
            });

            const searchInput = document.getElementById('searchInput');
            searchInput.addEventListener('input', () => {
                const searchTerm = searchInput.value;
                searchProducts(searchTerm);
            });
        })
}

fetchProducts();

//const socket = io()

//socket.emit('message', 'soy el mensaje enviadoo')

const socket = io(); // Conectar al servidor WebSocket

socket.on('connect', () => {
    console.log('Connected to server');
});

// socket.on('newProduct', (product) => {
//     console.log('New product added:', product);
//     io.emit('newProduct', product); // Emitir el evento con los datos del producto
// });

socket.on('newProduct', (product) => {
    console.log('New product added:', product);

    // Crear un elemento <li> con los datos completos del producto
    const productItem = document.createElement('li');
    productItem.innerHTML = `
        <h2>${product.title}</h2>
        <p>Description: ${product.description}</p>
        <p>Code: ${product.code}</p>
        <p>Price: $${product.price}</p>
        <p>Stock: ${product.stock}</p>
        <p>Category: ${product.category}</p>
        <div>
            ${product.thumbnails.map((thumbnail) => `<img src="${thumbnail}" alt="Thumbnail" width="100" />`).join('')}
        </div>
    `;
    // Agregar el elemento al <ul> con id "products"
    const productsList = document.getElementById('products');
    productsList.appendChild(productItem);
});
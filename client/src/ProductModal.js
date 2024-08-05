import React from 'react';
import Swal from 'sweetalert2';

function ProductModal({ setProducts }) {
    const handleAddProductClick = () => {
        Swal.fire({
            title: 'Agregar Producto',
            html: `
        <form id="productForm">
            <div class="form-group">
                <label for="title">Title</label>
                <input type="text" class="form-control" id="title" required>
            </div>
            <div class="form-group">
                <label for="description">Description</label>
                <input type="text" class="form-control" id="description" required>
            </div>
            <div class="form-group">
                <label for="price">Price</label>
                <input type="number" class="form-control" id="price" required>
            </div>
            <div class="form-group">
                <label for="code">Code</label>
                <input type="text" class="form-control" id="code" required>
            </div>
            <div class="form-group">
                <label for="stock">Stock</label>
                <input type="number" class="form-control" id="stock" required>
            </div>
            <div class="form-group">
                <label for="category">Category</label>
                <input type="text" class="form-control" id="category" required>
            </div>
        </form>
      `,
            showCancelButton: true,
            confirmButtonText: 'Guardar',
            cancelButtonText: 'Cancelar',
            focusConfirm: false,
            preConfirm: () => {
                const title = document.getElementById('title').value;
                const description = document.getElementById('description').value;
                const price = document.getElementById('price').value;
                const code = document.getElementById('code').value;
                const stock = document.getElementById('stock').value;
                const category = document.getElementById('category').value;

                if (!title || !description || !price || !code || !stock || !category) {
                    Swal.showValidationMessage('Todos los campos son obligatorios');
                    return false;
                }

                return {
                    title,
                    description,
                    price,
                    code,
                    stock,
                    category
                };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                fetch('/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(result.value)
                })
                    .then(response => response.json())
                    .then(data => {
                        setProducts(prevProducts => [...prevProducts, data.product]);
                        Swal.fire('Producto agregado', '', 'success');
                    })
                    .catch(error => {
                        Swal.fire('Error al agregar el producto', '', 'error');
                    });
            }
        });
    };

    return (
        <button onClick={handleAddProductClick} className="btn btn-primary mb-4">Agregar Producto</button>
    );
}

export default ProductModal;

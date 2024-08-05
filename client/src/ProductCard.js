import React from 'react';

function ProductCard({ product }) {
    return (
        <div className="card mb-4">
            <div className="card-body">
                <h5 className="card-title">{product.title}</h5>
                <p className="card-text">{product.description}</p>
                <p className="card-text">Price: ${product.price}</p>
                <p className="card-text">Category: {product.category}</p>
                <p className="card-text">Stock: {product.stock}</p>
            </div>
        </div>
    );
}

export default ProductCard;

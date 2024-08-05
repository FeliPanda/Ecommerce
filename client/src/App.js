// // App.js
// import React from 'react';
// import './App.css';
// import ProductModal from './ProductModal'; // Asegúrate de que la ruta sea correcta

// function App() {
//   return (
//     <div className="App">
//       <div className="container">
//         <h1 className="my-4">Add Product</h1>
//         <ProductModal />
//       </div>
//     </div>
//   );
// }

// export default App;

import React, { useEffect, useState } from 'react';
import './App.css';
import ProductList from './ProductList.js';
import ProductModal from './ProductModal.js';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('/')
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  return (
    <div className="App">
      <div className="container">
        <h1 className="my-4">Products</h1>
        <ProductModal setProducts={setProducts} />
        <ProductList products={products} />
      </div>
    </div>
  );
}

export default App;

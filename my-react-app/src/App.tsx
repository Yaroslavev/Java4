import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ProductsPage from "./pages/ProductsPage.tsx";
import CreateProductPage from "./pages/CreateProductPage.tsx";
import EditProductPage from "./pages/EditProductPage.tsx";

const App: React.FC = () => (
    <Router>
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="products" >
                    <Route index element={<ProductsPage />} />
                    <Route path="create" element={<CreateProductPage />} />
                    <Route path="edit/:id" element={<EditProductPage />} />
                </Route>
            </Route>
        </Routes>
    </Router>
);

export default App;
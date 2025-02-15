import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ProductsPage from "./pages/ProductsPage.tsx";
import CreateProductPage from "./pages/CreateProductPage.tsx";
import EditProductPage from "./pages/EditProductPage.tsx";
import CategoriesPage from "./pages/CategoriesPage.tsx";
import CreateCategoryPage from "./pages/CreateCategoryPage.tsx";
import EditCategoryPage from "./pages/EditCategoryPage.tsx";

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
                <Route path="categories">
                    <Route index element={<CategoriesPage />} />
                    <Route path="create" element={<CreateCategoryPage />} />
                    <Route path="edit/:id" element={<EditCategoryPage />} />
                </Route>
            </Route>
        </Routes>
    </Router>
);

export default App;
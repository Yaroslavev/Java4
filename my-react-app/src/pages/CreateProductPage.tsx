import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {ProductCreate} from "../models/Product.ts";
import {useCreateProductMutation} from "../service/ProductsApi.ts";

const CreateProductPage: React.FC = () => {
    const [product, setProduct] = useState<ProductCreate>({
        name: '',
        cost: 0,
        categoryId: 0,
        image: null,
    });

    const [createProduct, { isLoading, error }] = useCreateProductMutation();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Створення об'єкта FormData
        const formData = new FormData();
        formData.append('name', product.name);
        formData.append('cost', product.cost);
        formData.append('categoryId', product.categoryId);
        if (product.image) {
            formData.append('image', product.image);
        }

        try {
            // Викликаємо мутацію для створення категорії
            await createProduct(formData).unwrap();
            navigate(`..`); // Перехід до нової категорії
        } catch (err) {
            console.error('Error creating product:', err);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProduct((prevProduct) => ({
            ...prevProduct,
            [name]: value,
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const file = e.target.files[0];
            setProduct((prevProduct) => ({
                ...prevProduct,
                image: file,
            }));
        }
    };

    return (
        <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Create Product</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700" htmlFor="name">
                        Product Name
                    </label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        value={product.name}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded mt-2"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700" htmlFor="cost">
                        Cost
                    </label>
                    <input type="number"
                           id="cost"
                           name="cost"
                           value={product.cost}
                           onChange={handleChange}
                           className="w-full p-2 border border-gray-300 rounded mt-2"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700" htmlFor="categoryId">
                        Category
                    </label>
                    <input
                        id="categoryId"
                        name="categoryId"
                        type="number"
                        value={product.categoryId}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded mt-2"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700" htmlFor="image">
                        Product Image
                    </label>
                    <input
                        id="image"
                        name="image"
                        type="file"
                        onChange={handleFileChange}
                        className="w-full p-2 border border-gray-300 rounded mt-2"
                    />
                </div>

                <div className="flex justify-center">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-blue-500 text-white p-2 rounded w-full md:w-1/2 mt-4"
                    >
                        {isLoading ? 'Creating...' : 'Create Product'}
                    </button>
                </div>

                {error && <p className="text-red-500 mt-2">Error creating product!</p>}
            </form>
        </div>
    );
};

export default CreateProductPage;
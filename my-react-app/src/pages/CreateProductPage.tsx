import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {Form, Input, InputNumber, Select, Upload} from 'antd';
import { ProductCreate } from '../models/Product.ts';
import { useCreateProductMutation } from '../service/ProductsApi.ts';
import { useGetAllCategoriesQuery } from '../service/CategoriesApi.ts';
import { PlusOutlined } from '@ant-design/icons';
import { DndContext, closestCenter, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableImage: React.FC<{ preview: string; index: number; onRemove: (index: number) => void }> = ({ preview, index, onRemove }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: `${index}-${preview}` });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="relative m-1 border border-gray-300 rounded"
        >
            <img
                src={preview}
                alt={`Preview ${index}`}
                className="m-1 max-h-[100px] rounded cursor-move hover:filter hover:brightness-75 transition duration-200"
                onClick={() => onRemove(index)}
            />
        </div>
    );
};

const CreateProductPage: React.FC = () => {
    const [product, setProduct] = useState<ProductCreate>({
        name: '',
        cost: 0,
        categoryId: 1,
        images: [],
    });

    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const { data: categories, isLoading: isCategoriesLoading, error: categoriesError } = useGetAllCategoriesQuery();
    const [createProduct, { isLoading: isCreateLoading, error: createError }] = useCreateProductMutation();
    const navigate = useNavigate();
    const [form] = Form.useForm<ProductCreate>();

    const categoriesForm = categories?.map(item => ({
        label: item.name,
        value: item.id,
    }));

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    useEffect(() => {
        return () => {
            imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
        };
    }, [imagePreviews]);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            const formData = new FormData();
            formData.append('name', values.name);
            formData.append('cost', values.cost.toString());
            formData.append('categoryId', values.categoryId.toString());
            product.images.forEach((file) => formData.append('images', file));

            await createProduct(formData).unwrap();
            navigate('..');
        } catch (err) {
            console.error('Error creating product:', err);
        }
    };

    const handleFileChange = ({ fileList }: { fileList: any[] }) => {
        const newFiles = fileList.map((file) => file.originFileObj).filter(Boolean);
        setProduct((prevProduct) => ({
            ...prevProduct,
            images: [...prevProduct.images, ...newFiles], // Додаємо нові файли до існуючих
        }));
        setImagePreviews((prevPreviews) => [
            ...prevPreviews,
            ...newFiles.map((file) => URL.createObjectURL(file)), // Додаємо нові прев’ю до існуючих
        ]);
    };

    const handleRemoveImage = (index: number) => {
        setProduct((prevProduct) => ({
            ...prevProduct,
            images: prevProduct.images.filter((_, i) => i !== index),
        }));
        setImagePreviews((prevPreviews) => {
            const newPreviews = prevPreviews.filter((_, i) => i !== index);
            URL.revokeObjectURL(prevPreviews[index]);
            return newPreviews;
        });
    };

    const handleDragEnd = (event: any) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            const oldIndex = imagePreviews.findIndex((_, i) => `${i}-${imagePreviews[i]}` === active.id);
            const newIndex = imagePreviews.findIndex((_, i) => `${i}-${imagePreviews[i]}` === over.id);

            const newImages = [...product.images];
            const newPreviews = [...imagePreviews];

            const [draggedImage] = newImages.splice(oldIndex, 1);
            newImages.splice(newIndex, 0, draggedImage);

            const [draggedPreview] = newPreviews.splice(oldIndex, 1);
            newPreviews.splice(newIndex, 0, draggedPreview);

            setProduct((prev) => ({ ...prev, images: newImages }));
            setImagePreviews(newPreviews);
        }
    };

    return (
        <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg">
            <h1 className="text-gray-900 text-2xl font-bold text-center mb-6">Додати Продукт</h1>
            <Form
                form={form}
                onFinish={handleSubmit}
                layout="vertical"
                initialValues={product}
            >
                <Form.Item
                    label="Назва Продукта"
                    name="name"
                    rules={[{ required: true, message: "Введіть назву" }]}
                >
                    <Input className="rounded" />
                </Form.Item>

                <Form.Item
                    label="Ціна"
                    name="cost"
                    rules={[
                        { required: true, message: "Введіть ціну" },
                        { type: "number", min: 0, message: "Ціна повинна бути не менше 0"},
                    ]}
                >
                    <InputNumber className="rounded w-full" />
                </Form.Item>

                {isCategoriesLoading ? (
                    <span>Завантаження категорій...</span>
                ) : categoriesError ? (
                    <span className="text-red-500">Помилка при завантаженні категорій!</span>
                ) : (
                    <Form.Item
                        label="Категорія"
                        name="categoryId"
                        rules={[{ required: true, message: "Виберіть категорію" }]}
                    >
                        <Select placeholder="Виберіть категорію..." options={categoriesForm} />
                    </Form.Item>
                )}

                <Form.Item label="Зображення Продукта">
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext
                            items={imagePreviews.map((preview, index) => `${index}-${preview}`)}
                            strategy={horizontalListSortingStrategy}
                        >
                            <div className="flex items-center flex-wrap">
                                {imagePreviews.map((preview, index) => (
                                    <SortableImage
                                        key={`${index}-${preview}`}
                                        preview={preview}
                                        index={index}
                                        onRemove={handleRemoveImage}
                                    />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>

                    <Upload
                        multiple
                        listType="picture-card"
                        beforeUpload={() => false}
                        onChange={handleFileChange}
                        fileList={[]}
                        accept="image/*"
                        className="flex flex-wrap"
                    >
                        <div>
                            <PlusOutlined />
                            <div style={{ marginTop: 8 }}>Завантажити</div>
                        </div>
                    </Upload>
                </Form.Item>

                <Form.Item>
                    <button
                        type="submit"
                        disabled={isCreateLoading}
                        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded w-full mt-4"
                    >
                        {isCreateLoading ? 'Додавання...' : 'Додати Продукт'}
                    </button>
                </Form.Item>

                {createError && <p className="text-red-500 mt-2">Помилка при додаванні продукта!</p>}
            </Form>
        </div>
    );
};

export default CreateProductPage;
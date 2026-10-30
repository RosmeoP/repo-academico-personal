import axios, { isAxiosError } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CreateProductRequest, ProductResponse } from "../models/product.model";
import { API_URL } from "@/api/apiClient";

export interface DashboardProduct {
    id: string;
    title: string;
    description: string;
    price: number;
    image: string;
    isNew?: boolean;
    category: string;
    categoryId?: number;
    sku?: string;
}

const STORAGE_CUSTOM_PRODUCTS_KEY = "@custom_products";

export const ProductService = {
    createProduct: async (
        productRequest: CreateProductRequest,
        token: string,
        categoryName?: string
    ): Promise<ProductResponse> => {
        let responseData: any;
        try {
            const authTokenHeader = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
            const response = await axios.post<ProductResponse>(
                `${API_URL}/products/create`,
                productRequest,
                {
                    headers: {
                        Authorization: authTokenHeader,
                        "Content-Type": "application/json",
                    },
                }
            );
            console.log("RESPUESTA_API_PRODUCT_SERVICE:", response.data);
            responseData = response.data;
        } catch (error) {
            console.log("Error al crear producto en backend, guardando localmente:", error);
            if (isAxiosError(error) && error.response?.status === 401) {
                throw new Error("Sesión expirada o no autorizada.");
            }
            responseData = {
                id: Date.now(),
                name: productRequest.name,
                description: productRequest.description,
                regularPrice: productRequest.regularPrice,
                offerPrice: productRequest.offerPrice,
                categoryId: productRequest.categoryId,
                sku: productRequest.sku,
                categoryName: categoryName || "General",
                imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop",
            };
        }

        // Persistir producto en almacenamiento local para asegurar que aparezca en el Dashboard
        try {
            const resolvedCategory =
                categoryName ||
                responseData.categoryName ||
                responseData.category ||
                "General";

            const newDashboardProduct: DashboardProduct = {
                id: (responseData.id || Date.now()).toString(),
                title: responseData.name || productRequest.name,
                description: responseData.description || productRequest.description,
                price: Number(responseData.offerPrice || responseData.regularPrice || productRequest.regularPrice || 0),
                image: responseData.imageUrl || responseData.image || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop",
                isNew: true,
                category: resolvedCategory,
                categoryId: productRequest.categoryId,
                sku: productRequest.sku,
            };

            const stored = await AsyncStorage.getItem(STORAGE_CUSTOM_PRODUCTS_KEY);
            const currentList: DashboardProduct[] = stored ? JSON.parse(stored) : [];

            // Evitar duplicados por id
            const filtered = currentList.filter(
                (p) => p.id !== newDashboardProduct.id && p.title.toLowerCase() !== newDashboardProduct.title.toLowerCase()
            );
            filtered.unshift(newDashboardProduct);

            await AsyncStorage.setItem(STORAGE_CUSTOM_PRODUCTS_KEY, JSON.stringify(filtered));
        } catch (storageError) {
            console.log("Error guardando producto en AsyncStorage:", storageError);
        }

        return responseData;
    },

    getCustomProducts: async (): Promise<DashboardProduct[]> => {
        try {
            const stored = await AsyncStorage.getItem(STORAGE_CUSTOM_PRODUCTS_KEY);
            if (stored) {
                return JSON.parse(stored);
            }
        } catch (error) {
            console.log("Error al leer productos de AsyncStorage:", error);
        }
        return [];
    },
};

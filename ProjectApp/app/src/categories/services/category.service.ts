import { API_URL } from "@/api/apiClient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { isAxiosError } from "axios";

export interface CategoryResponse {
    id: number;
    name: string;
    description: string;
    createAt?: string;
    createdAt?: string;
    updateAt?: string;
    updatedAt?: string;
}

const STORAGE_CUSTOM_CATEGORIES_KEY = "@custom_categories";

export const CategoryService = {
    getCategory: async (token?: string): Promise<CategoryResponse[]> => {
        let serverCategories: CategoryResponse[] = [];
        if (token && token.trim()) {
            try {
                const authTokenHeader = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
                const response = await axios.get<CategoryResponse[]>(
                    `${API_URL}/categories`,
                    {
                        headers: {
                            Authorization: authTokenHeader
                        }
                    }
                );
                if (Array.isArray(response.data)) {
                    serverCategories = response.data;
                }
            } catch (error) {
                console.log("Error al obtener categorias del servidor:", error);
                if (isAxiosError(error) && error.response?.status === 401) {
                    throw new Error("Sesión expirada o no autorizada.");
                }
            }
        }

        // Obtener categorías guardadas localmente
        let customCategories: CategoryResponse[] = [];
        try {
            const stored = await AsyncStorage.getItem(STORAGE_CUSTOM_CATEGORIES_KEY);
            if (stored) {
                customCategories = JSON.parse(stored);
            }
        } catch (storageError) {
            console.log("Error al leer categorías de AsyncStorage:", storageError);
        }

        // Combinar categorías del servidor con categorías creadas por el usuario sin duplicados
        const categoryMap = new Map<string, CategoryResponse>();

        for (const cat of serverCategories) {
            if (cat && cat.name) {
                categoryMap.set(cat.name.trim().toLowerCase(), cat);
            }
        }

        for (const cat of customCategories) {
            if (cat && cat.name) {
                categoryMap.set(cat.name.trim().toLowerCase(), cat);
            }
        }

        return Array.from(categoryMap.values());
    },

    getCategories: async (token?: string): Promise<CategoryResponse[]> => {
        return CategoryService.getCategory(token);
    },

    createCategory: async (
        name: string,
        description: string,
        token: string
    ): Promise<CategoryResponse> => {
        let createdCategory: CategoryResponse;
        try {
            const authTokenHeader = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
            const response = await axios.post(
                `${API_URL}/categories/create`,
                {
                    name: name.trim(),
                    description: description.trim()
                },
                {
                    headers: {
                        Authorization: authTokenHeader,
                        "Content-Type": "application/json"
                    }
                }
            );
            console.log("RESPUESTA CREAR CATEGORIA:", response.data);
            const rawData = response.data?.category || response.data?.data || response.data;
            createdCategory = {
                id: Number(rawData?.id || Date.now()),
                name: (rawData?.name || name).trim(),
                description: (rawData?.description || description).trim(),
                createdAt: rawData?.createdAt || rawData?.createAt || new Date().toISOString(),
                updatedAt: rawData?.updatedAt || rawData?.updateAt || new Date().toISOString(),
            };
        } catch (error) {
            console.log("Error al crear categoría en el servidor, guardando localmente:", error);
            if (isAxiosError(error) && error.response?.status === 401) {
                throw new Error("Sesión expirada o no autorizada.");
            }
            // Fallback para persistencia local inmediata
            createdCategory = {
                id: Date.now(),
                name: name.trim(),
                description: description.trim(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
        }

        // Guardar la categoría en AsyncStorage para garantizar que aparezca inmediatamente
        try {
            const stored = await AsyncStorage.getItem(STORAGE_CUSTOM_CATEGORIES_KEY);
            const currentList: CategoryResponse[] = stored ? JSON.parse(stored) : [];

            // Filtrar duplicados por nombre
            const filtered = currentList.filter(
                (c) => c.name.trim().toLowerCase() !== createdCategory.name.trim().toLowerCase()
            );
            filtered.push(createdCategory);

            await AsyncStorage.setItem(STORAGE_CUSTOM_CATEGORIES_KEY, JSON.stringify(filtered));
        } catch (storageError) {
            console.log("Error al guardar categoría en AsyncStorage:", storageError);
        }

        return createdCategory;
    }
};

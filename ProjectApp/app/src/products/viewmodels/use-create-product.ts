import { useRouter } from "expo-router";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { ProductService } from "../services/product.service";
import { CategoryResponse, CategoryService } from "../../categories/services/category.service";
import { Alert, Platform } from "react-native";

export function useCreateProduct() {
    const router = useRouter();
    const { token } = useAuth();

    const [name, setName] = useState("");
    const [categoryId, setCategoryId] = useState<null | number>(null);
    const [sku, setSku] = useState("");
    const [description, setDescription] = useState("");
    const [regularPrice, setRegularPrice] = useState("");
    const [offerPrice, setOfferPrice] = useState("");
    const [initialStock, setInitialStock] = useState("");
    const [minStockAlert, setMinStockAlert] = useState("");
    const [isLoadingProduct, setIsLoadingProduct] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Estados para selector de categorías
    const [categories, setCategories] = useState<CategoryResponse[]>([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(false);
    const [isCategoriesShowModal, setIsCategoriesShowModal] = useState(false);
    const [selectedCategoryName, setSelectedCategoryName] = useState("");
    const [categoriesError, setCategoriesError] = useState<string | null>(null);

    const fetchCategories = useCallback(async () => {
        if (!token) return;
        try {
            setIsLoadingCategories(true);
            setCategoriesError(null);
            const data = await CategoryService.getCategories(token);
            setCategories(data);
        } catch (error: any) {
            console.log("Error al cargar las categorías:", error?.message);
            setCategoriesError("No se pudieron cargar las categorías (error del servidor).");
        } finally {
            setIsLoadingCategories(false);
        }
    }, [token]);

    useEffect(() => {
        if (token) {
            fetchCategories();
        }
    }, [token, fetchCategories]);

    const notify = (title: string, message: string, onOk?: () => void) => {
        if (Platform.OS === "web") {
            window.alert(`${title}: ${message}`);
            if (onOk) onOk();
        } else {
            Alert.alert(
                title,
                message,
                onOk ? [{ text: "OK", onPress: onOk }] : undefined
            );
        }
    };

    const submitProduct = async () => {
        console.log("--> submitProduct ejecutado con:", {
            name,
            categoryId,
            sku,
            description,
            regularPrice,
            initialStock,
            hasToken: !!token,
        });

        if (!name.trim() || !sku.trim() || !description.trim() || !regularPrice.trim() || !initialStock.trim()) {
            const msg = "Por favor completa todos los campos obligatorios (Nombre, SKU, Descripción, Precios y Stock)";
            setErrorMessage(msg);
            notify("Error", msg);
            return;
        }

        if (!categoryId) {
            const msg = "Por favor selecciona una categoría";
            setErrorMessage(msg);
            notify("Error", msg);
            return;
        }

        if (!token) {
            const msg = "Sesión no válida o expirada. Inicia sesión nuevamente.";
            setErrorMessage(msg);
            notify("Error", msg);
            return;
        }

        setErrorMessage(null);
        setIsLoadingProduct(true);

        try {
            const createdProduct = await ProductService.createProduct(
                {
                    name: name.trim(),
                    categoryId: Number(categoryId),
                    sku: sku.trim(),
                    description: description.trim(),
                    regularPrice: parseFloat(regularPrice),
                    offerPrice: offerPrice ? parseFloat(offerPrice) : undefined,
                    initialStock: parseInt(initialStock, 10),
                    minStockAlert: minStockAlert ? parseInt(minStockAlert, 10) : 0,
                },
                token,
                selectedCategoryName
            );

            console.log("RESPUESTA CREAR PRODUCTO (API):", JSON.stringify(createdProduct, null, 2));

            notify("Éxito", "Producto creado correctamente", () => {
                router.replace("/(protected)/dashboard");
            });
        } catch (error: any) {
            console.error("Error al crear producto en backend:", error);
            const msg = error.message || "Error al crear el producto";
            setErrorMessage(msg);
            notify("Error", msg);
        } finally {
            setIsLoadingProduct(false);
        }
    };

    return {
        name,
        setName,
        categoryId,
        setCategoryId,
        sku,
        setSku,
        description,
        setDescription,
        regularPrice,
        setRegularPrice,
        offerPrice,
        setOfferPrice,
        initialStock,
        setInitialStock,
        minStockAlert,
        setMinStockAlert,
        isLoadingProduct,
        errorMessage,
        submitProduct,
        categories,
        isLoadingCategories,
        isCategoriesShowModal,
        setIsCategoriesShowModal,
        selectedCategoryName,
        setSelectedCategoryName,
        fetchCategories,
        categoriesError,
    };
}

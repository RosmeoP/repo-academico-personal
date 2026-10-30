import { Ionicons } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import { useFocusEffect, useNavigation, useRouter } from "expo-router";
import Drawer from "expo-router/drawer";
import { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, Dimensions, FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDrawer } from "../src/Admin/viewmodels/use-drawer";
import { CategoryService } from "../src/categories/services/category.service";
import { useAuth } from "../src/context/AuthContext";
import { ProductService, DashboardProduct } from "../src/products/services/product.service";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 44) / 2 //(Ancho total - margenes laterales)/2
interface Product {
    id: string
    title: string
    description: string
    price: number
    image: string
    isNew?: boolean
    category: string
}
const DEFAULT_CATEGORIES = [
    "All categories",
    "Calzado Urbano",
    "Ropa urbana",
    "Comida",
    "Electronics",
    "VideoGames"
];
const MOCK_PRODUCTS: Product[] = [
    {
        id: "1",
        title: "Premium Audio",
        description: "Wireless Noise Cancelling",
        price: 299.00,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop",
        isNew: true,
        category: "Electronics",
    },
    {
        id: "2",
        title: "Eon Classic Wrist",
        description: "Genuine Leather Strap",
        price: 145.00,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop",
        category: "Ropa urbana",
    },
    {
        id: "3",
        title: "Velocity Running",
        description: "Peak Performance Gear",
        price: 89.99,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop",
        category: "Calzado Urbano",
    },
    {
        id: "4",
        title: "Insta-Capture",
        description: "Vintage Aesthetics",
        price: 120.00,
        image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=600&auto=format&fit=crop",
        category: "Electronics",
    },
    {
        id: "5",
        title: "Console Controller",
        description: "Built for Next-Gen Gaming",
        price: 69.99,
        image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=600&auto=format&fit=crop",
        isNew: true,
        category: "VideoGames",
    },
    {
        id: "6",
        title: "Sneaker Urbano Casual",
        description: "Zapatos urbanos para uso diario",
        price: 74.99,
        image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=600&auto=format&fit=crop",
        isNew: true,
        category: "Calzado Urbano",
    },
    {
        id: "7",
        title: "Camisa Oversize Street",
        description: "Estilo urbano 100% algodón",
        price: 35.00,
        image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600&auto=format&fit=crop",
        category: "Ropa urbana",
    },
    {
        id: "8",
        title: "Combo Snack & Burger",
        description: "Comida rápida y aperitivos",
        price: 14.50,
        image: "https://images.unsplash.com/photo-1561758033-d89a9ad46330?q=80&w=600&auto=format&fit=crop",
        category: "Comida",
    }
];

export default function DashboardScreen() {
    const navigation = useNavigation();
    const router = useRouter();
    const { profile } = useDrawer();
    const { token } = useAuth();
    const [selectedCategory, setSelectedCategory] = useState("All categories");
    const [searchQuery, setSearchQuery] = useState("");
    const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
    const [isLoadingCategories, setIsLoadingCategories] = useState(false);
    const [customProducts, setCustomProducts] = useState<DashboardProduct[]>([]);

    const fetchCategories = useCallback(async () => {
        setIsLoadingCategories(true);
        try {
            const data = await CategoryService.getCategory(token || "");
            const categoryNames = Array.from(new Set(data.map((c) => c.name).filter(Boolean)));
            const uniqueCategories = Array.from(new Set(["All categories", ...categoryNames, ...DEFAULT_CATEGORIES]));
            setCategories(uniqueCategories);
        } catch (error) {
            console.log("Error to get categories from screen", error);
            try {
                const stored = await AsyncStorage.getItem("@custom_categories");
                if (stored) {
                    const localCats = JSON.parse(stored);
                    const localNames = localCats.map((c: any) => c.name).filter(Boolean);
                    setCategories(Array.from(new Set(["All categories", ...localNames, ...DEFAULT_CATEGORIES])));
                }
            } catch (e) {
                console.log("Fallback categories error:", e);
            }
        } finally {
            setIsLoadingCategories(false);
        }
    }, [token]);

    const fetchCustomProducts = useCallback(async () => {
        try {
            const items = await ProductService.getCustomProducts();
            setCustomProducts(items);
        } catch (error) {
            console.log("Error to get custom products:", error);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchCategories();
            fetchCustomProducts();
        }, [fetchCategories, fetchCustomProducts])
    );

    const openMenu = () => {
        navigation.dispatch(DrawerActions.openDrawer());
    };

    const allProducts = useMemo(() => {
        return [...customProducts, ...MOCK_PRODUCTS];
    }, [customProducts]);

    const normalizeStr = (str?: string) =>
        (str || "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim()
            .toLowerCase();

    // FILTRAR DINAMICAMENTE LOS PRODUCTOS SEGUN LA CATEGORIA Y BUSQUEDA
    const filteredProductsByCategory = useMemo(() => {
        const selectedNorm = normalizeStr(selectedCategory);
        const searchNorm = normalizeStr(searchQuery);

        const isAll =
            selectedNorm === "all categories" ||
            selectedNorm === "all products" ||
            selectedNorm === "";

        return allProducts.filter((product) => {
            const productCategoryNorm = normalizeStr(product.category);

            // Coincidencia con la categoría seleccionada
            const matchCategory = isAll || productCategoryNorm === selectedNorm;

            // Búsqueda dinámica por título, descripción O categoría
            const matchSearch =
                !searchNorm ||
                normalizeStr(product.title).includes(searchNorm) ||
                normalizeStr(product.description).includes(searchNorm) ||
                productCategoryNorm.includes(searchNorm);

            return matchCategory && matchSearch;
        });
    }, [allProducts, selectedCategory, searchQuery]);
    return (
        <SafeAreaView style={styles.container}>
            {/**Omitir el drawer por defecto */}
            <Drawer.Screen options={{ headerShown: false }} />
            <View style={styles.header}>
                <TouchableOpacity onPress={openMenu} style={{ padding: 15 }}>
                    <Ionicons name="menu-outline" size={30} color="#005C3A" />
                </TouchableOpacity>

                <Text style={styles.logoText}>ShopEase</Text>
                <TouchableOpacity
                    style={styles.profileContainer}
                    onPress={() => router.push("/(protected)/profile")}
                >
                    <Image
                        source={{ uri: profile.avatarUrl }}
                        style={styles.avatarImage}
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
                <Ionicons name="search-outline" size={20} style={styles.searchIcon} />
                <TextInput
                    placeholder="Search products"
                    style={styles.searchInput}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            {/**CATEGORIES**/}
            <View style={styles.categoriesWrapper}>
                {isLoadingCategories ? (
                    <ActivityIndicator color="#005C3A" size="small" />
                ) : (
                    <FlatList
                        data={categories}
                        horizontal
                        keyExtractor={(item) => item}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.categoriesList}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[
                                    styles.categoryItem,
                                    selectedCategory === item && styles.categoryItemSelected,
                                ]}
                                onPress={() => setSelectedCategory(item)}
                            >
                                <Text
                                    style={[
                                        styles.categoryText,
                                        selectedCategory === item && styles.categoryTextSelected,
                                    ]}
                                >
                                    {item}
                                </Text>
                            </TouchableOpacity>
                        )}
                    />
                )}
            </View>
            {/**PRODUCTS CARD**/}
            <FlatList
                data={filteredProductsByCategory}
                keyExtractor={(item) => item.id}
                numColumns={2}
                columnWrapperStyle={styles.gridRowSpace}
                contentContainerStyle={styles.productList}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="bag-handle-outline" size={54} color="#9CA3AF" />
                        <Text style={styles.emptyTitle}>No hay productos</Text>
                        <Text style={styles.emptySubtitle}>
                            {`No se encontraron productos en la categoría "${selectedCategory}".`}
                        </Text>
                    </View>
                }
                renderItem={({ item }) => (
                    <View style={styles.cardContainer}>
                        <View style={styles.imageWrapper}>
                            <Image
                                source={{ uri: item.image || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop" }}
                                style={styles.productImage}
                            />
                            {item.isNew && (
                                <View style={styles.newBadge}>
                                    <Text style={styles.newBadgeText}>NEW</Text>
                                </View>
                            )}
                        </View>

                        <View style={styles.productInfo}>
                            <Text style={styles.productTitle}>{item.title}</Text>
                            <Text style={styles.productDescription}>{item.description}</Text>
                            <View style={styles.priceRow}>
                                <Text>${Number(item.price || 0).toFixed(2)}</Text>
                                <TouchableOpacity style={styles.cardBtn}>
                                    <Ionicons name="cart-outline" size={16} color="#FFF" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )}
            />

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F9FAFB"
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 15,
        paddingVertical: 14
    },
    logoText: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#005C3A"
    },
    profileContainer: {
        borderRadius: 20,
        overflow: "hidden",
        borderWidth: 1
    },
    avatarImage: {
        width: 40,
        height: 40
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFF",
        marginHorizontal: 16,
        marginTop: 8,
        marginBottom: 20,
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: "#D1D5DB",
        borderRadius: 14
    },
    searchIcon: {
        marginRight: 10
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: "#1F2937",
        padding: 0
    },
    categoriesWrapper: {
        maxHeight: 50,
        marginBottom: 16
    },
    categoriesList: {
        paddingHorizontal: 16,
        alignItems: "center"
    },
    categoryItem: {
        paddingHorizontal: 18,
        paddingVertical: 10,
        backgroundColor: "#E5E7EB",
        borderRadius: 24,
        marginRight: 10
    },
    categoryItemSelected: {
        backgroundColor: "#005C3A"
    },
    categoryText: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#374151"
    },
    categoryTextSelected: {
        color: "#FFF"
    },
    /***ESTILOS PARA LAS TARJETAS */
    productList: {
        paddingHorizontal: 16,
        paddingBottom: 24
    },
    gridRowSpace: {
        justifyContent: "space-between"
    },
    cardContainer: {
        width: CARD_WIDTH,
        backgroundColor: "#FFF",
        borderRadius: 16,
        marginBottom: 16,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2
    },
    imageWrapper: {
        height: 140,
        width: "100%",
        backgroundColor: "#F3F4F6",
        position: "relative"
    },
    productImage: {
        width: "100%",
        height: "100%",
        resizeMode: "cover"
    },
    newBadge: {
        position: "absolute",
        top: 10,
        left: 10,
        backgroundColor: "#005C3A",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    newBadgeText: {
        color: "#FFF",
        fontSize: 10,
        fontWeight: "bold",
    },
    productInfo: {
        padding: 12
    },
    productTitle: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#1F2937",
        marginBottom: 2
    },
    productDescription: {
        fontSize: 11,
        color: "#6B7280",
        marginBottom: 8
    },
    priceRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    cardBtn: {
        backgroundColor: "lightgreen",
        width: 30,
        height: 30,
        justifyContent: "center",
        borderRadius: 15,
        alignItems: "center"
    },
    emptyContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 50,
        paddingHorizontal: 20,
    },
    emptyTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#374151",
        marginTop: 12,
    },
    emptySubtitle: {
        fontSize: 13,
        color: "#6B7280",
        marginTop: 4,
        textAlign: "center",
    }
});
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import Drawer from "expo-router/drawer";
import { useCallback } from "react";
import { ActivityIndicator, FlatList, KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCreateProduct } from "../src/products/viewmodels/use-create-product";

export default function CreateProductScreen() {
  const router = useRouter();
  const {
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
    categoriesError,
    fetchCategories,
  } = useCreateProduct();

  useFocusEffect(
    useCallback(() => {
      fetchCategories();
    }, [fetchCategories])
  );

  return (
    <SafeAreaView
      style={styles.container}
    >
      <Drawer.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >

        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.replace("/(protected)/dashboard")}
          >
            <Ionicons name="arrow-back-outline" size={26} />
          </TouchableOpacity>
          <View style={styles.titleWrapper}>
            <Text style={styles.headerTitle}>ADMIN PORTAL</Text>
            <Text style={styles.headersubTitle}>Nuevo Producto</Text>
          </View>
        </View>

        <ScrollView style={styles.scrollContent}>
          {errorMessage && (
            <View style={styles.errorBanner}>
              <Feather name="alert-circle" size={18} color="#B91C1C" style={{ marginRight: 8 }} />
              <Text style={styles.errorBannerText}>{errorMessage}</Text>
            </View>
          )}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Feather
                name="clipboard"
                size={20}
                color="#006C47"
                style={{ marginRight: 10 }}
              />
              <Text style={styles.cardtitle}>Informacion general</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Nombre del producto
              </Text>
              <TextInput
                placeholder="Ej: Zapato Nike"
                style={styles.inputText}
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>categoria</Text>
              <TouchableOpacity
                style={styles.selectInput}
                onPress={() => {
                  fetchCategories();
                  setIsCategoriesShowModal(true);
                }}
              >
                <Text style={selectedCategoryName ? styles.selectInputTextSelected : styles.selectInputPlaceholder}>
                  {selectedCategoryName || "seleciona la categoria"}
                </Text>
                <Feather
                  name="chevron-down"
                  size={20}
                  color="#6B7280"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>SKU / Codigo de Barra</Text>
              <View style={styles.inputWithIcon}>
                <MaterialCommunityIcons
                  name="barcode-scan"
                  size={20}
                  style={{ marginRight: 10 }}
                />
                <TextInput
                  placeholder="PR-7878787878787"
                  style={styles.textInputScan}
                  value={sku}
                  onChangeText={setSku}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Descripcion Detallada</Text>
              <TextInput
                placeholder="Describe los atributos principales, material, confeccion"
                multiline
                numberOfLines={5}
                textAlignVertical="top"
                maxLength={2000}
                style={styles.inputTextArea}
                value={description}
                onChangeText={setDescription}
              />

            </View>
            <View style={styles.chartCounterDescription}>

              <Text>{description.length} / 2000</Text>
            </View>
          </View>

          {/**precios e inventario clases 22 */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Feather
                name="dollar-sign"
                size={20}
                color="#006C47"
                style={{ marginRight: 10 }}
              />
              <Text style={styles.cardtitle}>Precios e inventario</Text>

            </View>
            <View >
              <View style={styles.rowCols}>

                <View style={styles.col}>
                  <Text style={styles.inputLabel}>precio regular</Text>
                  <View style={styles.inputPriceWrapper}>
                    <Text style={{ marginRight: 6 }}>$</Text>
                    <TextInput
                      placeholder="0.0"
                      keyboardType="numeric"
                      style={styles.princeInput}
                      value={regularPrice}
                      onChangeText={setRegularPrice}
                    />
                  </View>
                </View>
                <View style={styles.col}>
                  <Text style={styles.inputLabel}>precio oferta</Text>
                  <View style={styles.inputPriceWrapper}>
                    <Text style={{ marginRight: 6 }}>$</Text>
                    <TextInput
                      placeholder="0.0"
                      keyboardType="numeric"
                      style={styles.princeInput}
                      value={offerPrice}
                      onChangeText={setOfferPrice}
                    />
                  </View>
                </View>

              </View>
            </View>
            <View >
              <View style={styles.rowCols}>

                <View style={styles.col}>
                  <Text style={styles.inputLabel}>Stock Inicial</Text>
                  <View style={styles.inputPriceWrapper}>
                    <TextInput
                      placeholder="50"
                      keyboardType="numeric"
                      style={styles.princeInput}
                      value={initialStock}
                      onChangeText={setInitialStock}
                    />
                  </View>
                </View>
                <View style={styles.col}>
                  <Text style={styles.inputLabel}>Stock minimo </Text>
                  <View style={styles.inputPriceWrapper}>
                    <TextInput
                      placeholder="5"
                      keyboardType="numeric"
                      style={styles.princeInput}
                      value={minStockAlert}
                      onChangeText={setMinStockAlert}
                    />
                  </View>
                </View>
              </View>
              {/**pendiente a revisar posicion */}
              <TouchableOpacity
                style={styles.btnSave}
                onPress={submitProduct}
                disabled={isLoadingProduct}
              >
                {isLoadingProduct ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <>
                    <Ionicons name="checkmark-outline" size={22} color="#fff" style={styles.checkIcon} />
                    <Text style={styles.btnSaveText}>Guardar producto</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modal Selector de Categorías */}
      <Modal
        visible={isCategoriesShowModal}
        transparent
        animationType="slide"
        onRequestClose={() => setIsCategoriesShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Seleccionar categoría</Text>
              <TouchableOpacity onPress={() => setIsCategoriesShowModal(false)}>
                <Feather name="x" size={22} color="#374151" />
              </TouchableOpacity>
            </View>

            {isLoadingCategories ? (
              <ActivityIndicator size="large" color="#006C47" style={{ marginVertical: 20 }} />
            ) : categoriesError ? (
              <View style={{ alignItems: "center", paddingVertical: 24 }}>
                <Feather name="alert-circle" size={32} color="#B91C1C" />
                <Text style={{ color: "#B91C1C", marginTop: 8, textAlign: "center" }}>
                  {categoriesError}
                </Text>
                <TouchableOpacity
                  style={[styles.btnSave, { paddingHorizontal: 24, marginTop: 16, marginBottom: 0 }]}
                  onPress={fetchCategories}
                >
                  <Text style={styles.btnSaveText}>Reintentar</Text>
                </TouchableOpacity>
              </View>
            ) : categories.length === 0 ? (
              <Text style={{ textAlign: "center", color: "#6B7280", paddingVertical: 24 }}>
                No hay categorías disponibles.
              </Text>
            ) : (
              <FlatList
                data={categories}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => {
                  const isSelected = item.id === categoryId;
                  return (
                    <TouchableOpacity
                      style={[
                        styles.categoryOption,
                        isSelected && styles.categoryOptionSelected,
                      ]}
                      onPress={() => {
                        setCategoryId(item.id);
                        setSelectedCategoryName(item.name);
                        setIsCategoriesShowModal(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.categoryOptionText,
                          isSelected && styles.categoryOptionTextSelected,
                        ]}
                      >
                        {item.name}
                      </Text>
                      {isSelected && (
                        <Feather name="check" size={18} color="#006C47" />
                      )}
                    </TouchableOpacity>
                  );
                }}
              />
            )}
          </View>
        </View>
      </Modal>
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
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#F9FAFB"
  },
  titleWrapper: {
    flex: 1,
    marginLeft: 16
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    letterSpacing: 0.8
  },
  headersubTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#006C47",
    marginTop: 2
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16
  },
  cardtitle: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "bold",

  },
  inputGroup: {
    marginBottom: 10,
  },

  inputLabel: {
    color: "#374151",
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 8,
  },

  inputText: {
    height: 48,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 14,
  },
  selectInput: {
    height: 48,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    borderColor: "#E5E7EB",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

  },
  inputWithIcon: {
    height: 48,
    borderWidth: 1,
    flexDirection: "row",
    borderColor: "#E5E7EB",
    paddingHorizontal: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  textInputScan: {
    flex: 1,
    padding: 0,
  },

  inputTextArea: {
    height: 120,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
  },
  chartCounterDescription: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },

  /**clases 22 */
  rowCols: {
    flexDirection: "row",
    gap: 8,

  },
  col: {
    flex: 1,
    marginBottom: 5
  },
  inputPriceWrapper: {
    height: 48,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  princeInput: {
    flex: 1,
    padding: 0,

  },
  btnSave: {
    backgroundColor: "#006C47",
    height: 48,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 15,
  },

  checkIcon: {
    marginRight: 8,
  },

  btnSaveText: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "bold",
  },
  selectInputPlaceholder: {
    color: "#9CA3AF",
    fontSize: 14,
  },
  selectInputTextSelected: {
    color: "#111827",
    fontSize: 14,
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    maxHeight: "60%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
  },
  categoryOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  categoryOptionSelected: {
    backgroundColor: "#edfdf5",
  },
  categoryOptionText: {
    fontSize: 16,
    color: "#374151",
  },
  categoryOptionTextSelected: {
    color: "#006C47",
    fontWeight: "600",
  },
  errorBanner: {
    backgroundColor: "#FEE2E2",
    borderWidth: 1,
    borderColor: "#F87171",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  errorBannerText: {
    color: "#B91C1C",
    fontSize: 13,
    fontWeight: "600",
    flex: 1,
  },
});

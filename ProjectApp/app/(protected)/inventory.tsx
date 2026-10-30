import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { CategoryService } from "../src/categories/services/category.service";
import { useAuth } from "../src/context/AuthContext";

export default function InventoryScreen() {
  const router = useRouter();
  const { token } = useAuth();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const notify = (title: string, message: string, onOk?: () => void) => {
    if (Platform.OS === "web") {
      window.alert(`${title}: ${message}`);
      if (onOk) onOk();
    } else {
      Alert.alert(
        title,
        message,
        onOk ? [{ text: "Aceptar", onPress: onOk }] : undefined
      );
    }
  };

  const handleSaveCategory = async () => {
    if (!name.trim()) {
      notify(
        "Campo requerido",
        "Por favor ingrese el nombre de la categoría"
      );
      return;
    }
    if (!description.trim()) {
      notify("Campo requerido", "Por favor ingrese la descripción");
      return;
    }
    if (!token) {
      notify("Error de sesión", "No se encontró el token de autenticación.");
      return;
    }
    setIsLoading(true);
    try {
      const newCategory = await CategoryService.createCategory(name, description, token);

      notify("¡Categoría Creada!", `La categoría "${newCategory.name}" fue registrada exitosamente.`, () => {
        setName("");
        setDescription("");
        router.replace("/(protected)/dashboard");
      });
    } catch (error: any) {
      notify("Error", error.message || "No se pudo guardar la categoría");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Drawer.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.replace("/(protected)/dashboard")}
          >
            <Ionicons name="arrow-back-outline" size={26} color="#000000" />
          </TouchableOpacity>
          <View style={styles.titleWrapper}>
            <Text style={styles.headertitle}>ADMIN PORTAL</Text>
            <Text style={styles.headersubtitle}>Nueva Categoria</Text>
          </View>
          <View style={styles.boxIconContainer}>
            <Ionicons name="archive-outline" size={22} />
          </View>
        </View>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.descriptionText}>
            Ingresa los datos esenciales para catalogar los productos en el
            inventario
          </Text>
          <View style={styles.formCard}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nombre de la Categoria</Text>
              <TextInput
                placeholder="Ej: Dulceria"
                style={styles.inputText}
                value={name}
                onChangeText={setName}
                editable={!isLoading}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Descripción de la Categoria</Text>
              <TextInput
                placeholder="Describe los productos que engloban esta categoria"
                multiline
                numberOfLines={5}
                textAlignVertical="top"
                style={styles.inputTextArea}
                value={description}
                onChangeText={setDescription}
                editable={!isLoading}
              />
            </View>
            <TouchableOpacity onPress={handleSaveCategory} disabled={isLoading} style={styles.btnSave} >
              {isLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Ionicons
                    name="checkmark"
                    size={22}
                    color="#fff"
                    style={styles.checkIcon}
                  />
                  <Text style={styles.btnSaveText}>Guardar Categoria</Text>
                </>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnCancel}
              onPress={() => router.replace("/(protected)/dashboard")}
              disabled={isLoading}
            >
              <Text style={styles.btnCancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },

  header: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#F9FAFB",
    flexDirection: "row",
    alignItems: "center",
  },

  titleWrapper: {
    flex: 1,
    marginLeft: 16,
  },

  headertitle: {
    color: "#111827",
    fontSize: 20,
    fontWeight: "bold",
    letterSpacing: 0.8,
  },

  headersubtitle: {
    color: "#006C47",
    fontSize: 10,
    fontWeight: "bold",
    marginTop: 2,
  },

  boxIconContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  descriptionText: {
    color: "#4B5563",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 24,
  },

  formCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.03,
    shadowRadius: 15,
    elevation: 2,
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

  inputTextArea: {
    height: 120,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
  },

  btnSave: {
    backgroundColor: "#006C47",
    height: 48,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },

  checkIcon: {
    marginRight: 8,
  },

  btnSaveText: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "bold",
  },

  btnCancel: {
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },

  btnCancelText: {
    color: "#6D7280",
    fontSize: 14,
    fontWeight: "500",
  },
});

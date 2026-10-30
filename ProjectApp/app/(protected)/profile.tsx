import { useAuth } from "@/app/src/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthService } from "../src/Auth/services/auth.service";

const PRESET_AVATARS = [
    {
        label: "Default",
        url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop",
    },
    {
        label: "Professional",
        url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop",
    },
    {
        label: "Creative",
        url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300&auto=format&fit=crop",
    },
    {
        label: "Minimal",
        url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop",
    },
];

export default function ProfileScreen() {
  const router = useRouter();
  const { user, token, updateUserSession } = useAuth();

  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [imagen, setImagen] = useState("");
  const [avatarError, setAvatarError] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isAvatarModalVisible, setIsAvatarModalVisible] = useState(false);
  const [customAvatarInput, setCustomAvatarInput] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setLastName(user.lastName || (user as any).lastname || "");
      setPhone(user.phone || "");
      setImagen(user.imagen || (user as any).image || "");
      setAvatarError(false);
    }
  }, [user]);

  const displayedFullName =
    [name, lastName].filter(Boolean).join(" ").trim() ||
    [user?.name, user?.lastName].filter(Boolean).join(" ").trim() ||
    "Usuario";

  const displayedSubtitle =
    user?.role && user.role.length > 0
      ? user.role.map((r) => r.name).join(" • ")
      : user?.email || "Usuario";

  const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    displayedFullName
  )}&background=047857&color=fff&size=200`;

  const currentAvatarUri = !avatarError && imagen.trim() ? imagen.trim() : fallbackAvatar;

  const ordersCount = (user as any)?.ordersCount ?? (user as any)?.orders ?? 0;
  const pointsCount = (user as any)?.points ?? 0;

  const handleUpdateUser = async () => {
    if (!name.trim() || !lastName.trim() || !phone.trim()) {
      Alert.alert("Campos incompletos", "Por favor llena todos los campos obligatorios.");
      return;
    }
    if (!user?.id || !token) {
      Alert.alert("Error de sesión", "No se encontró el usuario activo.");
      return;
    }

    setIsUpdating(true);
    try {
      let serverUser: any = null;
      try {
        serverUser = await AuthService.updateUser(
          user.id,
          name.trim(),
          lastName.trim(),
          phone.trim(),
          token,
          imagen.trim()
        );
      } catch (apiError: any) {
        console.log("Aviso de servidor al actualizar:", apiError);
        if (
          apiError.message?.toLowerCase().includes("token") ||
          apiError.message?.toLowerCase().includes("invalido")
        ) {
          throw apiError;
        }
      }

      await updateUserSession({
        ...(serverUser || {}),
        name: name.trim(),
        lastName: lastName.trim(),
        phone: phone.trim(),
        imagen: imagen.trim(),
      });

      Alert.alert(
        "Excelente",
        serverUser
          ? "Tu información ha sido actualizada con éxito en el servidor y guardada en tu sesión."
          : "Tu información ha sido actualizada y guardada localmente con éxito."
      );
    } catch (error: any) {
      Alert.alert("Error al actualizar", error.message || "No se pudo actualizar el perfil.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSelectPresetAvatar = (url: string) => {
    setImagen(url);
    setAvatarError(false);
    setIsAvatarModalVisible(false);
  };

  const handleApplyCustomAvatar = () => {
    if (customAvatarInput.trim()) {
      setImagen(customAvatarInput.trim());
      setAvatarError(false);
    }
    setCustomAvatarInput("");
    setIsAvatarModalVisible(false);
  };

  const handleResetToInitials = () => {
    setImagen("");
    setAvatarError(false);
    setIsAvatarModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Drawer.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            router.replace("/(protected)/dashboard");
          }}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back-outline" size={26} color="#005C3A" />
        </TouchableOpacity>
        <Text style={styles.logoText}>ShopEase</Text>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.profileCard}>
          <View style={styles.imageWrapper}>
            <Image
              source={{ uri: currentAvatarUri }}
              style={styles.profileAvatar}
              onError={() => setAvatarError(true)}
            />
            <TouchableOpacity
              style={styles.cameraBtn}
              onPress={() => setIsAvatarModalVisible(true)}
            >
              <Ionicons name="camera" size={16} color="#FFF" />
            </TouchableOpacity>
          </View>
          <Text style={styles.profileName}>{displayedFullName}</Text>
          <Text style={styles.profileSubtitle}>{displayedSubtitle}</Text>

          <View style={styles.cardPoints}>
            <View style={[styles.cardPoinBox, styles.cardOrderColor]}>
              <Text style={styles.cardBoxLabel}>ORDERS</Text>
              <Text style={styles.cardBoxValue}>{ordersCount}</Text>
            </View>
            <View style={[styles.cardPoinBox, styles.cardPointsColor]}>
              <Text style={styles.cardBoxLabel}>POINTS</Text>
              <Text style={styles.cardBoxValue}>{pointsCount}</Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.personalHeader}>Personal Information</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>FIRST NAME</Text>
            <View style={styles.inputWraper}>
              <Ionicons
                style={styles.inputIcon}
                name="person-outline"
                size={20}
                color="#6B7280"
              />
              <TextInput
                placeholder="First name"
                style={styles.input}
                value={name}
                onChangeText={setName}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>LAST NAME</Text>
            <View style={styles.inputWraper}>
              <Ionicons
                style={styles.inputIcon}
                name="person-outline"
                size={20}
                color="#6B7280"
              />
              <TextInput
                placeholder="Last name"
                style={styles.input}
                value={lastName}
                onChangeText={setLastName}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>PHONE NUMBER</Text>
            <View style={styles.inputWraper}>
              <Ionicons
                style={styles.inputIcon}
                name="call-outline"
                size={20}
                color="#6B7280"
              />
              <TextInput
                placeholder="Phone number"
                keyboardType="phone-pad"
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>EMAIL ADDRESS</Text>
            <View style={[styles.inputWraper, styles.inputDisabled]}>
              <Ionicons
                style={styles.inputIcon}
                name="mail-outline"
                size={20}
                color="#9CA3AF"
              />
              <TextInput
                placeholder="Email address"
                style={[styles.input, styles.disabledInputText]}
                value={user?.email || ""}
                editable={false}
              />
              <Ionicons name="lock-closed-outline" size={16} color="#9CA3AF" />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>AVATAR URL</Text>
            <View style={styles.inputWraper}>
              <Ionicons
                style={styles.inputIcon}
                name="image-outline"
                size={20}
                color="#6B7280"
              />
              <TextInput
                placeholder="https://example.com/avatar.jpg"
                style={styles.input}
                value={imagen}
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={(val) => {
                  setImagen(val);
                  setAvatarError(false);
                }}
              />
              {imagen ? (
                <TouchableOpacity
                  onPress={() => {
                    setImagen("");
                    setAvatarError(false);
                  }}
                >
                  <Ionicons name="close-circle" size={18} color="#9CA3AF" />
                </TouchableOpacity>
              ) : null}
            </View>
          </View>

          <TouchableOpacity
            style={styles.updateButton}
            onPress={handleUpdateUser}
            disabled={isUpdating}
          >
            {isUpdating ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Ionicons
                  name="checkmark-circle-outline"
                  size={20}
                  color="#fff"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.updateButtonText}>Save Changes</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Avatar Selection Modal */}
      <Modal
        visible={isAvatarModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsAvatarModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Change Profile Picture</Text>
              <TouchableOpacity onPress={() => setIsAvatarModalVisible(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSectionLabel}>Choose a Preset Avatar:</Text>
            <View style={styles.presetsRow}>
              {PRESET_AVATARS.map((preset, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.presetItem}
                  onPress={() => handleSelectPresetAvatar(preset.url)}
                >
                  <Image source={{ uri: preset.url }} style={styles.presetImage} />
                  <Text style={styles.presetText}>{preset.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.modalSectionLabel}>Or paste Image URL:</Text>
            <View style={styles.customInputRow}>
              <TextInput
                placeholder="Paste image URL here"
                style={styles.customInput}
                value={customAvatarInput}
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={setCustomAvatarInput}
              />
              <TouchableOpacity
                style={styles.applyBtn}
                onPress={handleApplyCustomAvatar}
              >
                <Text style={styles.applyBtnText}>Apply</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.resetBtn}
              onPress={handleResetToInitials}
            >
              <Ionicons name="refresh-outline" size={16} color="#047857" style={{ marginRight: 6 }} />
              <Text style={styles.resetBtnText}>Use Default Initials Avatar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#F3F4F6",
  },
  backButton: {
    padding: 4,
  },
  logoText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#005C3A",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  profileCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
  },
  imageWrapper: {
    position: "relative",
    marginBottom: 14,
  },
  profileAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#E5E7EB",
  },
  cameraBtn: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#005C3A",
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#FFF",
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
    textAlign: "center",
  },
  profileSubtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 20,
    textAlign: "center",
  },
  cardPoints: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  cardPoinBox: {
    flex: 1,
    height: 64,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 6,
  },
  cardOrderColor: {
    backgroundColor: "#DDEAFE",
  },
  cardPointsColor: {
    backgroundColor: "#E2F0FC",
  },
  cardBoxLabel: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#4B5563",
    letterSpacing: 1,
    marginBottom: 4,
  },
  cardBoxValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#047857",
  },
  sectionCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  personalHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 18,
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#4B5563",
    letterSpacing: 1,
    marginBottom: 6,
  },
  inputWraper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    backgroundColor: "#FFF",
  },
  inputDisabled: {
    backgroundColor: "#F9FAFB",
    borderColor: "#E5E7EB",
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#1F2937",
    paddingVertical: 0,
  },
  disabledInputText: {
    color: "#6B7280",
  },
  inputIcon: {
    marginRight: 10,
  },
  updateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#047857",
    borderRadius: 12,
    height: 48,
    justifyContent: "center",
    marginTop: 8,
  },
  updateButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalCard: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },
  modalSectionLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4B5563",
    marginBottom: 10,
    marginTop: 6,
  },
  presetsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  presetItem: {
    alignItems: "center",
    flex: 1,
  },
  presetImage: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 2,
    borderColor: "#005C3A",
    marginBottom: 4,
  },
  presetText: {
    fontSize: 11,
    color: "#4B5563",
  },
  customInputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  customInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 42,
    fontSize: 14,
    backgroundColor: "#F9FAFB",
    marginRight: 8,
  },
  applyBtn: {
    backgroundColor: "#005C3A",
    paddingHorizontal: 16,
    height: 42,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  applyBtnText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 14,
  },
  resetBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#047857",
    borderRadius: 10,
    marginTop: 4,
  },
  resetBtnText: {
    color: "#047857",
    fontWeight: "600",
    fontSize: 13,
  },
});

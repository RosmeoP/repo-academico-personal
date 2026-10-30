import { Feather } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useLogin } from "../../src/Auth/viewmodels/use-login";

export default function LoginScreen() {
  const {
    trainerId,
    password,
    setTrainerId,
    setPassword,
    isLoading,
    errorMessage,
    isPasswordVisible,
    togglePasswordVisibility,
    handleLogin,
  } = useLogin();

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <View style={styles.header}>
            <Image
              source={require("../../assets/images/Poké_Ball_icon.webp")}
              style={styles.logo}
              resizeMode="cover"
              accessibilityLabel="Poke Ball logo"
            />
            <Text style={styles.appNameLabel}>Pokedex</Text>
            <Text style={styles.welcomeLabel}>
              Welcome back, Trainer. Please log in.
            </Text>
          </View>
          {errorMessage && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          )}
          <Text style={styles.label}>Trainer ID</Text>
          <View style={styles.inputContainer}>
            <AntDesign name="idcard" size={24} color="#674641" />
            <TextInput
              style={styles.inputText}
              value={trainerId}
              onChangeText={setTrainerId}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="e.g. ASH-151"
            />
          </View>
          <Text style={styles.label}>Secret Code</Text>
          <View style={styles.inputContainer}>
            <MaterialIcons name="password" size={24} color="#674641" />
            <TextInput
              style={styles.inputPass}
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              secureTextEntry={!isPasswordVisible}
            />
            <TouchableOpacity onPress={togglePasswordVisibility}>
              <Feather
                name={isPasswordVisible ? "eye-off" : "eye"}
                size={20}
                color="#555555"
              />
            </TouchableOpacity>
          </View>
          {isLoading ? (
            <ActivityIndicator size="large" color="#bc0100" />
          ) : (
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Log In →</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.recoveryRow}>
          <TouchableOpacity style={styles.recoveryButton}>
            <Text style={styles.recoveryLinkForgot}>Forgot your Code?</Text>
            <View style={styles.recoveryUnderline}>
              <View
                style={[styles.recoverySegment, styles.recoverySegmentRed]}
              />
              <View
                style={[styles.recoverySegment, styles.recoverySegmentYellow]}
              />
              <View
                style={[styles.recoverySegment, styles.recoverySegmentGreen]}
              />
              <View
                style={[styles.recoverySegment, styles.recoverySegmentBlue]}
              />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  scrollView: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },

  header: {
    alignItems: "center",
  },

  logo: {
    width: 84,
    height: 84,
    borderRadius: 42,
    marginBottom: 22,
    overflow: "hidden",
    transform: [{ rotate: "-12deg" }],
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },

  appNameLabel: {
    fontSize: 34,
    fontWeight: "bold",
    textAlign: "center",
    color: "#bc0100",
  },

  welcomeLabel: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 30,
    color: "#6B6B6B",
  },

  card: {
    backgroundColor: "white",
    padding: 12,
  },

  label: {
    fontSize: 14,
    color: "#1F1F1F",
    fontWeight: "700",
    marginBottom: 8,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#f0cbc6",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 50,
    marginBottom: 16,
  },

  inputText: {
    flex: 1,
    height: "100%",
    marginLeft: 8,
    fontSize: 14,
    color: "#1F1F1F",
  },

  inputPass: {
    flex: 1,
    height: "100%",
    marginLeft: 8,
    fontSize: 14,
    color: "#1F1F1F",
  },

  loginButton: {
    backgroundColor: "#bc0100",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 999,
    marginTop: 16,
  },

  loginButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  recoveryRow: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },

  recoveryButton: {
    alignItems: "center",
  },

  recoveryLinkForgot: {
    color: "#125cab",
    fontSize: 19,
    paddingBottom: 20,
    fontWeight: "700",
    textAlign: "center",
  },

  recoveryUnderline: {
    width: 220,
    height: 4,
    marginTop: 4,
    flexDirection: "row",
    overflow: "hidden",
    borderRadius: 999,
  },

  recoverySegment: {
    flex: 1,
    height: "15%",
  },

  recoverySegmentRed: {
    backgroundColor: "#ff5a5f",
  },

  recoverySegmentYellow: {
    backgroundColor: "#f6c453",
  },

  recoverySegmentBlue: {
    backgroundColor: "#2d7fe2",
  },

  recoverySegmentGreen: {
    backgroundColor: "#4bbd76",
  },

  errorContainer: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: "#F5F5F5",
    borderColor: "#f0cbc6",
  },
  errorText: {
    fontSize: 15,
    textAlign: "center",
    color: "#1F1F1F",
    fontWeight: 500,
  },
});

import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, ScrollView, View, ActivityIndicator } from "react-native";
import { useRegister } from "../../src/Auth/viewmodels/use-register";

export default function RegisterScreen() {
  const router = useRouter();
  const {
    fullName,
    lastName,
    phone,
    email,
    password,
    confirmPassword,
    setFullName,
    setLastName,
    setPhone,
    setEmail,
    setPassword,
    setConfirmPassword,
    handleRegister,
    errorMessage,
    isLoading
  } = useRegister()

  return (
    <KeyboardAvoidingView
      style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>

        <ScrollView contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}>
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Create Account</Text>
                <Text style={styles.label}>First Name</Text>
                <View style={styles.inputContainer}>
                    <Feather name="user" size={20} color="gray"></Feather>
                    <TextInput value={fullName} onChangeText={setFullName} style={{flex:1,height:"100%",marginLeft:8}} placeholder="Gustavo">

                    </TextInput>
                </View>

                <Text style={styles.label}>Last Name</Text>
                <View style={styles.inputContainer}>
                    <Feather name="user" size={20} color="gray"></Feather>
                    <TextInput value={lastName} onChangeText={setLastName} style={{flex:1,height:"100%",marginLeft:8}} placeholder="Rivas">

                    </TextInput>
                </View>

                <Text style={styles.label}>Phone</Text>
                <View style={styles.inputContainer}>
                    <Feather name="phone" size={20} color="gray"></Feather>
                    <TextInput value={phone} onChangeText={setPhone} style={{flex:1,height:"100%",marginLeft:8}} placeholder="00000000">

                    </TextInput>
                </View>

                <Text style={styles.label}>Email Address</Text>
                <View style={styles.inputContainer}>
                    <Feather name="mail" size={20} color="gray"></Feather>
                    <TextInput value={email} onChangeText={setEmail} style={{flex:1,height:"100%",marginLeft:8}} placeholder="name@user.com" keyboardType="email-address" autoCapitalize="none" autoCorrect={false}>
                    </TextInput>
                </View>
                <Text style={styles.label}>Password</Text>
                <View style={styles.inputContainer}>
                    <Feather name="lock" size={20} color="gray"></Feather>
                    <TextInput value={password} onChangeText={setPassword} style={{flex:1,height:"100%",marginLeft:8}} placeholder="********" secureTextEntry={true}>
                    </TextInput>
                </View>
                <Text style={styles.label}>Confirm Password</Text>
                <View style={styles.inputContainer}>
                    <Feather name="shield" size={20} color="gray"></Feather>
                    <TextInput value={confirmPassword} onChangeText={setConfirmPassword} style={{flex:1,height:"100%",marginLeft:8}} placeholder="********" secureTextEntry={true}>
                    </TextInput>
                </View>
                {isLoading ? (
                  <ActivityIndicator size="large" color="darkgreen" />
              ) : (
              <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                <Text style={styles.registerButtonText}>Register</Text>
              </TouchableOpacity>
              )}
            </View><View style={styles.signUpRow}>
                <Text style={styles.signUpText}>Alredy have a account </Text>
                <TouchableOpacity onPress={() => router.push('/(public)')}>
                  <Text style={styles.signUpLink}>Login in here</Text>
                </TouchableOpacity>
              </View>
        </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },

  scrollContainer: {
    flexGrow: 1,
    padding: 24,
    justifyContent: "center",
    paddingTop: 40
  },

  card: {
    backgroundColor: "white",
    borderWidth: 1,
    padding: 12,
    borderRadius: 14,
    shadowColor: "black",
    shadowOffset: {width:0,height:2},
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2
  },

  cardTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
    marginBottom: 20
  },

  label: {
    fontSize: 14,
    color: 'black',
    marginBottom: 8,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 50,
    marginBottom: 16
  },

  registerButton: {
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },

  registerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },

  signUpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },

  signUpText: {
    color: 'gray',
    fontSize: 14,
  },

  signUpLink: {
    color: 'green',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import IoniconsUser from "@expo/vector-icons/Ionicons";

export default function Header({ children, navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View style={styles.barraTopo}>
          <Text style={styles.title}>ConecTalento</Text>

          <TouchableOpacity
            onPress={() => navigation.navigate("Perfil")}
            style={styles.fundoUser}
          >
            <IoniconsUser name="person" size={28} color="white" />
          </TouchableOpacity>
        </View>
        <View style={styles.barraBot}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"} style={{width:"100%"}}
          >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <TextInput
                style={styles.barraPesquisa}
                placeholder="..."
                onChangeText={(newText) => setText(newText)}
                defaultValue={Text}
              />
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </View>
      </View>
      <View style={styles.conteudo}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF", // cor da barra e fundo
  },
  header: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    height: "20%",
    backgroundColor: "#64058F", // cor da barra e fundo
  },
  barraTopo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#64058F",
    paddingHorizontal: 20,
    paddingVertical: 0,
    width: "100%",
    height: "50%",
  },
  title: {
    fontSize: 55,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  fundoUser: {
    backgroundColor: "#ff0000",
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  barraBot: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  barraPesquisa: {
    height: 30,
    width: "70%",
    margin: 0,
    borderWidth: 3,
    borderRadius: 5,
    padding: 30,
    backgroundColor: "#FFFFFF",
    marginBottom: 20,
    borderColor: "#000000",
    alignSelf: "center",
  },
  conteudo: {
    flex: 1,
    height: "80%",
    backgroundColor: "#F5F7FA",
  },
});

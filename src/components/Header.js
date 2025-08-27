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
import { useState } from "react";
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';

export default function Header({ children, navigation }) {
  const insets = useSafeAreaInsets();
  const [text, setText] = useState();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View style={styles.barraTopo}>
          <Text style={styles.title}>ConecTalento</Text>

          <TouchableOpacity
            onPress={() => navigation.navigate("Login")}
            style={styles.fundoUser}
          >
            <IoniconsUser name="person" size={40} color="#949599" />
          </TouchableOpacity>
        </View>
        <View style={styles.barraBot}>
          <View style={styles.barraPesquisa}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ width: "80%" }} // Tentando fazer o Header não diminuir
          >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <TextInput
                placeholder="..."
                onChangeText={(newText) => setText(newText)}
                defaultValue={text}
              />
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
          <Feather name="filter" size={30} color="black" />
          <Entypo name="magnifying-glass" size={30} color="black" />
          </View>
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
    backgroundColor: "#d2d3d5",
    width: 60,
    height: 60,
    borderRadius: 30,
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
    height: 60,
    width: "90%",
    margin: 0,
    paddingHorizontal: 10,
    paddingVertical: 0,
    backgroundColor: "#ffffff",
    marginBottom: 10,
    color:"#000000",
    fontSize: 90,
    alignSelf: "center",
    display:"flex",
    justifyContent:"space-evenly",
    alignItems:"center",
    flexDirection:"row",
  },
  conteudo: {
    flex: 1,
    height: "80%",
    backgroundColor: "#F5F7FA",
  },
});

import React from "react";
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import IoniconsMenu from "@expo/vector-icons/Ionicons";
import IoniconsUser from "@expo/vector-icons/Ionicons";

export default function LayoutMenu({ children, navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.barraTopo}>
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <IoniconsMenu name="menu" size={28} color="white" />
        </TouchableOpacity>


        <TouchableOpacity
          onPress={() => navigation.navigate("Perfil")}
          style={styles.fundoUser}
        >
          <IoniconsUser name="person" size={28} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.conteudo}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#215299", // cor da barra e fundo
  },
  barraTopo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#215299",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  fundoUser: {
    backgroundColor: "#ff0000",
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  conteudo: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
});

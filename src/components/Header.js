import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import IoniconsUser from "@expo/vector-icons/Ionicons";
import { mvs } from "react-native-size-matters"; // A função mvs é útil para escalar tamanhos de fonte.

export default function Header({ toggleVisible, navigation }) {
  return (
    <View style={styles.header}>
      <View style={styles.barraTopo}>
        <Text style={styles.title}>ConecTalento</Text>

        <TouchableOpacity
          onPress={() => toggleVisible()}
          style={styles.fundoUser}
        >
          <IoniconsUser name="person" size={40} color="#949599" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: "100%",
    backgroundColor: "#6a1b9a",
    paddingTop: mvs(20),
    paddingBottom: mvs(10),
    paddingHorizontal: 20,
    alignItems: "center",
  },
  barraTopo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  title: {
    fontSize: mvs(35),
    fontWeight: "bold",
    color: "#fff",
  },
  fundoUser: {
    backgroundColor: "#d2d3d5",
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
});

import { View, TouchableOpacity, Text, StyleSheet, Image } from "react-native";
import IoniconsUser from "@expo/vector-icons/Ionicons";
import { mvs } from "react-native-size-matters"; // A função mvs é útil para escalar tamanhos de fonte.

export default function Header({ toggleVisible, user }) {
  const { tipo_imagem, imagem } = user;

  const uriImage = "data:" + tipo_imagem + ";base64," + imagem;

  return (
    <View style={styles.header}>
      <View style={styles.barraTopo}>
        <Text style={styles.title}>ConecTalento</Text>

        {!imagem || !tipo_imagem ? (
          <TouchableOpacity
            onPress={() => toggleVisible()}
            style={styles.fundoUser}
          >
            <IoniconsUser name="person" size={40} color="#949599" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => {
              toggleVisible();
            }}
            style={styles.fundoUser}
          >
            <Image
              source={{ uri: uriImage }}
              style={{ width: "100%", height: "100%", borderRadius: 9999 }}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: "100%",
    backgroundColor: "#6a1b9a",
    paddingTop: 13,
    paddingBottom: 20,
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

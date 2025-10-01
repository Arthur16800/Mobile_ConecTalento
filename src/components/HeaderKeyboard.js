import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  TextInput,
} from "react-native";
import IoniconsUser from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";
import Entypo from "@expo/vector-icons/Entypo";
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
      <View style={styles.barraBot}>
        <View style={styles.barraPesquisa}>
          <TextInput
            placeholder="Pesquise Projetos:"
            onChangeText={(newText) => setText(newText)}
            value={"ola"}
          />
          <View style={styles.icons}>
            <Feather name="filter" size={30} color="black" />
            <Entypo name="magnifying-glass" size={30} color="black" />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: "100%",
    backgroundColor: "#6a1b9a",
    paddingTop: mvs(10),
    paddingBottom: mvs(10),
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent:"space-evenly"
  },
  barraTopo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingBottom: mvs(10),
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
    paddingHorizontal: 15,
    paddingVertical: 0,
    backgroundColor: "#ffffff",
    marginBottom: 10,
    color: "#000000",
    fontSize: 90,
    alignSelf: "center",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  icons:{
    display:"flex",
    flexDirection:"row",
    gap:10,
  }
});

import {
  View,
  Image,
  TouchableOpacity,
  Text,
  StyleSheet,
  TextInput,
} from "react-native";
import IoniconsUser from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";
import Entypo from "@expo/vector-icons/Entypo";
import { mvs } from "react-native-size-matters"; // A função mvs é útil para escalar tamanhos de fonte.

export default function Header({
  toggleVisible,
  text,
  setText,
  getFunction,
  filterFunction,
  user,
}) {
  const uriImage = "data:" + user.tipo_imagem + ";base64," + user.imagem;
  return (
    <View style={styles.header}>
      <View style={styles.barraTopo}>
        <Text style={styles.title}>ConecTalento</Text>

        {!uriImage ? (
          <TouchableOpacity
            onPress={() => toggleVisible()}
            style={styles.fundoUser}
          >
            <IoniconsUser name="person" size={40} color="#949599" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => {console.log(user) 
              toggleVisible()}}
            style={styles.fundoUser}
          >
            <Image source={{uri:uriImage}} style={{width:"100%", height:"100%", borderRadius:9999}}/>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.barraBot}>
        <View style={styles.barraPesquisa}>
          <TextInput
            style={{ flex: 1 }}
            placeholder="Pesquise Projetos:"
            onChangeText={(newText) => setText(newText)}
            value={text}
            enterKeyHint={"search"}
            onSubmitEditing={() => {
              getFunction();
            }}
          />

          <View style={styles.icons}>
            {filterFunction && (
              <TouchableOpacity onPress={() => filterFunction()}>
                <Feather name="filter" size={30} color="black" />
              </TouchableOpacity>
            )}

            <TouchableOpacity onPress={() => getFunction()}>
              <Entypo name="magnifying-glass" size={30} color="black" />
            </TouchableOpacity>
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
    alignusers: "center",
    justifyContent: "space-evenly",
  },
  barraTopo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignusers: "center",
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
    alignusers: "center",
    justifyContent: "center",
  },
  barraBot: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignusers: "center",
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
    alignusers: "center",
    flexDirection: "row",
  },
  icons: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
  },
});

import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
} from "react-native";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

import Header from "../components/Header";
import InputObj from "../components/InputObj";
import BarraLateral from "../components/BarraLateral";

export default function CriarProjeto({ navigation }) {
  const [isVisible, setIsVisible] = useState(false);
  const [image, setImage] = useState("");
  const [project, setProject] = useState({
    name: "",
    desc: "",
    imgUri: "",
  });

  const toggleVisibleFalse = () => {
    setIsVisible(false);
  };

  const toggleVisibleTrue = () => {
    setIsVisible(true);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <Header toggleVisible={toggleVisibleTrue} />

      <View style={styles.nomeEdit}>
        {/* Texto com nome do usuário */}
        <Text style={styles.title}> Criar um Projeto: </Text>
      </View>

      <View style={styles.settingEdit}>
        <InputObj
          atributo={"Nome do Projeto:"}
          variavel={"name"}
          texto={"Digite o nome do projeto:"}
          obj={project}
          setobj={setProject}
        />

        <InputObj
          atributo={"Descrição:"}
          variavel={"desc"}
          texto={"Digite a descrição do projeto:"}
          obj={project}
          setobj={setProject}
        />

        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Text style={styles.buttonText}>Inserir Imagem</Text>
        </TouchableOpacity>
        {image !== "" && (
            <View>
                <Text style={styles.title}> Imagem Selecionada: </Text>
        <Image source={{ uri: image }} style={styles.image} />
        </View>
        )}
      </View>

      <BarraLateral
        isVisible={isVisible}
        onClose={toggleVisibleFalse}
        navigation={navigation}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  nomeEdit: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    maxHeight: "10%",
    gap: 15,
  },
  settingEdit: {
    width: "85%",
    gap: 12,
  },
  title: {
    fontSize: 40,
  },
  subtitle: {
    fontSize: 20,
    paddingHorizontal: "5%",
  },
  contatoItem: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 12,
  },
  button: {
    backgroundColor: "#803AD6",
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 15,
    alignItems: "center",
    shadowColor: "#803AD6",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
  },
});

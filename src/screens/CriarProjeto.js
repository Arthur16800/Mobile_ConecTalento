import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";

import Header from "../components/Header";
import InputObj from "../components/InputObj";
import BarraLateral from "../components/BarraLateral";
import AddImagem from "../components/AddImagem";

export default function CriarProjeto({ navigation }) {
  const [project, setProject] = useState({
    name: "",
    desc: "",
    imgs: images,
  });

  {
    /* Lógica imagem */
  }

  let images = [];

  const pushImage = (imagem) => {
    images.push(imagem);
    console.log(images);
  };

  const deleteImage = (index) => {
    images.splice(index, 1);
    console.log(images);
  };

  function TesteTotalDeletar() {
    pushImage("Teste");
    deleteImage("Teste");
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      if (images.length < 5) {
        pushImage(result.assets[0].uri);
      } else {
        Alert.alert(
          "Imagens Demais",
          "Limite de 5 imagens atingido, exclua alguma imagem para adicionar novas."
        );
      }
      console.log(images);
    }
  };
  {
    /* Fim lógica imagem */
  }

  {
    /* Lógica visible */
  }
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibleFalse = () => {
    setIsVisible(false);
  };

  const toggleVisibleTrue = () => {
    setIsVisible(true);
  };
  {
    /* Fim lógica visible */
  }

  function renderImages() {
    images.forEach((image, index) => {
      console.log(image, index);
      return <AddImagem image={image} delimage={deleteImage} index={index} />;
    });
  }

  return (
    <View style={styles.container}>
      <Header toggleVisible={toggleVisibleTrue} />
      <ScrollView
        contentContainerStyle={{
          alignItems: "center",
        }}
      >
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

          <TouchableOpacity style={styles.button} onPress={TesteTotalDeletar}>
            <Text style={styles.buttonText}>Inserir Imagem</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

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
  photo: {
    width: "100%",
    height: 400,
  },
});

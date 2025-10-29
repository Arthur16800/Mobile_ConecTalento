import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  StatusBar,
  Dimensions,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import * as SecureStore from "expo-secure-store";
import { SafeAreaView } from "react-native-safe-area-context";

import Header from "../components/Header";
import InputObj from "../components/InputObj";
import BarraLateral from "../components/BarraLateral";
import api from "../axios/axios";

export default function CriarProjeto({ navigation }) {
  const [userId, setId] = useState("");
  const [project, setProject] = useState({
    titulo: "",
    descricao: "",
  });
  const [imagens, setImagens] = useState([]);
  const [loading, setLoading] = useState(false);

  const screenWidth = Dimensions.get("window").width;

  const pushImage = (imagem) => {
    setImagens([...imagens, imagem]);
  };

  const createProject = async (projeto, imagens, userId) => {
    try {
      setLoading(true);
      const result = await api.createProjeto(projeto, imagens, userId);
      if (result) {
        Alert.alert("Projeto Criado com Sucesso!");
        navigation.navigate("Home");
      }
    } catch (error) {
      console.log("Erro na requisição:", error.response.data.error);
    } finally {
      setLoading(false);
    }
  };

  const deleteImage = (indexDelete) => {
    setImagens((prevImages) =>
      prevImages.filter((_, index) => index !== indexDelete)
    );
  };
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        quality: 1,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const { uri } = result.assets[0];
        pushImage(uri);
        if (imagens.length > 4) {
          deleteImage(5);
          Alert.alert(
            "Imagens Demais",
            "Limite de 5 imagens atingido, exclua alguma imagem para adicionar novas."
          );
        }
      }
    } catch (error) {
      console.error("Erro ao selecionar imagem:", error.response?.data?.error);
    }
  };

  function renderImages() {
    return imagens.map((imageUri, index) => (
      <TouchableOpacity key={index} onPress={() => deleteImage(index)}>
        <Image
          source={{ uri: imageUri }}
          style={{
            width: screenWidth * 0.9,
            height: screenWidth * 0.6,
            resizeMode: "cover",
            marginBottom: 10,
            borderRadius: 50,
          }}
        />
      </TouchableOpacity>
    ));
  }

  async function getIds() {
    const idbuffer = await SecureStore.getItemAsync("id");
    setId(idbuffer);
  }

  useEffect(() => {
    getIds();
  }, []);

  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibleFalse = () => {
    setIsVisible(false);
  };
  const toggleVisibleTrue = () => {
    setIsVisible(true);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.container}>
        <StatusBar hidden={false} backgroundColor="#fff" />
        <Header toggleVisible={toggleVisibleTrue} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            alignItems: "center",
            flexGrow: 1,
            marginHorizontal: "5%",
          }}
        >
          <View style={styles.nomeEdit}>
            <Text style={styles.title}> Criar um Projeto: </Text>
          </View>

          <View style={styles.settingEdit}>
            <InputObj
              atributo={"Nome do Projeto:"}
              variavel={"titulo"}
              texto={"Digite o nome do projeto:"}
              obj={project}
              setobj={setProject}
            />

            <InputObj
              atributo={"Descrição:"}
              variavel={"descricao"}
              texto={"Digite a descrição do projeto:"}
              obj={project}
              setobj={setProject}
            />

            <TouchableOpacity style={styles.button} onPress={pickImage}>
              <Text style={styles.buttonText}>Inserir Imagem</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              disabled={loading}
              onPress={() => {
                createProject(project, imagens, userId);
              }}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.buttonText}>Criar Projeto</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.imagesContainer}>
            {imagens.length > 0 ? (
              renderImages()
            ) : (
              <Text>Sem imagem anexada.</Text>
            )}
          </View>
        </ScrollView>

        <BarraLateral
          isVisible={isVisible}
          onClose={toggleVisibleFalse}
          navigation={navigation}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  nomeEdit: {
    flex: 0.3,
    alignItems: "center",
    marginVertical: "5%",
  },
  settingEdit: {
    width: "100%",
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
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
  },
  imagesContainer: {
    width: "95%",
    marginTop: 20,
    alignItems: "center",
  },
  photo: {
    width: "95%",
    height: "30%",
  },
});

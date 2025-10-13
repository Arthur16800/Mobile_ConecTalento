import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  StatusBar,
  Dimensions,
} from "react-native";
import { useEffect, useLayoutEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";

import Header from "../components/Header";
import InputObj from "../components/InputObj";
import BarraLateral from "../components/BarraLateral";
import AddImagem from "../components/AddImagem";

export default function CriarProjeto({ navigation }) {
  const [project, setProject] = useState({
    name: "",
    desc: "",
    imgs: [],
  });

  useLayoutEffect(() => {
    StatusBar.setBarStyle("dark-content"); 
    StatusBar.setBackgroundColor("transparent"); 
  }, []);

  const screenWidth = Dimensions.get("window").width;
  {
    /* Lógica imagem */
  }

  let images = project.imgs;

  const pushImage = (imagem) => {
    setProject((prevProject) => ({
      ...prevProject,
      imgs: [...prevProject.imgs, imagem],
    }));
  };

  const deleteImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setProject((prevProject) => ({
      ...prevProject,
      imgs: newImages,
    }));
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      if (images.length < 5) {
        pushImage(uri);
      } else {
        Alert.alert(
          "Imagens Demais",
          "Limite de 5 imagens atingido, exclua alguma imagem para adicionar novas."
        );
      }
      console.log(project.imgs);
    }
  };

  function renderImages() {
    if (images.length === 0) {
      return <Text>Nenhuma imagem anexada.</Text>;
    } else {
      return images.map((imageUri, index) => (
        <Image
          key={index}
          source={{ uri: imageUri }}
          style={{
            width: screenWidth, 
            height: screenWidth * 0.6, 
            resizeMode: "cover",
            marginBottom: 10,
            borderRadius: 12,
          }}
        />
      ));
    }
  }

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

  return (
    <View style={styles.container}>
      <Header toggleVisible={toggleVisibleTrue} />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{
            alignItems: "center",
            flexGrow: 1,
          }}
        >
          <View style={styles.nomeEdit}>
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
          </View>

          <View style={styles.imagesContainer}>
            {images.length > 0 ? renderImages() : <Text> Sem imagem anexada. </Text>}
          </View>
        </ScrollView>
      </SafeAreaView>

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
    marginTop: 20,
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
    width: "100%",
    marginTop: 20,
    alignItems: "center",
  },
  photo: {
    width: "100%",
    height: "30%",
  },
});

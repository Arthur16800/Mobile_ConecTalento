import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as SecureStore from "expo-secure-store";
import sheets from "../axios/axios"; // ✅ IMPORTAÇÃO CORRETA

export default function AtualizarProjeto({ route, navigation }) {
  const { ID_projeto } = route.params || {};
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [project, setProject] = useState({
    titulo: "",
    descricao: "",
    imagem: null,
    tipo_imagem: null,
  });

  // 🔹 Buscar projeto existente
  useEffect(() => {
    async function fetchProject() {
      try {
        const res = await sheets.getProjectById(ID_projeto);
        const data =
          res.data?.projeto || res.data?.profile_projeto || res.data || null;

        if (data) {
          setProject({
            titulo: data.titulo || data.title || "",
            descricao: data.descricao || data.description || "",
            imagem: data.imagem || (data.imagens?.[0]?.imagem ?? null),
            tipo_imagem:
              data.tipo_imagem || (data.imagens?.[0]?.tipo_imagem ?? null),
          });
        }
      } catch (error) {
        console.log("Erro ao buscar projeto:", error);
        Alert.alert("Erro", "Não foi possível carregar os dados do projeto.");
      } finally {
        setLoading(false);
      }
    }

    if (ID_projeto) fetchProject();
  }, [ID_projeto]);

  // 🔹 Selecionar imagem da galeria
  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      const img = result.assets[0];
      setProject({
        ...project,
        imagem: img.uri,
        tipo_imagem: img.mimeType || "image/jpeg",
      });
    }
  };

  // 🔹 Atualizar projeto
  const handleUpdate = async () => {
    if (!project.titulo.trim()) {
      Alert.alert("Erro", "O título não pode estar vazio.");
      return;
    }
  
    try {
      setUpdating(true);
  
      // pega ID do usuário salvo (string)
      const ID_user = await SecureStore.getItemAsync("id");
  
      if (!ID_user) {
        Alert.alert("Erro", "Usuário não autenticado. Faça login novamente.");
        return;
      }
  
      // DEBUG: mostra token e ID_user no console (remova depois)
      const token = await SecureStore.getItemAsync("token");
      console.log("DEBUG - token (início update):", token ? token.slice(0, 20) + "..." : null);
      console.log("DEBUG - ID_user (início update):", ID_user);
  
      // ▶️ Aqui passamos um objeto simples (não FormData)
      const form = {
        titulo: project.titulo,
        descricao: project.descricao,
        ID_user, // importante: backend espera esse campo no body
      };
  
      // ▶️ Array de URIs (o putProject cuidará de transformar em FormData)
      const imagens = project.imagem && project.imagem.startsWith("file")
        ? [project.imagem]
        : [];
  
      // chama a função do axios que monta o FormData e envia o token via interceptor
      const res = await sheets.putProject(ID_projeto, form, imagens);
  
      if (res.status === 200) {
        Alert.alert("Sucesso", "Projeto atualizado com sucesso!");
        navigation.goBack();
      } else {
        console.log("Resposta inesperada:", res.status, res.data);
        Alert.alert("Erro", "Não foi possível atualizar o projeto.");
      }
    } catch (error) {
      // mostra erro detalhado
      console.log("Erro ao atualizar projeto:", error.response?.data || error.message || error);
      Alert.alert(
        "Erro",
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Falha ao atualizar o projeto. Verifique os campos."
      );
    } finally {
      setUpdating(false);
    }
  };
  
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#7A2CF6" />
      </TouchableOpacity>

      <Text style={styles.title}>Editar Projeto</Text>

      <TextInput
        style={styles.input}
        placeholder="Título do projeto"
        value={project.titulo}
        onChangeText={(text) => setProject({ ...project, titulo: text })}
      />

      <TextInput
        style={[styles.input, { height: 120, textAlignVertical: "top" }]}
        multiline
        placeholder="Descrição do projeto"
        value={project.descricao}
        onChangeText={(text) => setProject({ ...project, descricao: text })}
      />

      <TouchableOpacity style={styles.imagePicker} onPress={handleImagePick}>
        {project.imagem ? (
          <Image
            source={{
              uri: project.imagem.startsWith("data:")
                ? project.imagem
                : project.imagem.startsWith("file")
                ? project.imagem
                : `data:${project.tipo_imagem};base64,${project.imagem}`,
            }}
            style={styles.imagePreview}
          />
        ) : (
          <Text style={{ color: "#7A2CF6" }}>Selecionar Imagem</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, updating && { opacity: 0.7 }]}
        onPress={handleUpdate}
        disabled={updating}
      >
        <Text style={styles.buttonText}>
          {updating ? "Atualizando..." : "Salvar Alterações"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F6F3FF",
    flexGrow: 1,
  },
  centered: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#7A2CF6",
    marginBottom: 16,
    textAlign: "center",
  },
  backButton: {
    alignSelf: "flex-start",
    marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    elevation: 2,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  imagePicker: {
    height: 180,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#7A2CF6",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    backgroundColor: "#fff",
  },
  imagePreview: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  button: {
    backgroundColor: "#7A2CF6",
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});

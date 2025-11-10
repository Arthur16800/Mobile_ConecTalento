import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import api from "../axios/axios";
import * as SecureStore from "expo-secure-store";
import Header from "../components/Header";
import BarraLateral from "../components/BarraLateral";

const screenWidth = Dimensions.get("window").width;

export default function ProjetoInfo({ route, navigation }) {
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibleFalse = () => setIsVisible(false);
  const toggleVisibleTrue = () => setIsVisible(true);
  const [user, setUser] = useState({
    username:"",
    imagem: "",
    tipo_imagem: "",
  });

  const params = route.params || {};
  const routeItem = params.item || null;
  const routeId = params.id || params.ID_projeto || params.projectId || null;

  const [itemState, setItemState] = useState(routeItem);
  const [creator, setCreator] = useState(null);
  const [loadingCreator, setLoadingCreator] = useState(false);
  const [userId, setUserId] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(
    routeItem?.total_curtidas ?? routeItem?.likes ?? 0
  );
  const [notFound, setNotFound] = useState(false);

  const buildProjectImageUri = (it) => {
    if (!it) return null;
    if (Array.isArray(it.imagens) && it.imagens.length > 0) {
      const first = it.imagens[0];
      if (first && first.imagem && first.tipo_imagem)
        return `data:${first.tipo_imagem};base64,${first.imagem}`;
    }
    if (it.imagem && it.tipo_imagem)
      return `data:${it.tipo_imagem};base64,${it.imagem}`;
    return it.image || it.image_url || null;
  };

  const projectImageUri = buildProjectImageUri(itemState);

  useEffect(() => {
    async function fetchCreator() {
      if (!itemState) return;

      if (itemState.autor) {
        setCreator(itemState.autor);
        return;
      }

      const username =
        itemState.username ||
        itemState.user_name ||
        itemState.usuario ||
        itemState.autor?.username;
      if (!username) return;

      try {
        setLoadingCreator(true);
        const res = await api.getUserByName(String(username));
        const profile = res.data?.profile || res.data || null;
        if (profile) setCreator(profile);
      } catch (err) {
        // ignore
      } finally {
        setLoadingCreator(false);
      }
    }
    fetchCreator();
  }, [itemState]);

  useEffect(() => {
    async function getUser() {
      try {
        const id = await SecureStore.getItemAsync("id");
        if (id) {
          setUserId(id);
          try {
            const res = await api.getProjectsLikedUser(id);
            const likedProjects =
              res.data && res.data.profile_projeto
                ? res.data.profile_projeto.map((p) => p.ID_projeto)
                : [];
            if (itemState && likedProjects.includes(itemState.ID_projeto))
              setLiked(true);
          } catch (err) {
            // ignore
          }
        }
      } catch (err) {
        // silent
      }
    }
    getUser();
  }, [itemState]);

  useEffect(() => {
    if (!itemState) return;
    setLikesCount(itemState.total_curtidas ?? itemState.likes ?? likesCount);
  }, [itemState]);

  useEffect(() => {
    let active = true;
    async function fetchProjectById() {
      // If we already have a full item with descricao or imagens, no need to fetch
      const hasDescricao =
        itemState &&
        typeof itemState.descricao !== "undefined" &&
        itemState.descricao !== null &&
        String(itemState.descricao).trim().length > 0;
      const hasImagens =
        itemState &&
        Array.isArray(itemState.imagens) &&
        itemState.imagens.length > 0;

      if (!routeId && itemState && (hasDescricao || hasImagens)) return;

      const idToFetch =
        routeId ||
        (itemState && itemState.ID_projeto ? itemState.ID_projeto : null);
      if (!idToFetch) return;

      try {
        const res = await api.getProjectById(idToFetch);
        if (!active) return;
        const proj =
          res.data?.projeto || res.data?.profile_projeto || res.data || null;
        if (proj) {
          setItemState(proj);
          setLikesCount(proj.total_curtidas ?? proj.likes ?? likesCount);
        }
      } catch (err) {
        // silent
        // If needed, developer can inspect err in debugger
        if (err?.response?.status === 404) {
          setNotFound(true);
        }
      }
    }
    fetchProjectById();
    return () => {
      active = false;
    };
  }, [routeId, itemState]);

  async function getUser() {
    try {
      const response = await api.getUserByName(username)
      setUser({
        tipo_imagem: response.data.profile.tipo_imagem || null,
        imagem: response.data.profile.imagem || null
      })
    } catch (error) {}
  }

  useEffect(() => {
    async function fetchData() {
      try {
          await getUser(itemState.username);
        
      } catch (error) {
        console.log("Erro ao buscar username ou projetos:", error);
      }
    }
    fetchData();
  }, [itemState.username]);

  const handleLike = async () => {
    if (!userId) return;
    if (!itemState || !itemState.ID_projeto) return;
    try {
      const res = await api.likeProject(itemState.ID_projeto, userId);
      if (res.data && typeof res.data.curtido !== "undefined") {
        if (res.data.curtido) {
          setLiked(true);
          setLikesCount((prev) => prev + 1);
        } else {
          setLiked(false);
          setLikesCount((prev) => Math.max(prev - 1, 0));
        }
      }
    } catch (err) {
      console.error("Erro ao curtir o projeto:", err);
    }
  };

  const creatorName =
    (creator && (creator.name || creator.username)) ||
    itemState?.nome_criador ||
    itemState?.nome ||
    itemState?.username ||
    "Usuário";


  const creatorImageUri =
    creator && creator.imagem && creator.tipo_imagem
      ? `data:${creator.tipo_imagem};base64,${creator.imagem}`
      : itemState && itemState.imagem_usuario && itemState.tipo_imagem_usuario
      ? `data:${itemState.tipo_imagem_usuario};base64,${itemState.imagem_usuario}`
      : null;

      
  const creatorBio =
    (creator && (creator.biografia || creator.bio)) ||
    itemState?.biografia ||
    null;

  let projectDescription =
    itemState?.descricao ||
    itemState?.description ||
    itemState?.texto ||
    itemState?.sobre ||
    itemState?.about ||
    "";
  if (!projectDescription || projectDescription.trim().length === 0) {
    const excludeKeys = new Set([
      "imagem",
      "tipo_imagem",
      "ID_projeto",
      "ID_user",
      "titulo",
      "title",
      "total_curtidas",
      "likes",
      "username",
      "usuario",
      "nome",
      "nome_criador",
    ]);
    for (const key of Object.keys(itemState || {})) {
      if (excludeKeys.has(key)) continue;
      const val = itemState[key];
      if (typeof val === "string" && val.trim().length > 10) {
        projectDescription = val;
        break;
      }
    }
  }
  if (!projectDescription || projectDescription.trim().length === 0)
    projectDescription = "Sem descrição";

  if (!itemState) {
    if (routeId)
      return (
        <View style={styles.centered}>
          <ActivityIndicator size={48} />
        </View>
      );
    return (
      <View style={styles.centered}>
        <Text>Projeto não encontrado.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header toggleVisible={toggleVisibleTrue} user={user} />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={{ width: "100%", paddingHorizontal: 16, marginTop: 8 }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.headerBack}
          >
            <Ionicons name="arrow-back" size={22} color="#7A2CF6" />
          </TouchableOpacity>
        </View>
        <View style={styles.cardMain}>
          {projectImageUri ? (
            <Image
              source={{ uri: projectImageUri }}
              style={styles.projectImage}
            />
          ) : (
            <View style={[styles.projectImage, styles.imagePlaceholder]}>
              <Text style={{ color: "#666" }}>Sem imagem</Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.likeButton}
            onPress={handleLike}
            activeOpacity={0.8}
          >
            <View
              style={[styles.heartCircle, liked ? styles.heartActive : null]}
            >
              <Ionicons
                name={liked ? "heart" : "heart-outline"}
                size={20}
                color={liked ? "#fff" : "#000"}
              />
            </View>
            <View style={styles.likeCountContainer}>
              <Text style={styles.likeCountText}>{likesCount}</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.titleRow}>
            <Text style={styles.title}>
              {itemState.titulo || itemState.title}
            </Text>
          </View>

          <View style={styles.creatorCard}>
            <View style={styles.creatorLeft}>
              {creatorImageUri ? (
                <Image
                  source={{ uri: creatorImageUri }}
                  style={styles.avatar}
                />
              ) : (
                <View style={[styles.avatar, styles.avatarPlaceholder]}>
                  <Ionicons name="person" size={24} color="#fff" />
                </View>
              )}

              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={styles.creatorName}>{creatorName}</Text>
                {itemState.username || (creator && creator.username) ? (
                  <Text style={styles.creatorUsername}>
                    @{itemState.username || creator.username}
                  </Text>
                ) : null}
                {creatorBio ? (
                  <Text style={styles.creatorBio} numberOfLines={2}>
                    {creatorBio}
                  </Text>
                ) : null}
              </View>
            </View>

            <TouchableOpacity
              style={styles.viewProfileButton}
              onPress={() => {
                // navigate to profile screen if username available
                const username =
                  itemState?.username ||
                  creator?.username ||
                  itemState?.autor?.username;
                if (username) navigation.navigate("Perfil", { username });
              }}
            >
              <Text style={styles.viewProfileText}>Ver perfil</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.descriptionCard}>
            <Text style={styles.sectionTitle}>Descrição</Text>
            <Text style={styles.description}>{projectDescription}</Text>
          </View>
        </View>
      </ScrollView>
      <BarraLateral
        isVisible={isVisible}
        onClose={toggleVisibleFalse}
        navigation={navigation}
      />
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("AtualizarProjeto", {
            ID_projeto: itemState?.ID_projeto ?? routeId,
          })
        }
      >
        <Text style={styles.buttonText}>Editar projeto</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6F3FF" },
  header: {
    paddingTop: 40,
    paddingHorizontal: 16,
    paddingBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#7A2CF6",
  },
  headerTitle: { fontSize: 16, fontWeight: "700", color: "#fff" },
  content: {
    alignItems: "center",
    padding: 12,
    paddingBottom: 20,
    paddingHorizontal: 0,
  },
  projectImage: {
    width: screenWidth * 0.95,
    height: screenWidth * 0.55,
    borderRadius: 12,
    backgroundColor: "#ddd",
  },
  imagePlaceholder: { alignItems: "center", justifyContent: "center" },
  creatorRow: { width: "100%", marginTop: 14, alignItems: "flex-start" },
  creatorInner: { flexDirection: "row", alignItems: "center" },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: "#bbb" },
  avatarPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#999",
  },
  creatorName: { fontSize: 16, fontWeight: "700" },
  creatorUsername: { color: "#666", marginTop: 2 },
  creatorBio: { color: "#444", marginTop: 6 },
  infoBlock: { width: "100%", marginTop: 16 },
  title: { fontSize: 18, fontWeight: "800", marginBottom: 8 },
  description: { fontSize: 15, color: "#333", lineHeight: 20 },
  centered: { flex: 1, alignItems: "center", justifyContent: "center" },
  likeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  heartCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    elevation: 3,
  },
  heartActive: { backgroundColor: "#ff4d4d" },
  likeCountContainer: {
    marginLeft: 8,
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  likeCountText: { fontWeight: "700" },
  headerBack: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    elevation: 2,
  },
  cardMain: {
    width: screenWidth * 0.95,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingBottom: 12,
    marginTop: 8,
    marginBottom: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    elevation: 6,
    alignSelf: "center",
  },
  titleRow: {
    width: "100%",
    paddingHorizontal: 16,
    marginTop: 8,
    alignItems: "flex-start",
  },
  creatorCard: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    paddingHorizontal: 16,
    marginTop: 8,
  },
  creatorLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  viewProfileButton: {
    backgroundColor: "#7A2CF6",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  viewProfileText: { color: "#fff", fontWeight: "700" },
  descriptionCard: {
    width: "100%",
    backgroundColor: "#F3EEFC",
    padding: 12,
    marginTop: 10,
    borderRadius: 10,
    paddingHorizontal: 16,
  },
  sectionTitle: { fontWeight: "800", marginBottom: 8 },

  buttonText : {
    padding: 10,
    marginBottom: 30,
  }
  
});

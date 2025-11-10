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
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import sheets from "../axios/axios"; // Importação renomeada de 'api' para 'sheets'
import * as SecureStore from "expo-secure-store";
import Header from "../components/Header";
import BarraLateral from "../components/BarraLateral";
import Feather from "@expo/vector-icons/Feather";

const screenWidth = Dimensions.get("window").width;

export default function ProjetoInfo({ route, navigation }) {
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibleFalse = () => setIsVisible(false);
  const toggleVisibleTrue = () => setIsVisible(true);
  const [user, setUser] = useState({
    username: "",
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
  const [isMe, setIsMe] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const getSingleProjectImageUri = (it) => {
    if (!it) return null;
    if (Array.isArray(it.imagens) && it.imagens.length > 0) {
      return null;
    }
    if (it.imagem && it.tipo_imagem)
      return `data:${it.tipo_imagem};base64,${it.imagem}`;
    return it.image || it.image_url || null;
  };
  const projectImageUri = getSingleProjectImageUri(itemState);

  // 1. Fetch Creator
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
        const res = await sheets.getUserByName(String(username)); // sheets.getUserByName
        const profile = res.data?.profile || res.data || null;
        if (profile) setCreator(profile);
      } catch (err) {
      } finally {
        setLoadingCreator(false);
      }
    }
    fetchCreator();
  }, [itemState]);

  // 2. Get User ID, Username e Like Status
  useEffect(() => {
    async function getUserAndLikeStatus() {
      try {
        const id = await SecureStore.getItemAsync("id");
        const uname = await SecureStore.getItemAsync("username");

        if (uname) {
          setUser((prev) => ({ ...prev, username: uname }));
        }

        if (id) {
          setUserId(id);
          try {
            const res = await sheets.getProjectsLikedUser(id); // sheets.getProjectsLikedUser
            const likedProjects =
              res.data && res.data.profile_projeto
                ? res.data.profile_projeto.map((p) => p.ID_projeto)
                : [];
            const currentProjectId = itemState?.ID_projeto || routeId;
            if (currentProjectId && likedProjects.includes(currentProjectId))
              setLiked(true);
          } catch (err) {}
        }
      } catch (err) {}
    }
    getUserAndLikeStatus();
  }, [itemState, routeId]);

  // 3. Update Likes Count (Mantido, não usa API)
  useEffect(() => {
    if (!itemState) return;
    setLikesCount(itemState.total_curtidas ?? itemState.likes ?? likesCount);
  }, [itemState]);

  // 4. Fetch Project by ID (if needed)
  useEffect(() => {
    let active = true;
    async function fetchProjectById() {
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
        const res = await sheets.getProjectById(idToFetch); // sheets.getProjectById
        if (!active) return;
        const proj =
          res.data?.projeto || res.data?.profile_projeto || res.data || null;
        if (proj) {
          setItemState(proj);
          setLikesCount(proj.total_curtidas ?? proj.likes ?? likesCount);
        }
      } catch (err) {}
    }
    fetchProjectById();
    return () => {
      active = false;
    };
  }, [routeId, itemState]);

  // 5. Check if the logged user is the project creator (Mantido, não usa API)
  useEffect(() => {
    if (!itemState || !user?.username) return;

    const creatorUsername =
      itemState.username ||
      itemState.user_name ||
      itemState.usuario ||
      itemState.autor?.username ||
      creator?.username;

    if (creatorUsername && user.username) {
      setIsMe(
        String(creatorUsername).toLowerCase() ===
          String(user.username).toLowerCase()
      );
    }
  }, [creator, user, itemState]);

  // 6. Fetch User for Header (Mantido)
  useEffect(() => {
    async function fetchData() {
      if (!itemState?.username) return;
      try {
        const username = itemState.username;
        const response = await sheets.getUserByName(username); // sheets.getUserByName
        setUser({
          ...user,
          tipo_imagem: response.data.profile.tipo_imagem || null,
          imagem: response.data.profile.imagem || null,
        });
      } catch (error) {}
    }
    fetchData();
  }, [itemState.username]);

  // --- FUNÇÕES DE AÇÃO ---

  const handleLikeToggle = async () => {
    if (!userId) {
      Alert.alert(
        "Atenção",
        "Você precisa estar logado para curtir um projeto."
      );
      return;
    }

    const projectId = itemState?.ID_projeto || routeId;
    if (!projectId) return;

    try {
      if (liked) {
        await sheets.unlikeProject(userId, projectId); // sheets.unlikeProject
        setLiked(false);
        setLikesCount((prev) => Math.max(prev - 1, 0));
      } else {
        await sheets.likeProject(userId, projectId); // sheets.likeProject
        setLiked(true);
        setLikesCount((prev) => prev + 1);
      }
    } catch (err) {
      console.error("Erro ao curtir/descurtir:", err);
      Alert.alert(
        "Erro",
        "Não foi possível registrar sua curtida. Tente novamente."
      );
    }
  };

  const handleDelete = () => {
    if (!isMe || !userId) return;

    Alert.alert(
      "Confirmar Exclusão",
      "Tem certeza que deseja excluir este projeto? Esta ação é irreversível.",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          onPress: async () => {
            try {
              const projectId = itemState?.ID_projeto || routeId;
              if (!projectId) {
                Alert.alert("Erro", "ID do projeto não encontrado.");
                return;
              }

              await sheets.deleteProject(projectId, userId); // sheets.deleteProject

              Alert.alert("Sucesso", "Projeto excluído com sucesso.");
              navigation.goBack();
            } catch (error) {
              const errorMessage =
                error.response?.data?.error ||
                "Falha ao excluir o projeto. Verifique suas permissões.";
              Alert.alert("Erro", errorMessage);
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  const handleEdit = () => {
    if (!isMe) return;
    Alert.alert("Ação", "Navegar para a tela de edição do projeto.");
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
    itemState?.descricao || itemState?.description || "Sem descrição";

  if (!itemState) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size={48} color="#7A2CF6" />
        <Text style={{ marginTop: 10 }}>Carregando projeto...</Text>
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
          <View style={styles.carouselContainer}>
            {Array.isArray(itemState?.imagens) &&
            itemState.imagens.length > 0 ? (
              <>
                <Image
                  source={{
                    uri: `data:${itemState.imagens[activeIndex].tipo_imagem};base64,${itemState.imagens[activeIndex].imagem}`,
                  }}
                  style={styles.projectImage}
                  resizeMode="cover"
                />

                {itemState.imagens.length > 1 && (
                  <>
                    <TouchableOpacity
                      style={[styles.arrowButton, { left: 8 }]}
                      onPress={() =>
                        setActiveIndex(
                          activeIndex === 0
                            ? itemState.imagens.length - 1
                            : activeIndex - 1
                        )
                      }
                    >
                      <Ionicons name="chevron-back" size={28} color="#fff" />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.arrowButton, { right: 8 }]}
                      onPress={() =>
                        setActiveIndex(
                          activeIndex === itemState.imagens.length - 1
                            ? 0
                            : activeIndex + 1
                        )
                      }
                    >
                      <Ionicons name="chevron-forward" size={28} color="#fff" />
                    </TouchableOpacity>

                    <View style={styles.dotsContainer}>
                      {itemState.imagens.map((_, index) => (
                        <Text
                          key={index}
                          style={
                            index === activeIndex
                              ? styles.dotActive
                              : styles.dot
                          }
                        >
                          ●
                        </Text>
                      ))}
                    </View>
                  </>
                )}
              </>
            ) : projectImageUri ? (
              <Image
                source={{ uri: projectImageUri }}
                style={styles.projectImage}
              />
            ) : (
              <View style={[styles.projectImage, styles.imagePlaceholder]}>
                <Text style={{ color: "#666" }}>Sem imagem</Text>
              </View>
            )}
          </View>

          <View style={styles.titleRow}>
            <View style={styles.titleContent}>
              <Text style={styles.title}>
                {itemState.titulo || itemState.title}
              </Text>
              <TouchableOpacity
                onPress={handleLikeToggle}
                style={styles.likeButton}
              >
                <Ionicons
                  name={liked ? "heart" : "heart-outline"}
                  size={28}
                  color={liked ? "#FF4D4D" : "#777"}
                />
                <Text style={styles.likesCountText}>{likesCount}</Text>
              </TouchableOpacity>
            </View>
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

            <View style={styles.creatorActions}>
              {isMe && (
                <>
                  <TouchableOpacity
                    onPress={handleDelete}
                    style={styles.actionButton}
                  >
                    <Feather name="trash-2" size={22} color="#FF4D4D" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleEdit}
                    style={styles.actionButton}
                  >
                    <MaterialCommunityIcons
                      name="pencil-outline"
                      size={24}
                      color="#7A2CF6"
                    />
                  </TouchableOpacity>
                </>
              )}

              <TouchableOpacity
                style={styles.viewProfileButton}
                onPress={() => {
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6F3FF" },
  content: {
    alignItems: "center",
    padding: 12,
    paddingBottom: 20,
    paddingHorizontal: 0,
  },
  centered: { flex: 1, alignItems: "center", justifyContent: "center" },
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
  projectImage: {
    width: screenWidth * 0.95,
    height: screenWidth * 0.55,
    borderRadius: 12,
    backgroundColor: "#ddd",
  },
  imagePlaceholder: { alignItems: "center", justifyContent: "center" },
  carouselContainer: {
    width: screenWidth * 0.95,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    marginBottom: 8,
  },
  arrowButton: {
    position: "absolute",
    top: "45%",
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 20,
    padding: 6,
    zIndex: 2,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 6,
    position: "absolute",
    bottom: 10,
  },
  dot: {
    color: "#ccc",
    fontSize: 10,
    marginHorizontal: 3,
  },
  dotActive: {
    color: "#7A2CF6",
    fontSize: 10,
    marginHorizontal: 3,
  },
  titleRow: {
    width: "100%",
    paddingHorizontal: 16,
    marginTop: 8,
  },
  titleContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 8,
    flexShrink: 1,
  },
  likeButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 4,
    marginLeft: 10,
  },
  likesCountText: {
    marginLeft: 4,
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  creatorCard: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    paddingHorizontal: 16,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 16,
  },
  creatorLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: "#bbb" },
  avatarPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#999",
  },
  creatorName: { fontSize: 16, fontWeight: "700" },
  creatorUsername: { color: "#666", marginTop: 2 },
  creatorBio: { color: "#444", marginTop: 6 },
  creatorActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    padding: 8,
  },
  viewProfileButton: {
    backgroundColor: "#7A2CF6",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 10,
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 8,
    color: "#333",
  },
  description: { fontSize: 15, color: "#333", lineHeight: 22 },
});

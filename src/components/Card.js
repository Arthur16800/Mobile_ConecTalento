import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import { Badge } from 'react-native-paper';
import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import api from "../axios/axios"

const screenWidth = Dimensions.get("window").width;

const Card = ({ imageSource, item, styleCard }) => {
  const [userId, setUserId] = useState("");
  const [liked, setLiked] = useState(false);
  const [scale] = useState(new Animated.Value(1));
  const [likesCount, setLikesCount] = useState(item.total_curtidas);

  useEffect(() => {
    if (userId) {
      api
        .getProjectsLikedUser(userId)
        .then((res) => {
          const likedProjects = res.data.profile_projeto.map(
            (p) => p.ID_projeto
          );
          if (likedProjects.includes(item.ID_projeto)) setLiked(true);
        })
        .catch((err) => console.log("Erro ao verificar curtidas:", err));
    }
  }, [item.ID_projeto, userId]);

  useEffect(()=>{
    async function getIdUser(){
      setUserId(await SecureStore.getItemAsync("id"));
    }
    getIdUser();
  },[])

  const handleLikeAPI = async () => {
    try {
      const res = await api.likeProject(item.ID_projeto, userId);

      if (res.data.curtido) {
        setLiked(true);
        setLikesCount((prev) => prev + 1);
      } else {
        setLiked(false);
        setLikesCount((prev) => Math.max(prev - 1, 0));
      }
    } catch (err) {
      console.error("Erro ao curtir:", err);
      if (err.response) {
        console.log("Status:", err.response.status);
        console.log("Dados do erro:", err.response.data);
      }
  }
}

  const handleLike = () => {    
    if (handleLikeAPI) {
      handleLikeAPI();
    }

    // Animação do coração
    Animated.spring(scale, {
      toValue: 1.2,
      friction: 3,
      useNativeDriver: true,
    }).start(() => {
      Animated.spring(scale, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }).start();
    });
  };

  return (
    <View style={styleCard}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageSource }} style={styles.imagem} />

        <TouchableOpacity onPress={handleLike} style={styles.heartButton}>
          <Animated.View style={[styles.circle, { transform: [{ scale }] }]}>
            <Ionicons
              name={liked ? "heart" : "heart-outline"}
              size={20}
              color={liked ? "red" : "black"}
            />
          </Animated.View>
          <Badge>{likesCount}</Badge>
        </TouchableOpacity>
      </View>

      <Text style={styles.item}>{item.titulo}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    width: screenWidth * 0.8,
    height: screenWidth * 0.5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#DADADA",
    marginBottom: 10,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
    marginTop: 15,
  },
  imagem: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  heartButton: {
    position: "absolute",
    top: -15,
    right: -20,
    zIndex: 2,
  },
  circle: {
    backgroundColor: "white",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "black",
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  likesCountText: {
    position: "absolute",
    bottom: -1,
    fontSize: 12,
    color: "#000",
  },
  item: {
    marginVertical: 5,
    marginBottom: 12.5,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default Card;

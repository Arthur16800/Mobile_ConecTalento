import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

const Card = ({ imageSource, title, onLike, styleCard }) => {
  const [liked, setLiked] = useState(false);
  const [scale] = useState(new Animated.Value(1));
  const [count, setCount] = useState(0); // Para contar as curtidas


  const handleLike = () => {
    const newLikedState = !liked;
    setLiked(newLikedState);
    if (newLikedState) {
      setCount(count + 1); // Incrementa o contador quando curtir
    } else {
      setCount(count - 1); // Decrementa o contador se desfizer o like
    }

    // Chama a função onLike se fornecida
    if (onLike) {
      onLike(newLikedState);
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
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>{title}</Text>
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
    marginTop:15
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
  countText: {
    position: "absolute",
    bottom: -1,
    fontSize: 12,
    color: "#000",
  },
  title: {
    marginVertical: 5,
    marginBottom:12.5,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default Card;
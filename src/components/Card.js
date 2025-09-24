import React, { useState } from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import ImagemProjeto from '../components/ImagemProjeto'; 

const Card = ({ imageSource, title, onLike }) => {
  const [liked, setLiked] = useState(false);

  const handleLike = (newLikedState) => {
    setLiked(newLikedState);
    if (onLike) {
    onLike(newLikedState); 
    }
  };

  
  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image source={imageSource} style={styles.imagem} />
        <ImagemProjeto onPress={handleLike} /> {/* Coração */}
        {liked && <Text style={styles.countText}>1</Text>} {/* Número de curtidas */}
      </View>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#DADADA", 
    width: 270, 
    height: 270, 
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 60,
    bottom: 40,
  },
  imageContainer: {
    position: 'relative',
    width: 200,
    height: 150,
    marginBottom: 20,
  },
  imagem: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  heartButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  countText: {
    position: 'absolute',
    top: 30,
    right: 10,
    fontSize: 12,
    fontWeight: 'bold',
    color: "#fff",
  },
  title: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Card;

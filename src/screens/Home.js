import React, { useState } from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import BarraLateral from "../components/BarraLateral";
import ProjetoImagem from '../../assets/ProjetoImagem.png'; 
import Header from '../components/HeaderKeyboard';
import Card from '../components/Card';

export default function Home({ navigation }) {
    const [isVisible, setIsVisible] = useState(false);

  const toggleVisibleFalse = () => setIsVisible(false);
  const toggleVisibleTrue = () => setIsVisible(true);

  const handleLike = (newLikedState) => {
    console.log('Curtido:', newLikedState);
  };

  return (
    <View style={styles.container}>
      <Header toggleVisible={toggleVisibleTrue} navigation={navigation} />
      
      <View style={styles.headerContent}> 
        <View style={styles.card}>
          <View style={styles.imageContainer}>
            <Image source={ProjetoImagem} style={styles.imagem} />
            <Card onPress={handleLike} />
          </View>
        </View>
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
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },
  headerContent: {
    width: '100%',
    height: 200, 
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 250, 
    zIndex: 1,
  },
  card: {
    backgroundColor: "#DADADA", 
    width: 280, 
    height: 250, 
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  imageContainer: {
    position: 'relative', 
    width: 250, 
    height: 170, 
  },
  imagem: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  heartButton: {
    position: 'absolute', 
    top: 20, 
    right: 20,
  },
  title: {
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
  },
});

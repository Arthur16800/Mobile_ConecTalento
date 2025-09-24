import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import BarraLateral from "../components/BarraLateral";
import ProjetoImagem from '../../assets/ProjetoImagem.png'; 
import Header from '../components/HeaderKeyboard';
import Card from '../components/Card';

export default function Home({ navigation }) {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibleFalse = () => setIsVisible(false);
  const toggleVisibleTrue = () => setIsVisible(true);

  // Função handleLike que será passada para o Card
  const handleLike = (newLikedState) => {
    console.log('Curtido:', newLikedState);
  };

  return (
    <View style={styles.container}>
      <Header toggleVisible={toggleVisibleTrue} navigation={navigation} />
      
      <View style={styles.headerContent}> 
      <Card 
              imageSource={ProjetoImagem} 
              title="design sapato" 
              onLike={handleLike}
            />            
            <Card 
              imageSource={ProjetoImagem} 
              title="design sapato" 
              onLike={handleLike}
            />
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
    justifyContent:'center',
    alignItems: "center",
  },
  headerContent: {
    width: '100%',
    height: 400, 
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 170,
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

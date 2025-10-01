import React, { useState } from 'react';
import { TouchableOpacity, Animated, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Curtidas = ({ onPress }) => {
  const [liked, setLiked] = useState(false);
  const [scale] = useState(new Animated.Value(1));

  const handleLike = () => {
    const newLikedState = !liked;
    setLiked(newLikedState);
    onPress(newLikedState);

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
    <TouchableOpacity onPress={handleLike} style={styles.heartButton}>
      <Animated.View style={[styles.circle, { transform: [{ scale }] }]}>
        <Ionicons
          name={liked ? "heart" : "heart-outline"}
          size={20} 
          color={liked ? "red" : "black"}
        />
        {liked && <Text style={styles.countText}>1</Text>} 
      </Animated.View>
      
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  heartButton: {
    position: 'absolute',
    top: 10, 
    right: 10, 
    zIndex: 2, 
  },
  circle: {
    backgroundColor: 'white', 
    borderRadius: 30,
    padding: 12, 
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative', 
  },
  countText: {
    position: 'absolute',
    bottom: -1, 
    fontSize: 12, 
    color: "#000", 
  },
});

export default Curtidas;

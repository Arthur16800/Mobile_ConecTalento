import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

export default function InputPassword({
  texto,
  titulo,
  variavel,
  user,
  setuser,
}) {
  const [focusedInput, setFocusedInput] = useState(null);

  const setUser = setuser;

  const togglePasswordVis = () => {
    setuser({
      ...user,
      showpassword: !user.showpassword,
    });
  };

  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{titulo}</Text>
      <View
        style={[
          styles.inputContainer,
          styles.passwordContainer,
          {
            borderColor: focusedInput === variavel ? "#215299" : "#ccc",
          },
        ]}
      >
        <TextInput
          placeholder={texto}
          placeholderTextColor="#999"
          maxLength={50}
          secureTextEntry={!user.showpassword}
          value={user[variavel]}
          onChangeText={(value) => setUser({ ...user, [variavel]: value })}
          style={styles.input}
          onFocus={() => setFocusedInput(variavel)}
          onBlur={() => setFocusedInput(null)}
        />
        <TouchableOpacity onPress={togglePasswordVis} style={styles.eyeIcon}>
          <Ionicons
            name={user.showpassword ? "eye" : "eye-off"}
            size={24}
            color="#808080"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 17,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 12,
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 6,
  },
  passwordContainer: {
    justifyContent: "space-between",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  eyeIcon: {
    marginLeft: 10,
  },
});
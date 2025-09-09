import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

export default function InputObj({ atributo, texto, obj, setobj }) {
  const [focusedInput, setFocusedInput] = useState(null);
  const [novoValor, setNovoValor] = useState("");
  const setObj = setobj;
  return (
    <View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>{atributo}</Text>
        <View
          style={[
            styles.inputContainer,
            {
              borderColor: focusedInput === `novoValor` ? "#215299" : "#ccc",
            },
          ]}
        >
          <TextInput
            placeholder={texto}
            value={novoValor}
            onChangeText={(value) => setNovoValor(value)}
            style={styles.input}
            placeholderTextColor="#999"
            maxLength={255}
            onFocus={() => setFocusedInput(`novoValor`)}
            onBlur={() => setFocusedInput(null)}
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>{atributo}</Text>
        <View
          style={[
            styles.inputContainer,
            {
              borderColor: focusedInput === `${novoValor}` ? "#215299" : "#ccc",
            },
          ]}
        >
          <TextInput
            placeholder={texto}
            value={obj[novoValor]}
            onChangeText={(value) => setObj({ ...obj, [novoValor]: value })}
            style={styles.input}
            placeholderTextColor="#999"
            maxLength={255}
            onFocus={() => setFocusedInput(`${novoValor}`)}
            onBlur={() => setFocusedInput(null)}
          />
        </View>
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
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
});

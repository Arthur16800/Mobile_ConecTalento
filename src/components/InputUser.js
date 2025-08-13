import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
} from "react-native";

export default function InputUser({atributo, variavel, texto, user, setuser}) {
  const [focusedInput, setFocusedInput] = useState(null);
  const setUser = setuser;
    return(
        <View style={styles.inputGroup}>
            <Text style={styles.label}>{atributo}</Text>
            <View
              style={[
                styles.inputContainer,
                { borderColor: focusedInput ===  `${variavel}` ? "#215299" : "#ccc" },
              ]}
            >
              <TextInput
                placeholder={texto}
                value={user[variavel]}
                onChangeText={(value) => setUser({ ...user, [variavel]: value })}
                style={styles.input}
                placeholderTextColor="#999"
                maxLength={255}
                onFocus={() => setFocusedInput(`${variavel}`)}
                onBlur={() => setFocusedInput(null)}
              />
            </View>
          </View>
    )
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

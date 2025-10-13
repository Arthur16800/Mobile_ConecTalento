import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from "react-native";
import InputPassword from "./InputPassword";

export default function ModalMudarSenha({
  modal,
  fechamodal,
  user,
  setUser,
  putSenha,
}) {

  return (
    <Modal
      visible={modal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => fechamodal()}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.whitebox}>
          <Text style={styles.subtitle}>Mude Sua Senha:</Text>

          <View>
            <InputPassword
              titulo={"Senha atual"}
              texto={"********"}
              variavel={"passwordNow"}
              showpassword={"showPassword"}
              obj={user}
              setobj={setUser}
              style={styles.input}
            />

            <InputPassword
              titulo={"Nova senha"}
              texto={"********"}
              variavel={"passwordNew"}
              showpassword={"showPassword2"}
              obj={user}
              setobj={setUser}
              style={styles.input}
            />

            <InputPassword
              titulo={"Confirme sua senha"}
              texto={"********"}
              variavel={"confirmPassword"}
              showpassword={"showPassword3"}
              obj={user}
              setobj={setUser}
              style={styles.input}
            />

            <TouchableOpacity style={styles.button} onPress={() => putSenha()}>
              <Text style={styles.buttonText}>Confirmar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.buttonBack}
              onPress={() => fechamodal()}
            >
              <Text style={styles.buttonBackText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  whitebox: {
    backgroundColor: "#ffffff",
    borderRadius: "5%",
    width: "100%",
    padding: "20",
    gap: 10,
  },
  inputGroup: { marginBottom: 20 },
  label: {
    fontSize: 17,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 6,
    textAlign: "center",
  },
  inputContainer: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 12,
    backgroundColor: "#fff",
  },
  input: { flex: 1, fontSize: 20, color: "#333" },
  button: {
    backgroundColor: "#803AD6",
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 15,
    alignItems: "center",
    shadowColor: "#803AD6",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 18 },
  buttonBack: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#803AD6",
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 15,
    alignItems: "center",
    shadowColor: "#803AD6",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonBackText: {
    color: "#803AD6",
    fontWeight: "600",
    fontSize: 16,
  },
  subtitle: {
    fontSize: 25,
    fontFamily: "serif",
    color: "000000",
    textAlign: "center",
    marginBottom: 10,
  },
});

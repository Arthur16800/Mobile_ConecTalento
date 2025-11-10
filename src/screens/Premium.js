import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import Header from "../components/Header";
import BarraLateral from "../components/BarraLateral";
import { useEffect, useState } from "react";
import api from "../axios/axios";
import * as SecureStore from "expo-secure-store";
import * as Clipboard from "expo-clipboard";

export default function Premium({ navigation }) {
  const [idPix, setIdPix] = useState();
  const [state, setState] = useState();
  const [loading, setLoading] = useState(true);
  const [cache, setCache] = useState("");
  const [formData, setFormData] = useState();
  const [tick, setTick] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [user, setUser] = useState({
    id: "",
    username: "",
    email: "",
    tipo_imagem: "",
    imagem: "",
  });

  const toggleVisibleFalse = () => setIsVisible(false);
  const toggleVisibleTrue = () => setIsVisible(true);

  useEffect(() => {
    const fetchInfo = async () => {
      const storedName = await SecureStore.getItemAsync("username");
      if (storedName) setUser((prev) => ({ ...prev, username: storedName }));

      const storedEmail = await SecureStore.getItemAsync("email");
      if (storedEmail) setUser((prev) => ({ ...prev, email: storedEmail }));

      const storedId = await SecureStore.getItemAsync("id");
      if (storedId) setUser((prev) => ({ ...prev, id: storedId }));
    };
    fetchInfo();
  }, []);

  async function getUser() {
    try {
      const response = await api.getUserByName(user.username);
      const tipoImagemBuffer = response.data.profile.tipo_imagem;
      const imagemBuffer = response.data.profile.imagem;

      setUser((prev) => ({
        ...prev,
        tipo_imagem: tipoImagemBuffer,
        imagem: imagemBuffer,
      }));
    } catch (error) {
      console.log("Erro na requisição:", error.data.message.error);
    }
  }

  useEffect(() => {
    getUser();
  }, [user.username]);

  async function CreatePix() {
    try {
      const response = await api.paymentUserPix(user.id, user.email);
      const nextData = {
        email: user.email,
        qr_code: response.data.qr_code,
        qr_code_base64: response.data.qr_code_base64,
        payment_id: response.data.payment_id,
        status: response.data.status,
        amount: response.data.amount,
      };

      setFormData((prev) => ({ ...prev, ...nextData }));

      await SecureStore.setItemAsync(
        `pix-${nextData.payment_id}`,
        JSON.stringify(nextData)
      );
      setState(nextData);
      setIdPix(nextData.payment_id);
      setLoading(false);
    } catch (error) {
      console.log("Erro ao criar pix:", error);
      console.log("error", error.response.data.error);
    }
  }

  useEffect(() => {
    if (user.id && user.email) {
      CreatePix();
    }
  }, [user.id, user.email]);

  async function getCachePix() {
    await SecureStore.setItemAsync("pix-keys", "[]");
    if (state) return state;
    try {
      const cached = await SecureStore.getItemAsync(`pix-${idPix}`);
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  }

  async function ifChangeRoute() {
    if (state) return;
    try {
      const cached = SecureStore.getItemAsync(`pix-${idPix}`);
      setFormData(cached ? JSON.parse(cached) : null);
    } catch {
      setFormData(null);
    }
  }

  useEffect(() => {
    ifChangeRoute();
  }, [idPix, state]);

  async function removeAllPixCache() {
    try {
      const listJson = await SecureStore.getItemAsync("pix-keys");
      const keys = listJson ? JSON.parse(listJson) : [];

      for (const key of keys) {
        await SecureStore.deleteItemAsync(key);
      }

      await SecureStore.deleteItemAsync("pix-keys");
      console.log("Todas as chaves PIX removidas.");
    } catch (e) {
      console.log("Erro ao limpar PIX cache:", e);
    }
  }

  useEffect(() => {
    if (!formData || String(formData.payment_id) !== String(idPix)) return;
    if (formData.status === "approved") return;

    let isPollingCancelled = false;

    async function fetchPaymentStatus() {
      if (!formData?.payment_id) return;
      try {
        const response = await api.getPaymentPixStatus(
          user.id,
          formData.payment_id
        );
        const status = response?.data?.status;
        if (!isPollingCancelled && status && status !== formData.status) {
          setFormData((prev) => (prev ? { ...prev, status } : prev));
        }
      } catch (error) {
        console.log("Erro ao consultar status do pagamento:", error);
        console.log(error?.response?.data?.error);
      }
    }

    fetchPaymentStatus();
    const pollingTimerId = setInterval(() => {
      setTick((t) => t + 1);
      fetchPaymentStatus();
    }, 3000);

    return () => {
      isPollingCancelled = true;
      clearInterval(pollingTimerId);
    };
  }, [idPix, formData?.payment_id, formData?.status]);

  useEffect(() => {
    async function updateForm() {
      if (formData?.payment_id) {
        await SecureStore.setItemAsync(
          `pix-${formData.payment_id}`,
          JSON.stringify(formData)
        );
        const listJson = await SecureStore.getItemAsync("pix-keys");
        const keys = listJson ? JSON.parse(listJson) : [];
        if (!keys.includes(formData.payment_id)) {
          keys.push(formData.payment_id);
          await SecureStore.setItemAsync("pix-keys", JSON.stringify(keys));
        }
      }
    }
    updateForm();
  }, [formData]);

  useEffect(() => {
    if (formData?.status !== "approved") return;
    removeAllPixCache();
  }, [formData?.status]);

  async function handleCopy() {
    try {
      await Clipboard.setStringAsync(formData.qr_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }

  return (
    <View style={{ flex: 1 }}>
      <Header toggleVisible={toggleVisibleTrue} user={user} />

      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          gap: "5%",
        }}
      >
        {loading && <ActivityIndicator size={40} color="#803AD6" />}

        {formData && formData.status === "approved" ? (
          <View>
            <Text style={styles.title}>
              Pagamento aprovado! Obrigado por apoiar o Conectalento.
            </Text>
          </View>
        ) : (
          <View style={styles.container}>
            <Text style={styles.title}>
              Realize o pagamento via QR CODE ou copie a chave pix
            </Text>

            {formData && formData.qr_code_base64 && (
              <Image
                style={styles.qr}
                source={{
                  uri: `data:image/png;base64,${formData.qr_code_base64}`,
                }}
                alt="QR Code PIX"
              />
            )}

            {formData && formData.amount && (
              <Text style={styles.code}>Valor: {formData.amount}</Text>
            )}

            {formData && formData.qr_code && (
              <Text style={styles.code}>{formData.qr_code}</Text>
            )}

            <TouchableOpacity onPress={handleCopy} style={styles.button}>
              <Text style={styles.buttonText}>
                {copied ? "Copiado" : "Copiar"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
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
    width: "100%",
    borderRadius: 12,
    padding: "32px 24px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 18,
    background: "#fff",
  },
  title: {
    fontWeight: 700,
    textDecoration: "underline",
    color: "#1a1a1a",
    textAlign: "center",
    marginBottom: 8,
  },
  qr: {
    width: 220,
    height: 220,
    resizeMode: "contain",
  },
  code: {
    maxWidth: 520,
    textAlign: "center",
    flexWrap: "wrap",
    fontFamily: "monospace",
    fontSize: 14,
    color: "#1a1a1a",
    marginTop: 8,
  },
  button: {
    backgroundColor: "#803AD6",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginTop: 15,
    alignItems: "center",
    shadowColor: "#803AD6",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
  },
});

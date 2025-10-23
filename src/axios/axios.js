import axios from "axios";
import * as SecureStore from "expo-secure-store";

function base64ToFile(base64, filename) {
  if (!base64) return null;
  const arr = base64.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

const api = axios.create({
  baseURL: "http://10.89.240.90:5000/api/v1/",
  headers: { accept: "application/json" },
});

api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync("token");
    if (token) {
      config.headers.Authorization = `${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const sheets = {
  postLogin: (user) => api.post("login", user),
  postCadastro: (user) => api.post("user", user),
  getProjects: () => api.get("projects"),
  searchProjects: (text) => api.get(`project/search`, {params:{q:text}}),
  getUserByName: (username) => api.get(`user/${username}`),
  putUser: (
    userId,
    user,
    imageUri = "http://192.168.100.10:8081/assets/?unstable_path=.%2Fassets%2Flogo.png&platform=android&hash=a1795b20601d2a4a709395162c0a58be"
  ) => {
    const data = new FormData();

    for (let key in user) {
      data.append(key, user[key]);
    }

    if (imageUri) {
      const filename = imageUri.split("/").pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : "image";
      data.append("imagem", {
        uri: imageUri,
        name: filename,
        type: type,
      });
    }

    return api.put(`user/${userId}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  deleteUser: (id) => api.delete(`user/${id}`),
  updatePassword: (id, oldPassword, newPassword) =>
    api.put(`user/newpassword/${id}`, {
      senha_atual: oldPassword,
      nova_senha: newPassword,
    }),
  getProjectsByUser: (username) => api.get(`projects/${username}`),

  createProjeto: (form, imagens, userId) => {
    const data = new FormData();
    for (let key in form) {
      data.append(key, form[key]);
    }

    if (imagens) {
      try {
        imagens.forEach((imagem) => {
          const filename = imagem.split("/").pop();
          const match = /\.(\w+)$/.exec(filename);
          const type = match ? `image/${match[1]}` : "image";

          data.append("imagens", {
            uri: imagem,
            name: filename,
            type: type
          });
        });
      } catch (error) {
        console.log(error)
      }
    }
    return api.post(`/project/${userId}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
      },
    });
  },

  putProject: async (projeto, imageUri, id) => {
    const data = new FormData();

    for (let key in projeto) {
      data.append(key, projeto[key]);
    }

    if (imageUri) {
      const filename = imageUri.split("/").pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : "image";
      data.append("imagem", {
        uri: imageUri,
        name: filename,
        type: type,
      });
    }

    return api.put(`projects/${id}`, projeto, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }, // TENHO QUE ESTUDAR COMO FUNCIONA O "ENVIAR MULTIPLAS IMAGENS PARA O SERVIDOR"
};

export default sheets;

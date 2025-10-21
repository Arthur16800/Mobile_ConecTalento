import axios from "axios";
import * as SecureStore from "expo-secure-store";

const api = axios.create({
  baseURL: "http://192.168.100.10:5000/api/v1/",
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
  searchProjects: (text) => api.post("project/search", text),
  getUserByName: (username) => api.get(`user/${username}`),
  putUser: (
    userId, 
    user, 
    imageUri="http://192.168.100.10:8081/assets/?unstable_path=.%2Fassets%2Flogo.png&platform=android&hash=a1795b20601d2a4a709395162c0a58be"
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
  postProject: async (projeto, imageUri, idUser) => {
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

    return api.post(`projects/${idUser}`, projeto, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }, // TENHO QUE ESTUDAR COMO FUNCIONA O "ENVIAR MULTIPLAS IMAGENS PARA O SERVIDOR"
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

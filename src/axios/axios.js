import axios from "axios";
import * as SecureStore from "expo-secure-store";

const api = axios.create({
  baseURL: "https://api-conectalento.eastus2.cloudapp.azure.com:5000/api/v1/",
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
  searchProjects: (text) => api.get(`project/search`, { params: { q: text } }),
  getUserByName: (username) => api.get(`user/${username}`),
  updateUser: (id_user, user) => {
    const isForm = typeof FormData !== "undefined" && user instanceof FormData;
    const config = {
      headers: {
        ...(isForm ? { "Content-Type": "multipart/form-data" } : {}),
        Accept: "application/json",
      },
    };
    return api.put(`user/${id_user}`, user, config);
  },
  deleteUser: (id) => api.delete(`user/${id}`),
  updatePassword: (id, oldPassword, newPassword) =>
    api.put(`user/newpassword/${id}`, {
      senha_atual: oldPassword,
      nova_senha: newPassword,
    }),
  getProjectsByUser: (username) => api.get(`projects/${username}`),
  getProjectById: async (id) => {
    // Try a few possible endpoints because backend routes may vary between 'project', 'projects' or 'projectdetail'
    const candidates = [
      `project/${id}`,
      `projects/${id}`,
      `projectdetail/${id}`,
      `project/${id}/details`,
    ];
    for (const path of candidates) {
      try {
        const res = await api.get(path);
        return res;
      } catch (err) {
        // continue to next candidate on 404 or other errors
        // if it's a network/auth error, rethrow
        if (err.response && err.response.status === 404) continue;
        throw err;
      }
    }
    // If none matched, throw a not found like axios would
    const e = new Error("Not Found");
    e.response = { status: 404 };
    throw e;
  },

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
            type: type,
          });
        });
      } catch (error) {
        console.log(error);
      }
    }
    return api.post(`/project/${userId}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
      },
    });
  },
  paymentUserPix: (id_user, email) =>
    api.post(`/pagamento-pix/${id_user}`, { email }),
  getPaymentPixStatus: (id_user, paymentId) =>
    api.get(`/pagamento/pix/status/${id_user}/${paymentId}`),

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
  getProjectsLikedUser: (userId) => {
    if (!userId) return Promise.reject(new Error("User ID ausente"));
    return api.get(`/projectsliked/${userId}`);
  },

  likeProject: (projectId, userId) => {
    if (!projectId || !userId) {
      return Promise.reject(new Error("Project ID ou User ID ausente"));
    }
    return api.post("/like_dislike_projects", {
      ID_projeto: Number(projectId),
      ID_user: Number(userId),
    });
  },

  // >>> ROTA DE EXCLUSÃO ADICIONADA <<<
  deleteProject: (projectId, userId) => {
    if (!projectId || !userId) {
      return Promise.reject(new Error("Project ID ou User ID ausente"));
    }
    // Rota: router.delete("/project/:ID_projeto") e espera ID_user no body
    return api.delete(`project/${projectId}`, {
      data: { ID_user: Number(userId) },
    });
  },
};

export default sheets;

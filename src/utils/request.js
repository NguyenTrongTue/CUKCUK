import axios from "axios";
import store from "@/store";

import { apiConfig } from "./apiConfig";

const axiosClient = axios.create({
  baseURL: apiConfig,
});

axiosClient.interceptors.response.use(
  (res) => {
    if (res && res.data) {
      return res.data;
    }
    return res;
  },
  (error) => {
    const { response } = error;
    const { data } = response;
    const { Errors } = data;
    if (!Errors || Errors.length === 0) {
      store.commit("dialog/setErrorMessage", { message: data.userMessage });
    } else {
      const errorsList = Errors.map((error) => error.ErrorMessage).join(";");
      store.commit("dialog/setErrorMessage", { message: errorsList });
    }
    return Promise.reject(error);
  }
);
export default axiosClient;

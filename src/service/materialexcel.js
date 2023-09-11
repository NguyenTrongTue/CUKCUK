import axios from "axios";
import { apiConfig } from "@/utils/apiConfig.js";
import request from "@/utils/request.js";
import { tryCatchWrapper, createBlobFromResponse } from "@/utils/common";

class MaterialExcelService {
  constructor() {
    this.endpoint = `${apiConfig}MaterialExcels`;
  }

  /**
   * Hàm xuất khẩu dữ liệu thành file.
   * @author: nttue (20/08/2023)
   */
  async exportFileAsync(queryFilterObject) {
    return tryCatchWrapper(async () => {
      const response = await axios.post(
        `${this.endpoint}/ExportFileMaterial`,
        queryFilterObject,
        { responseType: "blob" }
      );
      return createBlobFromResponse(response);
    });
  }

  /**
   * Hàm lấy file kiểm tra dữ liệu từ backend.
   * @param {FormData} formData file gửi lên server
   * @returns Thông tin các sheets trong file
   * @author: nttue (20/07/2023)
   */
  async getCheckFileAsync(fileId) {
    return tryCatchWrapper(async () => {
      const response = await axios.post(
        `${this.endpoint}/GetCheckFile?fileId=${fileId}`,
        {},
        {
          responseType: "blob",
        }
      );
      return createBlobFromResponse(response);
    });
  }
  /**
   * Hàm lấy file mẫu từ backend.
   * @returns Trả dữ liệu file dưới dạng blob.
   * @author: nttue (20/07/2023)
   */
  async getExampleFileAsync() {
    return tryCatchWrapper(async () => {
      const response = await axios.get(`${this.endpoint}/GetExampleFile`, {
        responseType: "blob",
      });
      return createBlobFromResponse(response);
    });
  }

  /**
   * Hàm lấy thông tin các sheet từ backend
   * @param {FormData} formData file gửi lên server
   * @returns Thông tin các sheets trong file
   * @author: nttue (20/07/2023)
   */
  async checkFileAsync(formData) {
    return tryCatchWrapper(async () => {
      return request.post(`${this.endpoint}/CheckFile`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    });
  }

  /**
   * Hàm lấy thông tin file từ backend
   * @param {FormData} formData file gửi lên server
   * @returns Thông tin của file
   * @author: nttue (20/07/2023)
   */
  async validateFileAsync(fileId) {
    return tryCatchWrapper(async () => {
      return request.post(`${this.endpoint}/ValidateFile?fileId=${fileId}`);
    });
  }

  /**
   * Hàm validate dữ liệu từng dòng trong file.
   * @returns Trả ra danh sách hàng dữ liệu được validate.
   * @author: nttue (20/07/2023)
   */
  async importFileAsync(fileId) {
    return tryCatchWrapper(async () => {
      return request.post(`${this.endpoint}/ImportFile?fileId=${fileId}`);
    });
  }
}
const instance = new MaterialExcelService();

export default instance;

import BaseService from "@/service/base";

class unitService extends BaseService {
  constructor() {
    super("Units/");
  }
}

const instance = new unitService();

export default instance;

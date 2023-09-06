import BaseService from "@/service/base";

class stockService extends BaseService {
  constructor() {
    super("Stocks/");
  }
}

const instance = new stockService();

export default instance;

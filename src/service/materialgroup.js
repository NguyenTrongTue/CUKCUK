import BaseService from "@/service/base";

class materialGroupService extends BaseService {
  constructor() {
    super("MaterialGroups/");
  }
}

const instance = new materialGroupService();

export default instance;

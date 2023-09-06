import { validate } from "./validation";
import { ref } from "vue";
import MResources from "@/helper/resources";
const langResources = ref(MResources["vi"]);

/**
 * hàm lấy xác định lỗi của một input trong form
 * @param {inputRef} nhận đầu vào là 1 input
 * @returns trả về lỗi của input
 * @author nttue 07/07/2023
 */
export default function insertError(inputRef, Entity) {
  try {
    var e = "";
    const rulesList = inputRef?.rules.split("|");

    for (let i = 0; i < rulesList.length; i++) {
      if (inputRef?.typeError) {
        e = validate[rulesList[i]](
          inputRef.inputValue,
          langResources.value[Entity][inputRef.name][rulesList[i]]
        );
      } else {
        e = validate[rulesList[i]](
          inputRef.modelValue,
          langResources.value[Entity][inputRef.name][rulesList[i]]
        );
        if (e) return e;
      }
    }

    return e;
  } catch (e) {
    console.log(e);
  }
}

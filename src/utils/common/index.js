import store from "@/store";
import unidecode from "unidecode";

/**
 * hàm xử lý sự kiện resize column của bảng
 * @param {*} event vị trị của trỏ chuột
 * @param {*} resizer một đối tượng khi người dùng có thể trỏ chuột vào để kéo động rộng của cột phù hơp
 * @author: nttue (20/07/2023)
 * Modified at : 28/06/2023
 */
export function resizeColumn(event, resizer, table, col) {
  try {
    const column = resizer.parentElement;
    const borderStyle = "1px solid #111";

    const index = Array.from(table.querySelectorAll("th")).findIndex((th) =>
      th.innerText.includes(col.headerName)
    );

    const cells = table.querySelectorAll(`td:nth-child(${index + 1})`);

    const applyBorderStyle = (element) => {
      element.style.borderRightColor = "#111";
      element.style.borderLeft = borderStyle;
    };

    const removeBorderStyle = (element) => {
      element.style.borderRightColor = "#ccc";
      element.style.borderLeft = "unset";
    };

    cells.forEach(applyBorderStyle);
    applyBorderStyle(column);

    let startX = event.pageX;
    let startWidth = column.offsetWidth;

    const mouseMoveHandler = (event) => {
      event.preventDefault();
      const diffX = event.pageX - startX;
      const newWidth = Math.max(startWidth + diffX, col.minWidth);
      column.style.width = `${newWidth}px`;
      col.width = newWidth;
      cells.forEach((cell) => {
        cell.style.width = `${newWidth}px`;
      });
    };

    const mouseUpHandler = () => {
      removeBorderStyle(column);
      cells.forEach(removeBorderStyle);
      window.removeEventListener("mousemove", mouseMoveHandler);
      window.removeEventListener("mouseup", mouseUpHandler);
    };

    window.addEventListener("mousemove", mouseMoveHandler);
    window.addEventListener("mouseup", mouseUpHandler);
  } catch (e) {
    console.log(e);
  }
}

/**
 * hàm format ngày tháng
 * @param {Date} date - Ngày tháng năm theo định dạng số số của backend
 * @returns  trả về ngày  theo đúng định dạng
 * @author: nttue (20/07/2023)
 */

export function formatDate(date) {
  try {
    return date ? new Date(date).toLocaleDateString("vn-VI") : "";
  } catch (e) {
    console.log(e);
    return "";
  }
}

/**
 * hàm format tiền
 * @param {*} money là số tiền theo định dạng số số của backend
 * @returns  trả về tiền theo đúng định dạng
 * @author: nttue (20/07/2023)
 */
export function formatMoney(money) {
  try {
    let newMoney = new Intl.NumberFormat("vn-VI", {
      style: "currency",
      currency: "VND",
    }).format(money);
    newMoney = newMoney.slice(1) + newMoney.substring(0, 1);
    return money > 0 ? newMoney : "";
  } catch (e) {
    console.log(e);
    return "";
  }
}

/**
 * Tự động viết hoa các chữ cái đầu
 * @param {String} value - Giá của của đoạn text muốn viết hoa các chữ cái đầu
 * @returns Chuỗi đã đã viết hoa chữ cái đầu
 * @author: nttue (20/07/2023)
 */
export function upperCaseName(value) {
  try {
    const itemArray = value.split(" ");
    return itemArray
      .map((item) => item[0].toUpperCase() + item.slice(1))
      .join(" ");
  } catch (e) {
    console.log(e);
  }
}

/**
 * Hàm chuyển đổi số thập phân thành 1 chuỗi
 * @param {String} value
 * @author: nttue (20/07/2023)
 */
export function convertNumberDecimalToString(value) {
  try {
    var result = "";
    if (value) {
      let check = value.toString().includes(".");
      if (check) {
        var spiriter = value.toString().split(".");

        let partLeft = convertStringToNumber(spiriter[0].replace(/\./g, ""));

        let left = partLeft ? partLeft : "0";

        let partRight =
          spiriter[1].length === 1 ? spiriter[1][0] + "0" : spiriter[1];

        result = left + "," + partRight;
      } else {
        result =
          convertStringToNumber(value.toString().replace(/\./g, "")) + ",00";
      }
    } else {
      result = "0,00";
    }
    return result;
  } catch (e) {
    console.log(e);
  }
}

/**
 * Hàm chuyển đổi 1 chuỗi thành 1 số theo định dạng
 * VD: 123245 => 123.245
 * @param {String} input chuỗi đầu vào
 * @returns Trả về số đã được định dạng
 * @author: nttue (20/07/2023)
 */
export function convertStringToNumber(input) {
  var inputFilter = input.replace(/^0+/, "");
  return inputFilter.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function countProps(obj) {
  var count = 0;
  for (let k in obj) {
    if (obj.hasOwnProperty(k)) {
      count++;
    }
  }
  return count;
}
/**
 * Hàm so sánh 2 đối tượng.
 * @author: nttue (20/08/2023)
 */
export function areObjectsEqual(v1, v2) {
  if (typeof v1 !== typeof v2) {
    return false;
  }

  if (typeof v1 === "function") {
    return v1.toString() === v2.toString();
  }

  if (v1 instanceof Object && v2 instanceof Object) {
    if (countProps(v1) !== countProps(v2)) {
      return false;
    }
    var r = true;
    for (let k in v1) {
      r = areObjectsEqual(v1[k], v2[k]);
      if (!r) {
        return false;
      }
    }
    return true;
  } else {
    return v1 === v2;
  }
}

/**
 * Hàm try catch bao bọc hàm async function.
 * @param {Function} asyncFunc async function để thực thi.
 * @returns Trả về kết quả nhận được.
 * @author: nttue (20/07/2023)
 */
export async function tryCatchWrapper(asyncFunc) {
  try {
    store.dispatch("showLoading");
    const response = await asyncFunc();
    store.dispatch("hideLoading");
    return response;
  } catch (e) {
    store.dispatch("hideLoading");
    console.log(e);
  }
}

/**
 * Hàm tạo dữ liệu blob từ dữ liệu trả về của api t
 * @param {DataTransfer} response dữ liệu file trả về.
 * @returns Trả về dữ liệu dưới dạng blob.
 * @author: nttue (20/07/2023)
 */
export async function createBlobFromResponse(response) {
  const blob = new Blob([response.data], {
    type: response.headers["content-type"],
  });
  return blob;
}
/**
 * Hàm kiểm tra xem 1 từ có chứa tất cả các ký tự số hay không.
 * @param {String} string Chuỗi đầu vào
 * @returns Trả về kết quả kiểm tra
 * @author: nttue (20/07/2023)
 */
function checkIsNumber(string) {
  return /^[0-9]+$/.test(string);
}

/**
 * Hàm tạo prefix cho code.
 * @param {String} name - Chuỗi đầu vào.
 * @returns Trả về định dạng.
 * @author: nttue (20/07/2023)
 */
export function createPrefixCode(name) {
  const words = name.split(" ");

  const result = words
    .filter((word) => !checkIsNumber(word))
    .map((word) => {
      const firstChar = word.charAt(0);
      const cleanedFirstChar = unidecode(firstChar);

      return cleanedFirstChar.toUpperCase();
    })
    .join("");

  return result;
}

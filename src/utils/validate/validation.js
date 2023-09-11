/**
 * @description
 * hàm trả về một số quy tác validate dữ liệu
 * @author Nguyễn Trọng Tuế
 */

export const validate = {
  /**
   * Trường yêu cầu bắt buộc
   * @param {*} value giá trị của input
   * @param {*} message thống báo lỗi tương ứng
   * @returns Trả về undefined nếu hợp lệ ngược lại trả lại lỗi
   */
  required(value, message) {
    return value ? undefined : message;
  },

  /**
   * Kiểm tra định dạng email
   */
  email(value, message) {
    var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return regex.test(value) && value ? undefined : message;
  },
  /**
   * Kiểm tra định dạng là số
   */
  number(value, message) {
    var regex = /^[0-9]+$/;
    return !value || regex.test(value) ? undefined : message;
  },

  /**
   * Hàm kiểm tra xem ngày được chọn có lơn hơn ngày hiện tại không.
   * @param {Date} value Giá trị ngày tháng cần kiểm tra.
   * @param {String} message Thông báo lỗi tương ứng.
   * @returns Trả về thông báo lỗi nếu có, ngược lại undifined.
   */
  date(value, message) {
    var date = new Date();
    return value < date ? undefined : message;
  },

  /**
   * Hàm kiểm tra xem độ dài 1 chuỗi có lơn 10 ký tự không.
   * @param {String} value Giá trị cần kiểm
   * @param {String} message Thông báo lỗi tương ứng.
   * @returns Trả về thông báo lỗi nếu có, ngược lại undifined.
   */
  maxlength_10(value, message) {
    return !value || value.length <= 10 ? undefined : message;
  },

  /**
   * Hàm kiểm tra xem độ dài 1 chuỗi có lơn 100 ký tự không.
   * @param {String} value Giá trị cần kiểm
   * @param {String} message Thông báo lỗi tương ứng.
   * @returns Trả về thông báo lỗi nếu có, ngược lại undifined.
   */
  maxlength_100(value, message) {
    return !value || value.length <= 100 ? undefined : message;
  },

  /**
   * Hàm kiểm tra xem độ dài 1 chuỗi có lơn 255 ký tự không.
   * @param {String} value Giá trị cần kiểm
   * @param {String} message Thông báo lỗi tương ứng.
   * @returns Trả về thông báo lỗi nếu có, ngược lại undifined.
   */
  maxlength_255(value, message) {
    return !value || value.length <= 255 ? undefined : message;
  },
};

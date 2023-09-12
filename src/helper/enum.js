/**
 * Thông tin phần Enum.
 */
const MEnum = {
  formMode: {
    add: 0,
    update: 1,
    delete: 2,
    replication: 3,
  },
  /**
   * Giới tính.
   */
  GENDER: {
    MALE: 0,
    FEMALE: 1,
    OTHER: 2,
  },
  /**
   * Chế độ form.
   */
  SUBMIT_MODE: {
    ADD: 0,
    ADD_AND_CREATE: 1,
  },
  ADDITION: {
    AND: 0,
    OR: 1,
  },

  /**
   * Chế độ dialog.
   */
  DIALOG_MODE: {
    INFO: 0,
    ERROR: 1,
  },

  /**
   * Key code của các phím.
   */
  KEYBOARD: {
    ARROW_DOWN: 40,
    ARROW_UP: 38,
    ARROW_LEFT: 37,
    ARROW_RIGHT: 39,
    ENTER: 13,
    TAB: 9,
    ESC: 27,
    ALT: 18,
    SHIFT: 16,
    CTRL: 17,
    DELETE: 46,
    INSERT: 45,
    SPACE: 32,
    S: 83,
    R: 82,
    E: 69,
    A: 65,
    B: 66,
    N: 78,
    keyOne: 49,
    keyTwo: 50,
    keyThree: 51,
    keyFour: 52,
    keyFive: 53,
  },

  /**
   * Loại fetch api
   */
  FETCH_MODE: {
    DEFAULT: 0,
    FILTER: 1,
    SORT: 2,
  },

  /**
   * Mã lỗi
   */
  ERROR_CODE: {
    NOT_FOUND: 1,
    VALIDATE_ERROR: 2,
    DUPLICATE: 3,
    SERVER_ERROR: 4,
  },

  MODE: {
    NONE: 0,
    ADD: 1,
    EDIT: 2,
    DELETE: 3,
  },
  maxIndex: 9999,
  YES_OR_NO: {
    NO: 0,
    YES: 1,
  },
  COMPARISON_OPERATORS: {
    EQUAL: 9,
    GRETHER_THAN: 5,
    LESS_THAN: 6,
    GREATER_THAN_OR_EQUAL: 7,
    LESS_THAN_OR_EQUAL: 8,
  },
  STRING_OPERATORS: {
    CONTAIN: 0,
    EQUAL: 1,
    START_BY: 2,
    END_BY: 3,
    ORTHER: 4,
  },
};

export default MEnum;

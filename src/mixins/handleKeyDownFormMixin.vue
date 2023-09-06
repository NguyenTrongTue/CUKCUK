<script>
export default {
  name: "handleKeyDownFormMixin",
  data() {
    return {
      buttonCancelFocused: false,
      buttonSaveFocused: false,
      buttonSaveAndCreateFocused: false,
      buttonHelpFocused: false,
      buttonInsertRowFocused: false,
      buttonRemoveRowFocused: false,
    };
  },
  mounted() {
    window.addEventListener("keydown", this.handleKeyDown);
    document.addEventListener("focusin", this.handleFocusIn);
  },
  beforeUnMount() {
    window.removeEventListener("keydown", this.handleKeyDown);
    document.addEventListener("focusin", this.handleFocusIn);
  },
  methods: {
    /**
     * @description xử lý sự kiện focusin
     * thực hiện check xem các button nào đang được focus
     * @param {event} nhận sự kiện đầu vào là event
     * @author nttue  (07/07/2023)
     */
    handleFocusIn(event) {
      const focusedElement = event.target;
      if (focusedElement === this.$refs.buttonCancelRef?.$el) {
        this.buttonCancelFocused = true;
      } else if (focusedElement === this.$refs.buttonSaveRef?.$el) {
        this.buttonSaveFocused = true;
      } else if (focusedElement === this.$refs.buttonSaveAndCreateRef?.$el) {
        this.buttonSaveAndCreateFocused = true;
      } else if (focusedElement === this.$refs.buttonInsertRowRef?.$el) {
        this.buttonInsertRowFocused = true;
      } else if (focusedElement === this.$refs.buttonRemoveRowRef?.$el) {
        this.buttonRemoveRowFocused = true;
      } else if (focusedElement === this.$refs.buttonHelpRef?.$el) {
        this.buttonHelpFocused = true;
      }
    },
    /**
     * Hàm lắng nghe sự kiện form
     * @param {} event event của sự kiện
     * @author nttue (20/07/2023)
     */
    handleKeyDown(event) {
      const keyCode = event.keyCode;
      if (keyCode === this.$MEnum.KEYBOARD.TAB && this.buttonHelpFocused) {
        this.$nextTick(() => {
          this.$refs[this.refsList[0]].focus();
        });
        event.preventDefault();
        this.buttonHelpFocused = false;
      } else if (keyCode === this.$MEnum.KEYBOARD.ESC) {
        this.onExit();
      } else if (keyCode == this.$MEnum.KEYBOARD.ENTER) {
        if (this.buttonCancelFocused) {
          this.closeForm();
          this.buttonCancelFocused = false;
        } else if (this.buttonSaveFocused) {
          this.handleSaveForm();
          this.buttonSaveFocused = false;
        } else if (this.buttonCancelFocused) {
          this.handleSaveAndAdd();
          this.buttonCancelFocused = false;
        } else if (this.buttonInsertRowFocused) {
          this.addRow();
          this.buttonInsertRowFocused = false;
        } else if (this.buttonRemoveRowFocused) {
          this.removeRow();
          this.buttonRemoveRowFocused = false;
        }
      } else if (
        event.ctrlKey &&
        event.shiftKey &&
        keyCode == this.$MEnum.KEYBOARD.S
      ) {
        event.preventDefault();
        this.handleSaveAndAdd();
      } else if (event.ctrlKey && keyCode == this.$MEnum.KEYBOARD.S) {
        event.preventDefault();
        this.handleSaveForm();
      } else if (event.ctrlKey && keyCode == this.$MEnum.KEYBOARD.INSERT) {
        this.addRow(event);
      } else if (event.ctrlKey && keyCode == this.$MEnum.KEYBOARD.DELETE) {
        event.preventDefault();
        this.removeRow();
      }
    },
  },
};
</script>

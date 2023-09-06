<template></template>
<script>
import insertError from "@/utils/validate/insertError.js";

export default {
  name: "validateFormMixin",
  data: {
    firstError: 9999,
  },
  methods: {
    /**
     * Hàm validate dữ liệu của form
     * @return trả về isError là giá trị nếu form bị lỗi
     * @author Nguyễn Trọng Tuế
     * Modified at: 28/6/2023
     */
    validateData() {
      try {
        this.firstError = 9999;
        let isError = false;
        for (let i = 0; i < this.refsList.length; i++) {
          let input = this.refsList[i];

          if (
            this.$refs[input]?.rules?.includes("required") ||
            (this.$refs[input]?.error && this.$refs[input]?.rules)
          ) {
            const inputRef = this.$refs[input];
            var err = insertError(inputRef, "Material");

            if (err) {
              isError = true;
              this.firstError = Math.min(this.firstError, i);
              this.$refs[inputRef.name].error = err;
            } else if (this.$refs[input]?.error && !err) {
              isError = true;
              this.firstError = Math.min(this.firstError, i);
            } else {
              this.$refs[inputRef.name].error = "";
            }
          }
        }
        return isError;
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>

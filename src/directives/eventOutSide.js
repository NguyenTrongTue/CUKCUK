/**
 * Hàm xử lí sự kiện khi người dùng thao tác ra ngoài element
 * @author: nttue (20/07/2023)
 */
export const customOutsideDirective = {
  mounted(el, binding) {
    const onOutsideEvent = (event) => {
      if (event.type === "resize") {
        binding.value();
      } else if (!(el === event.target || el.contains(event.target))) {
        binding.value();
      }
    };

    const events = ["click", "contextmenu", "wheel", "resize", "mousedown"]; // Mặc định sử dụng sự kiện click
    events.forEach((event) => {
      window.addEventListener(event, onOutsideEvent);
    });

    el._onOutsideEvent = onOutsideEvent;
  },
  beforeUnmount(el) {
    const events = ["click", "contextmenu", "wheel", "resize", "mousedown"];
    events.forEach((event) => {
      window.removeEventListener(event, el._onOutsideEvent);
    });
    delete el._onOutsideEvent;
  },
};

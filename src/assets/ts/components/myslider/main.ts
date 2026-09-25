// src/assets/ts/components/myslider/main.ts
import { Slider } from "./myslider";

document.addEventListener("DOMContentLoaded", () => {
  // Проверяем, существует ли элемент .myslider на странице
  if (document.querySelector(".myslider")) {
    new Slider(".myslider", {
      autoplay: true,
      autoplaySpeed: 4000,
      loop: true,
      effect: "fade",
    });
  }
});

// Мы создаем анонимную функцию и сразу же ее вызываем `(function() { ... })();`
// Все переменные и константы внутри этой функции (contactButtons, formTitle, subjectInput)
// будут "заперты" внутри и не смогут конфликтовать с глобальными переменными.
(function () {
  // Ждем, пока весь HTML-документ будет полностью загружен и обработан.
  // Это гарантирует, что мы точно найдем все нужные нам элементы.
  document.addEventListener("DOMContentLoaded", () => {
    // Выбираем все необходимые элементы
    const contactButtons: NodeListOf<HTMLButtonElement> = document.querySelectorAll(".js-startproject");
    const formTitle: HTMLHeadingElement | null = document.querySelector(".mainform-title");
    const subjectInput: HTMLInputElement | null = document.querySelector('input[name="subject"]');
    // Проверяем, что все элементы найдены
    if (contactButtons.length === 0 || !formTitle || !subjectInput) {
      // Если чего-то не хватает, выводим одно предупреждение и прекращаем выполнение скрипта.
      // Это предотвращает ошибки в консоли.
      console.warn("FormUpdater: Не удалось найти все необходимые элементы");
      return; // Выход из функции
    }
    // Определяем функцию, которая будет выполняться при клике
    const handleButtonClick = (event: MouseEvent) => {
      // Получаем кнопку, на которую кликнули
      const button = event.currentTarget as HTMLButtonElement;

      // Получаем текст из кнопки
      const buttonText = button.textContent?.trim();

      if (buttonText) {
        // Обновляем заголовок формы
        formTitle.textContent = buttonText;
        // Обновляем значение скрытого поля
        subjectInput.value = buttonText;
      }
    };
    // Привязываем обработчик к каждой кнопке
    contactButtons.forEach((button) => {
      button.addEventListener("click", handleButtonClick);
    });
  });
})(); // Немедленный вызов функции

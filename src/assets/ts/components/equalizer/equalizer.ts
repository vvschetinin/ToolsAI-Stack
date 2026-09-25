// ================ Выравнивание слайдов ===========

/**
 * Функция для выравнивания высоты элементов
 * @param selector - CSS селектор целевых блоков (например, '.service-item')
 * @param buffer - Дополнительный отступ в пикселях (по умолчанию 10)
 */
export function equalizeHeights(selector: string, buffer: number = 10): void {
  // Получаем типизированную коллекцию элементов
  const elements = document.querySelectorAll<HTMLElement>(selector);

  if (elements.length === 0) {
    console.warn(`Elements with selector "${selector}" not found.`);
    return;
  }

  // 1. Сначала сбрасываем высоту на 'auto'.
  // Это критически важно: если мы уменьшаем окно браузера,
  // старая фиксированная высота не даст блоку "сжаться" по контенту,
  // и мы получим некорректные (слишком большие) значения.
  elements.forEach((el) => {
    el.style.height = "auto";
  });

  // 2. Вычисляем максимальную высоту среди всех элементов
  let maxHeight = 0;
  elements.forEach((el) => {
    // offsetHeight включает padding и border, что правильно для верстки
    if (el.offsetHeight > maxHeight) {
      maxHeight = el.offsetHeight;
    }
  });

  // 3. Добавляем запас (buffer) и применяем новую высоту
  const finalHeight = maxHeight + buffer;

  elements.forEach((el) => {
    el.style.height = `${finalHeight}px`;
  });
}

// === Инициализация и обработчики событий ===

// Запускаем после полной загрузки страницы (чтобы шрифты и картинки заняли свои места)
window.addEventListener("load", () => {
  equalizeHeights(".service-item", 10);
});

// Оптимизированный обработчик resize (Debounce/Throttling)
// Используем requestAnimationFrame для снижения нагрузки на браузер при ресайзе
let resizeTimeout: number;

window.addEventListener("resize", () => {
  if (resizeTimeout) {
    window.cancelAnimationFrame(resizeTimeout);
  }

  resizeTimeout = window.requestAnimationFrame(() => {
    equalizeHeights(".service-item", 10);
  });
});

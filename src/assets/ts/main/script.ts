export {};

// ======================= Header Scroll Bottom ============================= //

const defaultOffset: number = 40;
const header: HTMLElement | null = document.querySelector(".header");

const scrollPosition = (): number => window.pageYOffset || document.documentElement.scrollTop;

// Функция для инициализации состояния header
const initializeHeader = (): void => {
  if (header) {
    if (scrollPosition() <= defaultOffset) {
      header.classList.remove("is-active");
    } else {
      header.classList.add("is-active");
    }
  }
};

// Вызываем инициализацию при загрузке страницы
document.addEventListener("DOMContentLoaded", initializeHeader);

// Обработчик прокрутки
window.addEventListener("scroll", (): void => {
  if (header) {
    const currentScroll = scrollPosition();
    if (currentScroll > defaultOffset) {
      header.classList.add("is-active");
    } else {
      header.classList.remove("is-active");
    }
  }
});

// ================== Управление показом видео ======================

const videoElements = document.querySelectorAll<HTMLVideoElement>(".hero-video");

if (videoElements.length > 0) {
  const handleResize = (): void => {
    const isMobile: boolean = window.innerWidth <= 550;

    videoElements.forEach((video: HTMLVideoElement) => {
      if (!video) return;

      if (isMobile) {
        video.pause();
      } else {
        video.play().catch((error: Error) => {
          console.error("Автовоспроизведение заблокировано:", error.message);
        });
      }
    });
  };

  handleResize();

  window.addEventListener("resize", handleResize);
}

// ============== Вызов формы ================= //

const startProjectForm = document.querySelector<HTMLElement>(".start-project-overlay");
const startProjectButtons = document.querySelectorAll<HTMLElement>(".js-startproject");
const closeButton = document.querySelector<HTMLElement>(".js-closebutton");

if (startProjectForm) {
  startProjectButtons.forEach((el: HTMLElement) => {
    el.addEventListener("click", () => {
      startProjectForm.classList.add("is-active");
    });
  });

  closeButton?.addEventListener("click", () => {
    startProjectForm.classList.remove("is-active");
  });
}

// ==================== Toggle Mobile Menu ======================== //

const bodyPage = document.querySelector<HTMLElement>("body");
const navToggleOpen = document.querySelector<HTMLElement>(".nav-toggle");

if (bodyPage && navToggleOpen) {
  navToggleOpen.addEventListener("click", () => {
    bodyPage.classList.toggle("menu-open");
  });
}

// ================ Checked Form ================ //

// Используем типы HTMLElement или их подтипы (например, HTMLInputElement)
const formButton = document.querySelector('[name="formbutton"]') as HTMLButtonElement | null;
const formCheck = document.querySelector('[name="formcheck"]') as HTMLInputElement | null;

if (formButton && formCheck) {
  formButton.setAttribute("disabled", "true");

  formCheck.oninput = () => {
    if (formCheck.checked) {
      formButton.removeAttribute("disabled");
    } else {
      formButton.setAttribute("disabled", "true");
    }
  };
} else {
  console.error("Один из элементов формы не найден");
}

// ================== Random 5 FAQ & Accordeon ===================

// Вспомогательная функция для перемешивания массива (алгоритм Фишера-Йейтса)
function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

document.addEventListener("DOMContentLoaded", () => {
  // 1. Логика случайного выбора 5 блоков
  const faqList = document.querySelector<HTMLUListElement>(".faq-list");

  if (faqList) {
    // Преобразуем NodeList элементов li в массив
    const allItems = Array.from(faqList.querySelectorAll("li")) as HTMLLIElement[];

    // Если элементов больше 5, перемешиваем и обрезаем
    if (allItems.length > 5) {
      const shuffledItems = shuffleArray(allItems);
      const selectedItems = shuffledItems.slice(0, 5);

      // Очищаем список и добавляем только выбранные элементы
      faqList.innerHTML = "";
      selectedItems.forEach((item) => {
        faqList.appendChild(item);
      });
    }
  }

  // 2. Логика Аккордеона (применяется уже к отфильтрованному списку)
  const questions = document.querySelectorAll<HTMLElement>(".faq-question");

  questions.forEach((question) => {
    question.addEventListener("click", () => {
      // Находим следующий элемент (ответ)
      const answer = question.nextElementSibling as HTMLElement | null;
      const isActive = question.classList.contains("active");

      // Сначала закрываем все активные (опционально, если нужно, чтобы открыт был только один)
      // Если хотите, чтобы открывалось несколько, этот блок можно пропустить или изменить логику
      // Здесь оставлена ваша оригинальная логика toggle

      if (isActive) {
        question.classList.remove("active");
        if (answer) {
          answer.classList.remove("active");
          answer.style.maxHeight = "0";
        }
      } else {
        question.classList.add("active");
        if (answer) {
          answer.classList.add("active");
          // Устанавливаем max-height на основе scrollHeight с запасом 10px
          answer.style.maxHeight = `${answer.scrollHeight + 10}px`;
        }
      }
    });

    // Поддержка клавиатуры (Enter или Пробел)
    question.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        question.click();
      }
    });
  });
});

// ============ Анимация всплытия блока ================

// Callback для IntersectionObserver
const onEntry = (entries: IntersectionObserverEntry[]): void => {
  entries.forEach((entry: IntersectionObserverEntry) => {
    if (entry.target && entry.isIntersecting) {
      entry.target.classList.add("element-show");
      observer.unobserve(entry.target); // ✅ observer уже существует
    }
  });
};
let observer: IntersectionObserver; // Объявляем переменную заранее
function initObserver() {
  // Удаляем предыдущего observer, если он уже создан
  if (observer) {
    observer.disconnect();
  }
  // Определяем rootMargin в зависимости от ширины экрана
  const rootMarginValue = window.innerWidth < 800 ? "0px 0px -25px 0px" : "0px 0px -40px 0px";
  // Параметры наблюдения
  const options: IntersectionObserverInit = {
    rootMargin: rootMarginValue,
    threshold: 0,
  };
  // Создаём новый IntersectionObserver
  observer = new IntersectionObserver(onEntry, options);
  // Находим элементы и начинаем наблюдать за ними
  const elements: NodeListOf<Element> = document.querySelectorAll(".element-animation-up");
  elements.forEach((element: Element) => {
    observer.observe(element);
  });
}
// Инициализация при загрузке страницы
initObserver();
// Пересоздание observer при изменении размера окна
window.addEventListener("resize", initObserver);

// ================ Указание на защиту авторских прав ===========

// Ищем элемент внутри .footer-copyright — первый span, где нужно заменить год
const footer = document.querySelector(".footer-copyright");

if (footer) {
  const yearSpan = footer.querySelector("span");

  if (yearSpan) {
    const startYear = 2019;
    const currentYear = new Date().getFullYear();
    const copyrightText = `${startYear}–${currentYear}`;
    yearSpan.textContent = copyrightText;
  }
}

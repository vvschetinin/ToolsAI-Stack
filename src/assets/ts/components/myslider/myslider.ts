// src/assets/ts/components/myslider/myslider.ts

interface SliderOptions {
  autoplay?: boolean;
  autoplaySpeed?: number;
  loop?: boolean;
  effect?: "slide" | "fade";
}

interface SliderElements {
  container: HTMLElement;
  wrapper: HTMLElement;
  slides: HTMLElement[];
  prevButton: HTMLElement;
  nextButton: HTMLElement;
  pagination: HTMLElement;
}

export class Slider {
  private options: SliderOptions;
  private elements: SliderElements;
  private currentIndex: number = 0;
  private totalSlides: number;
  private paginationBullets: HTMLElement[] = [];
  private autoplayInterval: number | null = null;
  private isTransitioning: boolean = false;
  private touchStartX: number = 0; // Для отслеживания начальной точки касания
  private touchEndX: number = 0; // Для отслеживания конечной точки касания

  /**
   * Создает экземпляр слайдера.
   * @param selector CSS-селектор контейнера слайдера.
   * @param options Настройки слайдера.
   * @throws {Error} Если контейнер или необходимые элементы не найдены.
   */
  constructor(selector: string, options: SliderOptions = {}) {
    this.options = {
      autoplay: false,
      autoplaySpeed: 4000,
      loop: true,
      effect: "fade",
      ...options,
    };

    const container = document.querySelector(selector) as HTMLElement;
    if (!container) {
      throw new Error(`Slider container with selector "${selector}" not found`);
    }

    const wrapper = container.querySelector(".myslider-wrapper") as HTMLElement;
    const slides = Array.from(container.querySelectorAll(".slider-item")) as HTMLElement[];
    const prevButton = container.querySelector(".slider-button-prev") as HTMLElement;
    const nextButton = container.querySelector(".slider-button-next") as HTMLElement;
    const pagination = container.querySelector(".slider-pagination") as HTMLElement;

    if (!wrapper || slides.length === 0 || !prevButton || !nextButton || !pagination) {
      throw new Error("Required slider elements are missing");
    }

    this.elements = {
      container,
      wrapper,
      slides,
      prevButton,
      nextButton,
      pagination,
    };

    this.totalSlides = slides.length;

    if (this.totalSlides < 2) {
      this.options.autoplay = false;
      this.options.loop = false;
    }

    this.init();
  }

  /**
   * Инициализирует слайдер: устанавливает начальный слайд, пагинацию и обработчики событий.
   * @private
   */
  private init(): void {
    this.equalizeServiceItemHeights();
    this.updateSlide();
    this.initPagination();
    this.setupEventListeners();
    this.setupTouchEvents(); // Добавляем обработку swipe-жестов
    this.setupAutoplay();
  }

  /**
   * Выравнивает высоту всех элементов .service-item по самому высокому.
   * @private
   */
  private equalizeServiceItemHeights(): void {
    const serviceItems = this.elements.slides.map((slide) => slide.querySelector(".service-item") as HTMLElement);
    if (serviceItems.length === 0) return;

    const equalize = () => {
      if (window.innerWidth > 768) {
        serviceItems.forEach((item) => (item.style.height = "auto"));
        const maxHeight = Math.max(...serviceItems.map((item) => item.offsetHeight));
        serviceItems.forEach((item) => (item.style.height = `${maxHeight}px`));
      } else {
        serviceItems.forEach((item) => (item.style.height = "auto"));
      }
    };

    equalize();
    window.addEventListener("resize", equalize);
  }

  /**
   * Настраивает обработчики событий для кнопок и анимации.
   * @private
   */
  private setupEventListeners(): void {
    this.elements.prevButton.addEventListener("click", () => this.prev());
    this.elements.nextButton.addEventListener("click", () => this.next());
    this.elements.wrapper.addEventListener("transitionend", () => {
      this.isTransitioning = false;
    });
  }

  /**
   * Настраивает обработчики событий для swipe-жестов.
   * @private
   */
  private setupTouchEvents(): void {
    const container = this.elements.container;

    container.addEventListener("touchstart", (event: TouchEvent) => {
      this.touchStartX = event.touches[0].clientX;
    });

    container.addEventListener("touchmove", (event: TouchEvent) => {
      this.touchEndX = event.touches[0].clientX;
    });

    container.addEventListener("touchend", () => {
      const deltaX = this.touchEndX - this.touchStartX;
      const minSwipeDistance = 50; // Минимальное расстояние для распознавания swipe

      if (Math.abs(deltaX) > minSwipeDistance) {
        if (deltaX > 0) {
          this.prev(); // Swipe вправо - предыдущий слайд
        } else {
          this.next(); // Swipe влево - следующий слайд
        }
      }

      // Сбрасываем значения
      this.touchStartX = 0;
      this.touchEndX = 0;
    });
  }

  /**
   * Инициализирует пагинацию, создавая точки для каждого слайда.
   * @private
   */
  private initPagination(): void {
    this.elements.pagination.innerHTML = "";
    if (this.totalSlides < 2) return;
    this.elements.slides.forEach((_, index) => {
      const bullet = document.createElement("div");
      bullet.classList.add("pagination-bullet");
      bullet.dataset.index = index.toString();
      bullet.addEventListener("click", () => this.goToSlide(index));
      this.elements.pagination.appendChild(bullet);
      this.paginationBullets.push(bullet);
    });
    this.updatePagination();
  }

  /**
   * Обновляет отображение слайдов, показывая только активный.
   * @private
   */
  private updateSlide(): void {
    if (this.isTransitioning) return;
    this.isTransitioning = true;

    this.elements.slides.forEach((slide: HTMLElement, index: number) => {
      slide.classList.remove("active");
      slide.style.opacity = index === this.currentIndex ? "1" : "0";
    });

    this.elements.slides[this.currentIndex].classList.add("active");
    this.updatePagination();
  }

  /**
   * Обновляет состояние пагинации, подсвечивая активную точку.
   * @private
   */
  private updatePagination(): void {
    if (this.totalSlides < 2) return;
    this.paginationBullets.forEach((bullet, index) => {
      bullet.classList.toggle("active", index === this.currentIndex);
    });
  }

  /**
   * Настраивает автопрокрутку и обработчики для её управления.
   * @private
   */
  private setupAutoplay(): void {
    if (this.options.autoplay && this.totalSlides > 1) {
      this.startAutoplay();
      this.elements.container.addEventListener("mouseenter", () => this.stopAutoplay());
      this.elements.container.addEventListener("mouseleave", () => this.startAutoplay());
      this.elements.prevButton.addEventListener("click", () => this.stopAutoplay());
      this.elements.nextButton.addEventListener("click", () => this.stopAutoplay());
      this.paginationBullets.forEach((bullet) => bullet.addEventListener("click", () => this.stopAutoplay()));
    }
  }

  /**
   * Запускает автопрокрутку слайдов.
   * @private
   */
  private startAutoplay(): void {
    if (this.autoplayInterval || this.totalSlides < 2) return;
    this.autoplayInterval = window.setInterval(() => {
      this.next();
    }, this.options.autoplaySpeed);
  }

  /**
   * Останавливает автопрокрутку.
   * @private
   */
  private stopAutoplay(): void {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
  }

  /**
   * Переключает на предыдущий слайд.
   */
  public prev(): void {
    if (this.isTransitioning || this.totalSlides < 2) return;
    this.currentIndex = this.options.loop ? (this.currentIndex - 1 + this.totalSlides) % this.totalSlides : Math.max(this.currentIndex - 1, 0);
    this.updateSlide();
  }

  /**
   * Переключает на следующий слайд.
   */
  public next(): void {
    if (this.isTransitioning || this.totalSlides < 2) return;
    this.currentIndex = this.options.loop ? (this.currentIndex + 1) % this.totalSlides : Math.min(this.currentIndex + 1, this.totalSlides - 1);
    this.updateSlide();
  }

  /**
   * Переходит к слайду по указанному индексу.
   * @param index Индекс целевого слайда.
   */
  public goToSlide(index: number): void {
    if (this.isTransitioning || this.totalSlides < 2) return;
    this.currentIndex = this.options.loop ? index % this.totalSlides : Math.max(0, Math.min(index, this.totalSlides - 1));
    this.updateSlide();
  }

  /**
   * Уничтожает слайдер, очищая интервалы и обработчики событий.
   */
  public destroy(): void {
    this.stopAutoplay();
    this.elements.prevButton.removeEventListener("click", () => this.prev());
    this.elements.nextButton.removeEventListener("click", () => this.next());
    this.elements.container.removeEventListener("mouseenter", () => this.stopAutoplay());
    this.elements.container.removeEventListener("mouseleave", () => this.startAutoplay());
    this.elements.container.removeEventListener("touchstart", (event: TouchEvent) => {
      this.touchStartX = event.touches[0].clientX;
    });
    this.elements.container.removeEventListener("touchmove", (event: TouchEvent) => {
      this.touchEndX = event.touches[0].clientX;
    });
    this.elements.container.removeEventListener("touchend", () => {
      const deltaX = this.touchEndX - this.touchStartX;
      const minSwipeDistance = 50;
      if (Math.abs(deltaX) > minSwipeDistance) {
        if (deltaX > 0) {
          this.prev();
        } else {
          this.next();
        }
      }
      this.touchStartX = 0;
      this.touchEndX = 0;
    });
    this.paginationBullets.forEach((bullet) => bullet.removeEventListener("click", () => this.goToSlide(parseInt(bullet.dataset.index!))));
    this.elements.wrapper.removeEventListener("transitionend", () => {
      this.isTransitioning = false;
    });
    const serviceItems = this.elements.slides.map((slide) => slide.querySelector(".service-item") as HTMLElement);
    serviceItems.forEach((item) => (item.style.height = ""));
  }
}

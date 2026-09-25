class ProgressBarAnimator {
  private elements: NodeListOf<HTMLElement>;
  private animationDuration: number;
  private fps: number;
  private observer: IntersectionObserver | null;
  private animatedItems: Set<HTMLElement>;

  constructor(selector: string, duration: number = 1500) {
    this.elements = document.querySelectorAll(selector);
    this.animationDuration = duration;
    this.fps = 60;
    this.observer = null;
    this.animatedItems = new Set();
  }

  public init(): void {
    this.setupObserver();
  }

  private setupObserver(): void {
    const options: IntersectionObserverInit = {
      root: null,
      rootMargin: "0px",
      threshold: 0.2, // Запуск когда 20% элемента видно
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const target = entry.target as HTMLElement;

        // Запускаем анимацию только если элемент виден и ещё не анимировался
        if (entry.isIntersecting && !this.animatedItems.has(target)) {
          this.animatedItems.add(target);
          this.animateItem(target);
        }
      });
    }, options);

    // Наблюдаем за каждым элементом списка
    this.elements.forEach((element) => {
      if (this.observer) {
        this.observer.observe(element);
      }
    });
  }

  private animateItem(item: HTMLElement): void {
    const targetProgress = parseInt(item.getAttribute("data-progress") || "0", 10);
    const progressBar = item.querySelector(".progress-bar") as HTMLElement;
    const progressLabel = item.querySelector(".progress-label") as HTMLElement;

    if (!progressBar || !progressLabel) return;

    const frameTime = 1000 / this.fps;
    const totalFrames = this.animationDuration / frameTime;
    const increment = targetProgress / totalFrames;

    let currentProgress = 0;
    let frame = 0;

    const animate = (): void => {
      frame++;
      currentProgress = Math.min(currentProgress + increment, targetProgress);

      // Используем easing функцию для плавности
      const easedProgress = this.easeOutCubic(frame / totalFrames) * targetProgress;

      progressBar.style.width = `${easedProgress}%`;
      progressLabel.textContent = `${Math.round(easedProgress)}%`;
      progressLabel.style.right = `${100 - easedProgress}%`;

      if (frame < totalFrames) {
        requestAnimationFrame(animate);
      } else {
        // Финальное значение для точности
        progressBar.style.width = `${targetProgress}%`;
        progressLabel.textContent = `${targetProgress}%`;
        progressLabel.style.right = `${100 - targetProgress}%`;
      }
    };

    requestAnimationFrame(animate);
  }

  private easeOutCubic(t: number): number {
    return 1 - Math.pow(1 - t, 3);
  }

  public destroy(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
}

// Инициализация при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
  const progressAnimator = new ProgressBarAnimator(".progressbar-list li", 1500);
  progressAnimator.init();
});

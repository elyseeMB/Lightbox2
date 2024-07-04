class Lightbox {
  /** @type {HTMLElement} */
  #element: HTMLElement;
  /** @type {(string | null)[]} */
  #images: (string | null)[];
  /** @type {string | null} */
  #url: string | null = null;
  /**@type {KeyboardEvent} */
  #onKeyupEvent: (e: KeyboardEvent) => void;

  static init() {
    const links = Array.from(
      document.querySelectorAll(
        'a[href$=".png"], a[href$=".jpg"], a[href$=".jpeg"]'
      )
    );
    const galery = links.map((link) => link.getAttribute("href"));
    links.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const element = e.currentTarget as HTMLAnchorElement;
        const href = element.getAttribute("href")!;
        new Lightbox(href, galery);
      });
    });
  }

  /**
   * @param {string} url
   */
  constructor(url: string, images: (string | null)[]) {
    this.#element = this.#buildDom();
    this.#images = images;
    document.body.appendChild(this.#element);
    this.#loadImage(url);
    this.#onKeyupEvent = this.#onKeyup.bind(this);
    document.addEventListener("keyup", this.#onKeyupEvent);
  }

  /**
   * load Image
   * @param {string} url
   */
  #loadImage(url: string | null): void {
    const image = new Image();
    const container = this.#element.querySelector(".lightbox__container")!;
    const loader = document.createElement("div");
    loader.classList.add("lightbox__loader");
    container.innerHTML = "";
    container.appendChild(loader);
    image.onload = () => {
      container.removeChild(loader);
      container.appendChild(image);
      this.#url = url;
    };
    image.src = url ?? "";
  }

  #next(e: MouseEvent | KeyboardEvent | Event) {
    e.preventDefault();
    let i = this.#images.findIndex((image) => image === this.#url);
    if (i === this.#images.length - 1) {
      i = -1;
    }
    this.#loadImage(this.#images[i + 1]);
  }

  #prev(e: MouseEvent | KeyboardEvent | Event) {
    e.preventDefault();
    let i = this.#images.findIndex((image) => image === this.#url);
    if (i === 0) {
      i = this.#images.length;
    }
    this.#loadImage(this.#images[i - 1]);
  }

  #close(e: MouseEvent | KeyboardEvent | Event) {
    e.preventDefault();
    this.#element.classList.add("fadeOut");
    setTimeout(() => {
      this.#element.parentElement?.removeChild(this.#element);
    }, 300);
    document.removeEventListener("keyup", this.#onKeyup);
  }

  #onKeyup(e: KeyboardEvent) {
    e.preventDefault();
    if (e.key === "Escape") {
      this.#close(e);
    } else if (e.key === "ArrowRight") {
      this.#next(e);
    } else if (e.key === "ArrowLeft") {
      this.#prev(e);
    }
  }

  #buildDom(): HTMLElement {
    const dom = document.createElement("div");
    dom.classList.add("lightbox");
    dom.innerHTML = /*html */ `
    <button class="lightbox__close"></button>
    <button class="lightbox__next"></button>
    <button class="lightbox__prev"></button>
    <div class="lightbox__container"></div>
    `;
    dom
      .querySelector(".lightbox__next")!
      .addEventListener("click", this.#next.bind(this));
    dom
      .querySelector(".lightbox__prev")!
      .addEventListener("click", this.#prev.bind(this));
    dom
      .querySelector(".lightbox__close")!
      .addEventListener("click", this.#close.bind(this));
    return dom;
  }
}

Lightbox.init();

# 🎮 Phantom Run

> A browser-based 2D side-scrolling platformer built with p5.js — dodge ghost enemies, collect coins, survive canyons, and race to the flagpole.

![p5.js](https://img.shields.io/badge/p5.js-ED225D?style=for-the-badge&logo=p5dotjs&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)

---

## 📗 Table of Contents

- [📖 About the Project](#-about-the-project)
  - [🎯 Gameplay](#-gameplay)
  - [🛠 Built With](#-built-with)
  - [Live Demo](#live-demo)
- [💻 Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Setup & Running Locally](#-setup)
- [🕹 Controls](#-controls)
- [👤 Author](#-author)
- [🤝 Contributing](#-contributing)
- [📝 License](#-license)

---

## 📖 About the Project <a name="-about-the-project"></a>

**Phantom Run** is an side-scrolling platformer submitted as an ITP (Introduction to Programming I) final project. The player controls a character navigating a procedurally — jumping across canyons, landing on floating platforms, collecting coins, and avoiding patrolling ghost enemies.

The project is fully rendered using the **p5.js** canvas library with no external game engine. Physics, collision detection, camera scrolling, enemy AI, and all visual elements are implemented from scratch in vanilla JavaScript.

---

## 🎯 Gameplay <a name="-gameplay"></a>

- Navigate right across the generating world
- Jump to collect **gold coins** in view to increase your score
- Avoid **ghost enemies** that patrol back and forth — contact costs a life
- Don't fall into **canyons** or off the edge of platforms
- Reach the **flagpole** to complete the level
- You start with **3 lives** — lose them all and it's Game Over

---

## 🛠 Built With <a name="-built-with"></a>

| Technology | Purpose |
|---|---|
| [p5.js](https://p5js.org/) | Canvas rendering & game loop |
| [p5.sound.js](https://p5js.org/reference/#/libraries/p5.sound) | Audio playback & management |
| HTML5 / CSS | Entry point & canvas mounting |
| JavaScript (ES5/ES6) | All game logic |

---

## Live Demo <a name="live-demo"></a>

[Live Demo Link](https://ashmalzahra.github.io/p5js-side-scroller-game/)

---

## 💻 Getting Started <a name="-getting-started"></a>

### Prerequisites <a name="prerequisities"></a>

- A modern web browser (Chrome, Firefox, Edge, Safari)
- No installations, build tools, or dependencies required

### Setup & Running Locally <a name="-setup"></a>

Open `index.html` in your browser

Alternatively, use the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension in VS Code — right-click `index.html` and select **Open with Live Server**.

---

## 🕹 Controls <a name="-controls"></a>

| Key | Action |
|-----|--------|
| `A` | Move left |
| `D` | Move right |
| `W` | Jump |

> Controls are disabled during Game Over and Level Complete screens. Refresh the page to restart.

---

## 👤 Author <a name="-author"></a>

👤 **Ashmal Zahra**

- GitHub: [@ashmalzahra](https://github.com/ashmalzahra)
- Twitter: [@AshmalZahraa](https://twitter.com/AshmalZahraa)
- LinkedIn: [ashmal-zahra](https://www.linkedin.com/in/ashmal-zahra)

- Built as the ITP Final Project (Introduction to Programming I)

---

## 🤝 Contributing <a name="-contributing"></a>

Contributions, issues, and feature requests are welcome!

Feel free to check the [issues page](https://github.com/ashmalzahra/p5js-side-scroller-game/issues).

---

## 📝 License <a name="-license"></a>

This project is [MIT](./LICENSE) licensed.

---

<p align="center">Made with p5.js 🎨</p>
/**
 * EN: Home page — assembles all portfolio sections into a single scrollable page.
 *     Uses the marble-bg class for the dark blue gradient background.
 * RU: Главная страница — собирает все секции портфолио в одну прокручиваемую страницу.
 *     Использует класс marble-bg для тёмно-синего градиентного фона.
 *
 * EN: Interacts with:
 *   - src/components/Header.tsx — fixed navigation bar
 *   - src/components/Hero.tsx — hero/intro section
 *   - src/components/About.tsx — about me section
 *   - src/components/Skills.tsx — skills grid
 *   - src/components/Projects.tsx — projects placeholder
 *   - src/components/Contact.tsx — contact links
 *   - src/components/Footer.tsx — footer
 * RU: Взаимодействует с:
 *   - src/components/Header.tsx — фиксированная навигация
 *   - src/components/Hero.tsx — секция-заставка
 *   - src/components/About.tsx — секция «обо мне»
 *   - src/components/Skills.tsx — сетка навыков
 *   - src/components/Projects.tsx — заглушка проектов
 *   - src/components/Contact.tsx — контактные ссылки
 *   - src/components/Footer.tsx — подвал
 */

import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";

const Index = () => {
  return (
    <main>
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Contact />
    </main>
  );
};

export default Index;

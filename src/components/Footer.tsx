/**
 * EN: Footer — simple copyright bar displayed at the bottom of every page.
 *     Year updates automatically via Date().getFullYear().
 * RU: Подвал — простая строка копирайта внизу каждой страницы.
 *     Год обновляется автоматически через Date().getFullYear().
 *
 * EN: Interacts with:
 *   - src/pages/Index.tsx — used in the home page layout
 *   - src/pages/TaskManagerPage.tsx — used in the task manager page layout
 * RU: Взаимодействует с:
 *   - src/pages/Index.tsx — используется в макете главной страницы
 *   - src/pages/TaskManagerPage.tsx — используется в макете страницы менеджера задач
 */

const Footer = () => {
  return (
    <footer className="border-t border-border py-8 px-6 text-center">
      <p className="text-sm text-muted-foreground">
        © {new Date().getFullYear()} Daniil Rusnak. Built with ☕ and questionable decisions.
      </p>
    </footer>
  );
};

export default Footer;

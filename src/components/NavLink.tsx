/**
 * EN: NavLink wrapper — extends React Router's NavLink with simpler className API.
 *     Allows passing activeClassName and pendingClassName as separate props.
 *     Uses the cn() utility to merge class names conditionally.
 * RU: Обёртка NavLink — расширяет NavLink из React Router упрощённым API для классов.
 *     Позволяет передавать activeClassName и pendingClassName как отдельные пропсы.
 *     Использует утилиту cn() для условного объединения классов.
 *
 * EN: Interacts with:
 *   - src/lib/utils.ts — uses cn() for class merging
 *   - Currently not actively used in the project, but available as a utility component
 * RU: Взаимодействует с:
 *   - src/lib/utils.ts — использует cn() для объединения классов
 *   - В данный момент не используется активно, но доступен как утилитарный компонент
 */

import { NavLink as RouterNavLink, NavLinkProps } from "react-router-dom";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface NavLinkCompatProps extends Omit<NavLinkProps, "className"> {
  className?: string;
  activeClassName?: string;
  pendingClassName?: string;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
  ({ className, activeClassName, pendingClassName, to, ...props }, ref) => {
    return (
      <RouterNavLink
        ref={ref}
        to={to}
        className={({ isActive, isPending }) =>
          cn(className, isActive && activeClassName, isPending && pendingClassName)
        }
        {...props}
      />
    );
  },
);

NavLink.displayName = "NavLink";

export { NavLink };

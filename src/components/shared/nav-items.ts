import { List, Trophy, User, type LucideIcon } from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/peladas", label: "Peladas", icon: List },
  { href: "/sorteios", label: "Sorteios", icon: Trophy },
  { href: "/perfil", label: "Perfil", icon: User },
];

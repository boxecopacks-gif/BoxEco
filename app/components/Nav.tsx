import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function Nav() {
  const links = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/folding", label: "Folding Guide" },
    { href: "/customer-handling", label: "Customer Handling" },
    { href: "/quality", label: "Quality" },
  ];
  return (
    <nav className="flex flex-wrap items-center gap-6 bg-green-800 px-6 py-4 text-white">
      <span className="text-lg font-bold">BoxEco</span>
      {links.map((l) => (
        <Link key={l.href} href={l.href} className="hover:underline">
          {l.label}
        </Link>
      ))}
      <ThemeToggle />
    </nav>
  );
}
// OTIMIZAÇÃO 1: Importado 'memo'
import { Twitter, Facebook, Instagram, Linkedin } from "lucide-react";
import React, { memo } from "react";

const socialLinks = [
  {
    href: "https://x.com/jotape_rba",
    label: "Twitter",
    icon: <Twitter className="w-5 h-5" />,
  },
  {
    href: "https://www.facebook.com/jpribeiro.batista",
    label: "Facebook",
    icon: <Facebook className="w-5 h-5" />,
  },
  {
    href: "https://www.instagram.com/jp_batista20/",
    label: "Instagram",
    icon: <Instagram className="w-5 h-5" />,
  },
  {
    href: "https://www.linkedin.com/in/joao-pedro-ribeiro-batista-araujo-1583b1332/",
    label: "Linkedin",
    icon: <Linkedin className="w-5 h-5" />,
  },
];

// Renomeado para usar com 'memo'
const FooterComponent = () => {
  return (
    <footer
      className="
      backdrop-gradient backdrop-blur-custom 
      border-t-2 border-yellow-500/50
      text-white py-8 mt-16
    "
    >
      <div className="container mx-auto text-center flex flex-col items-center gap-4 px-4">
        {/* Links de Mídia Social com Ícones */}
        <div className="flex items-center gap-4">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              className="
                w-10 h-10 rounded-full 
                bg-gray-900/50 
                /* OTIMIZAÇÃO 2: Removido 'backdrop-blur-sm' */
                border border-gray-700/50
                flex items-center justify-center
                text-gray-300 
                transition-all duration-300 
                hover:text-yellow-400
                hover:border-yellow-500/50
                hover:shadow-glow-yellow
                hover:scale-110
                hover:-translate-y-1
              "
            >
              {link.icon}
            </a>
          ))}
        </div>

        {/* Informações do Desenvolvedor */}
        <p className="text-sm text-gray-300">
          Desenvolvido por{" "}
          <span className="font-semibold text-white">João Pedro Batista</span>
        </p>

        {/* Textos Legais Agrupados */}
        <div className="flex flex-col gap-1">
          <p className="text-sm text-gray-300">
            &copy; {new Date().getFullYear()} saintseiyadle.
          </p>
          <p className="mt-2 text-xs text-gray-400 max-w-2xl">
            Saint Seiya © Masami Kurumada/Shueisha, Toei Animation. Todos os
            direitos da série são reservados aos seus respectivos donos. Este
            site é uma homenagem à obra original.
          </p>
        </div>
      </div>
    </footer>
  );
};

// OTIMIZAÇÃO 1: Envolvido com 'memo'
export default memo(FooterComponent);
import { Facebook, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="left-0 right-0 text-white bg-primary px-4 sm:h-[10vh] py-5">
      <div className="container mx-auto flex flex-col-reverse sm:flex-row justify-between items-start h-full sm:items-center">
        <ul className="text-sm sm:text-md flex flex-col items-start sm:items-start mt-4 sm:mt-0">
          <li>&copy;{new Date().getFullYear()} Albin Kjellberg</li>
          <li>Denna hemsida är byggd av studenter vid LiU</li>
        </ul>

        <div className="flex flex-row items-center text-left gap-x-4">
          <button className="bg-primary shadow-lg p-1 rounded  hover:bg-muted-foreground">
            <a href="https://www.facebook.com/studentfiket/?locale=sv_SE" className="hover:underline"><Facebook size={32} /></a>
          </button>
          <button className="bg-primary shadow-lg p-1 rounded hover:bg-secondary">
            <a href="mailto:info@studentfiket.com" className="hover:underline"><Mail size={32} /></a>
          </button>
        </div>
      </div>
    </footer>
  );
}
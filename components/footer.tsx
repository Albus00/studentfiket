export default function Footer() {
  return (
    <footer className="bottom-0 left-0 right-0 text-white bg-primary px-4 h-[10vh]">
      <div className="container mx-auto flex justify-between items-center h-full">
        <ul className="flex flex-col">
          <li>&copy; {new Date().getFullYear()} Albin Kjellberg</li>
          <li>Denna hemsida är byggd av studenter vid LiU</li>
        </ul>

        <ul className="flex flex-col text-right">
          <li><a href="https://www.facebook.com/studentfiket/?locale=sv_SE" className="hover:underline">Facebook</a></li>
          <li><a href="mailto:info@studentfiket.com" className="hover:underline">Kontakta oss</a></li>
        </ul>
      </div>
    </footer>
  );
}
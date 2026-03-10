import logo from "../../assets/images/logo/logo.webp";

export default function Footer() {
  return (
    <footer className="py-2 mt-auto flex flex-col items-center gap-2">
      <div>
        {/* 2. Utilisation de la variable importée */}
        <img src={logo} alt="Co-Voit Logo" className="h-50 w-auto opacity-80" />
      </div>
      
      <div className="text-[#6B7280] text-xs space-y-1 text-center">
        <p>© Copyright 2026 - Co-voit</p>
        <p className="hover:underline cursor-pointer">Mentions légales</p>
      </div>
    </footer>
  );
}
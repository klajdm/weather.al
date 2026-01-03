export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="text-center py-6 text-white/80 mt-8 border-t border-white/10">
      <div className="space-y-2">
        <p>
          Powered by{' '}
          <a 
            href="https://open-meteo.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="font-semibold underline hover:text-white transition-colors"
          >
            Open-Meteo API
          </a>
        </p>
        <p className="text-sm">
          © {currentYear} - Developed by{' '}
          <a
            href="https://github.com/klajdm"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold underline hover:text-white transition-colors"
          >
            Klajdi Murataj
          </a>
        </p>
      </div>
    </footer>
  );
}

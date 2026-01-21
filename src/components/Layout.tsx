import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-effect border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: 5, scale: 1.05 }}
              className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center shadow-glow"
            >
              <FileText className="w-5 h-5 text-primary-foreground" />
            </motion.div>
            <div>
              <h1 className="text-xl font-bold gradient-text">YISUS PDF</h1>
              <p className="text-xs text-muted-foreground">Herramientas PDF gratuitas</p>
            </div>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-semibold gradient-text">YISUS PDF</span>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Todas las operaciones se realizan en tu navegador. Tus archivos nunca salen de tu dispositivo.
            </p>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} YISUS PDF
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;

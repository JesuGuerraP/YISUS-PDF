import { motion } from "framer-motion";
import {
  Merge,
  Scissors,
  Trash2,
  ArrowUpDown,
  Unlock,
  FileText,
  FileUp,
} from "lucide-react";
import Layout from "@/components/Layout";
import ToolCard from "@/components/ToolCard";

const tools = [
  {
    title: "Unir PDF",
    description: "Combina múltiples archivos PDF en un solo documento.",
    icon: Merge,
    href: "/unir-pdf",
    color: "#E53E3E",
  },
  {
    title: "Dividir PDF",
    description: "Extrae páginas o divide tu PDF en varios archivos.",
    icon: Scissors,
    href: "/dividir-pdf",
    color: "#DD6B20",
  },
  {
    title: "Eliminar Páginas",
    description: "Elimina las páginas que no necesitas de tu PDF.",
    icon: Trash2,
    href: "/eliminar-paginas",
    color: "#D53F8C",
  },
  {
    title: "Reordenar Páginas",
    description: "Cambia el orden de las páginas de tu documento.",
    icon: ArrowUpDown,
    href: "/reordenar-paginas",
    color: "#805AD5",
  },
  {
    title: "Desbloquear PDF",
    description: "Elimina la protección con contraseña de tu PDF.",
    icon: Unlock,
    href: "/desbloquear-pdf",
    color: "#38A169",
  },
  {
    title: "PDF a Word",
    description: "Convierte tu PDF a documento Word editable.",
    icon: FileText,
    href: "/pdf-a-word",
    color: "#3182CE",
  },
  {
    title: "Word a PDF",
    description: "Convierte tu documento Word a formato PDF.",
    icon: FileUp,
    href: "/word-a-pdf",
    color: "#00B5D8",
  },
];

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="text-center py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">YISUS PDF</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-4">
            Herramientas PDF gratuitas y seguras
          </p>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Todas las operaciones se realizan en tu navegador. 
            Tus archivos nunca salen de tu dispositivo.
          </p>
        </motion.div>

        {/* Privacy Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="inline-flex items-center gap-2 mt-8 px-4 py-2 bg-success/10 text-success rounded-full text-sm font-medium"
        >
          <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
          100% privado • Sin subir archivos al servidor
        </motion.div>
      </section>

      {/* Tools Grid */}
      <section className="py-8">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-2xl font-bold text-foreground mb-8 text-center"
        >
          Selecciona una herramienta
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tools.map((tool, index) => (
            <ToolCard
              key={tool.href}
              {...tool}
              delay={0.1 * (index + 1)}
            />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "100% Gratuito",
              description: "Sin costos ocultos ni suscripciones. Usa todas las herramientas sin límites.",
              icon: "🎁",
            },
            {
              title: "Privacidad Total",
              description: "Tus archivos nunca salen de tu dispositivo. Todo se procesa en tu navegador.",
              icon: "🔒",
            },
            {
              title: "Rápido y Simple",
              description: "Interfaz intuitiva para completar tus tareas en segundos.",
              icon: "⚡",
            },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="text-center p-6"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default Index;

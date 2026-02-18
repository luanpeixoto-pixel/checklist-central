import { Link } from "react-router-dom";
import { ClipboardCheck, Wrench, Fuel, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

interface Module {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
}

const modules: Module[] = [
  {
    title: "Checklist de Inspeção",
    description: "Realizar vistorias e inspeções dos veículos da frota",
    icon: ClipboardCheck,
    href: "/checklist",
  },
  {
    title: "Controle de Manutenção",
    description: "Registrar e acompanhar manutenções preventivas e corretivas",
    icon: Wrench,
    href: "/manutencao",
  },
  {
    title: "Controle de Combustível",
    description: "Registrar abastecimentos e monitorar consumo",
    icon: Fuel,
    href: "/combustivel",
  },
];

export const ModulesGrid = () => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-foreground mb-4">Módulos</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {modules.map((module) => {
          const Icon = module.icon;
          return (
            <Link key={module.href} to={module.href}>
              <Card className="card-elevated h-full hover:shadow-lg transition-all duration-200 cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {module.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {module.description}
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

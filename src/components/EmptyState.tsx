import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface NoVehiclesStateProps {
  variant: "no-vehicles";
  toolName: "checklist" | "manutenção" | "abastecimento";
}

interface NoRecordsStateProps {
  variant: "no-records";
  icon: LucideIcon;
  title: string;
  buttonLabel: string;
}

type EmptyStateProps = NoVehiclesStateProps | NoRecordsStateProps;

const toolMessages: Record<string, string> = {
  checklist: "Quase lá! Adicione seu primeiro veículo para liberar a criação de checklists.",
  manutenção: "Sua frota ainda está vazia. Adicione seu primeiro veículo para registrar uma manutenção.",
  abastecimento: "Tudo pronto para abastecer? Primeiro, precisamos dos dados do seu veículo.",
};

export const EmptyState = (props: EmptyStateProps) => {
  if (props.variant === "no-vehicles") {
    return (
      <div className="py-12 text-center space-y-4">
        <h2 className="text-xl font-semibold text-foreground">
          Nenhum veículo cadastrado
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          {toolMessages[props.toolName]}
        </p>
        <Button asChild className="mt-4">
          <Link to="/veiculos">Cadastrar veículo</Link>
        </Button>
      </div>
    );
  }

  const { icon: Icon, title, buttonLabel } = props;

  return (
    <Card className="card-elevated">
      <CardContent className="py-12 text-center">
        <div className="inline-flex p-4 rounded-full bg-muted mb-4">
          <Icon className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-muted-foreground">
          Clique em "{buttonLabel}" para adicionar o primeiro registro.
        </p>
      </CardContent>
    </Card>
  );
};

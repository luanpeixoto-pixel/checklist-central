import { useState } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, FileText, BookOpen } from "lucide-react";

// Screenshots
import screenshotPainel from "@/assets/docs/painel.png";
import screenshotVeiculos from "@/assets/docs/veiculos.png";
import screenshotChecklist from "@/assets/docs/checklist.png";
import screenshotManutencao from "@/assets/docs/manutencao.png";
import screenshotCombustivel from "@/assets/docs/combustivel.png";
import screenshotPerfil from "@/assets/docs/perfil.png";
import screenshotAuthLogin from "@/assets/docs/auth-login.png";

const ScreenshotImg = ({ src, alt }: { src: string; alt: string }) => (
  <div className="my-4 rounded-lg overflow-hidden border border-border shadow-sm">
    <img src={src} alt={alt} className="w-full" loading="lazy" />
    <p className="text-xs text-muted-foreground text-center py-2 bg-muted/50">{alt}</p>
  </div>
);

/* -------------------------------------------------------------------------- */
/* PDF Export (print-based)                                                    */
/* -------------------------------------------------------------------------- */

const handleExportPDF = () => {
  const style = document.createElement("style");
  style.id = "print-doc-style";
  style.textContent = `
    @media print {
      header, footer, nav, .no-print { display: none !important; }
      .print-area { 
        all: initial; 
        font-family: 'Segoe UI', Tahoma, sans-serif;
        color: #1a1a1a;
        font-size: 11pt;
        line-height: 1.6;
      }
      .print-area h1 { font-size: 22pt; margin-bottom: 4pt; }
      .print-area h2 { font-size: 16pt; margin-top: 18pt; border-bottom: 2px solid #16a34a; padding-bottom: 4pt; }
      .print-area h3 { font-size: 13pt; margin-top: 14pt; color: #16a34a; }
      .print-area table { width: 100%; border-collapse: collapse; margin: 8pt 0; font-size: 10pt; }
      .print-area th, .print-area td { border: 1px solid #d1d5db; padding: 6px 10px; text-align: left; }
      .print-area th { background: #f3f4f6; font-weight: 600; }
      .print-area code { background: #f3f4f6; padding: 2px 4px; border-radius: 3px; font-size: 10pt; }
      .print-area .page-break { page-break-before: always; }
    }
  `;
  document.head.appendChild(style);
  window.print();
  setTimeout(() => style.remove(), 1000);
};

/* -------------------------------------------------------------------------- */
/* Section Components                                                          */
/* -------------------------------------------------------------------------- */

const SectionAuth = () => (
  <div>
    <h2 className="text-xl font-bold text-foreground border-b-2 border-primary pb-2 mb-4">1. Autenticação (/auth)</h2>
    <ScreenshotImg src={screenshotAuthLogin} alt="Tela de Login — /auth" />
    <h3 className="text-lg font-semibold text-primary mt-4 mb-2">1.1 Login</h3>
    <p className="text-muted-foreground mb-2">Formulário com campos: <strong>E-mail</strong> e <strong>Senha</strong>.</p>
    <table className="w-full text-sm border-collapse mb-4">
      <thead><tr className="bg-muted"><th className="border border-border p-2 text-left">Validação</th><th className="border border-border p-2 text-left">Regra</th><th className="border border-border p-2 text-left">Mensagem</th></tr></thead>
      <tbody>
        <tr><td className="border border-border p-2">E-mail vazio</td><td className="border border-border p-2">Campo obrigatório</td><td className="border border-border p-2">"E-mail é obrigatório"</td></tr>
        <tr><td className="border border-border p-2">E-mail inválido</td><td className="border border-border p-2">Regex: <code className="bg-muted px-1 rounded text-xs">/^[^\s@]+@[^\s@]+\.[^\s@]+$/</code></td><td className="border border-border p-2">"E-mail inválido"</td></tr>
        <tr><td className="border border-border p-2">Senha vazia</td><td className="border border-border p-2">Campo obrigatório</td><td className="border border-border p-2">"Senha é obrigatória"</td></tr>
        <tr><td className="border border-border p-2">Credenciais incorretas</td><td className="border border-border p-2">Retorno da API</td><td className="border border-border p-2">"E-mail ou senha incorretos"</td></tr>
        <tr><td className="border border-border p-2">E-mail não confirmado</td><td className="border border-border p-2">Retorno da API</td><td className="border border-border p-2">"Por favor, confirme seu e-mail antes de fazer login"</td></tr>
      </tbody>
    </table>
    <p className="text-muted-foreground mb-2">Sucesso: <code className="bg-muted px-1 rounded text-xs">"Login realizado com sucesso!"</code> → redireciona para <code className="bg-muted px-1 rounded text-xs">/</code></p>

    <h3 className="text-lg font-semibold text-primary mt-6 mb-2">1.2 Cadastro</h3>
    <p className="text-muted-foreground mb-2">Campos adicionais: <strong>Nome</strong>, checkbox <strong>Aceite de Marketing</strong>.</p>
    <table className="w-full text-sm border-collapse mb-4">
      <thead><tr className="bg-muted"><th className="border border-border p-2 text-left">Validação</th><th className="border border-border p-2 text-left">Regra</th><th className="border border-border p-2 text-left">Mensagem</th></tr></thead>
      <tbody>
        <tr><td className="border border-border p-2">Nome vazio</td><td className="border border-border p-2">Campo obrigatório</td><td className="border border-border p-2">"Nome é obrigatório"</td></tr>
        <tr><td className="border border-border p-2">Senha curta</td><td className="border border-border p-2">Mín. 6 caracteres</td><td className="border border-border p-2">"A senha deve ter pelo menos 6 caracteres"</td></tr>
        <tr><td className="border border-border p-2">Sem maiúscula</td><td className="border border-border p-2">Pelo menos 1 [A-Z]</td><td className="border border-border p-2">"A senha deve conter pelo menos uma letra maiúscula"</td></tr>
        <tr><td className="border border-border p-2">Sem número</td><td className="border border-border p-2">Pelo menos 1 [0-9]</td><td className="border border-border p-2">"A senha deve conter pelo menos um número"</td></tr>
        <tr><td className="border border-border p-2">E-mail já usado</td><td className="border border-border p-2">Retorno da API</td><td className="border border-border p-2">"Este e-mail já está cadastrado"</td></tr>
      </tbody>
    </table>
    <p className="text-muted-foreground mb-2">Texto do checkbox: <em>"Aceito receber comunicações e novidades por e-mail e WhatsApp. Você pode cancelar a qualquer momento."</em></p>
    <p className="text-muted-foreground">Sucesso: <code className="bg-muted px-1 rounded text-xs">"Cadastro realizado com sucesso!"</code></p>
  </div>
);

const SectionCockpit = () => (
  <div>
    <h2 className="text-xl font-bold text-foreground border-b-2 border-primary pb-2 mb-4 page-break">2. Painel de Controle (/)</h2>
    <ScreenshotImg src={screenshotPainel} alt="Painel de Controle — Tela principal" />
    <p className="text-muted-foreground mb-4">Dashboard principal com métricas, módulos e informações resumidas da frota.</p>

    <h3 className="text-lg font-semibold text-primary mt-4 mb-2">2.1 Metric Cards</h3>
    <table className="w-full text-sm border-collapse mb-4">
      <thead><tr className="bg-muted"><th className="border border-border p-2">Card</th><th className="border border-border p-2">Dado exibido</th><th className="border border-border p-2">Cálculo</th><th className="border border-border p-2">Link</th></tr></thead>
      <tbody>
        <tr><td className="border border-border p-2">Total de veículos</td><td className="border border-border p-2">Quantidade + ativos</td><td className="border border-border p-2"><code className="bg-muted px-1 rounded text-xs">vehicles.length</code> / <code className="bg-muted px-1 rounded text-xs">filter(status==='ativo')</code></td><td className="border border-border p-2">/veiculos</td></tr>
        <tr><td className="border border-border p-2">Gasto combustível</td><td className="border border-border p-2">Total acumulado (BRL)</td><td className="border border-border p-2"><code className="bg-muted px-1 rounded text-xs">Σ(valor_total)</code> de fuel_records</td><td className="border border-border p-2">/combustivel</td></tr>
        <tr><td className="border border-border p-2">Gasto manutenção</td><td className="border border-border p-2">Total acumulado (BRL)</td><td className="border border-border p-2"><code className="bg-muted px-1 rounded text-xs">Σ(custo)</code> de maintenance_records</td><td className="border border-border p-2">/manutencao</td></tr>
        <tr><td className="border border-border p-2">Média km/L</td><td className="border border-border p-2">Consumo da frota</td><td className="border border-border p-2"><code className="bg-muted px-1 rounded text-xs">média(km_por_litro)</code> dos registros onde km_por_litro ≠ null</td><td className="border border-border p-2">/combustivel</td></tr>
      </tbody>
    </table>
    <p className="text-muted-foreground mb-2">Formato monetário: <code className="bg-muted px-1 rounded text-xs">Intl.NumberFormat("pt-BR", &#123;style:"currency", currency:"BRL"&#125;)</code></p>

    <h3 className="text-lg font-semibold text-primary mt-6 mb-2">2.2 Módulos</h3>
    <table className="w-full text-sm border-collapse mb-4">
      <thead><tr className="bg-muted"><th className="border border-border p-2">Módulo</th><th className="border border-border p-2">Descrição</th><th className="border border-border p-2">Rota</th></tr></thead>
      <tbody>
        <tr><td className="border border-border p-2">Checklist de Inspeção</td><td className="border border-border p-2">Realizar vistorias e inspeções dos veículos da frota</td><td className="border border-border p-2">/checklist</td></tr>
        <tr><td className="border border-border p-2">Controle de Manutenção</td><td className="border border-border p-2">Registrar e acompanhar manutenções preventivas e corretivas</td><td className="border border-border p-2">/manutencao</td></tr>
        <tr><td className="border border-border p-2">Controle de Combustível</td><td className="border border-border p-2">Registrar abastecimentos e monitorar consumo</td><td className="border border-border p-2">/combustivel</td></tr>
      </tbody>
    </table>

    <h3 className="text-lg font-semibold text-primary mt-6 mb-2">2.3 Home Slider</h3>
    <p className="text-muted-foreground mb-2">Carrossel de imagens configurável via admin. Tamanho ideal: <strong>1200 × 525 px</strong> (proporção ~2.3:1). Suporta link de redirecionamento por slide.</p>

    <h3 className="text-lg font-semibold text-primary mt-6 mb-2">2.4 Top Manutenções</h3>
    <p className="text-muted-foreground mb-2">Exibe os 5 itens de manutenção mais frequentes/custosos, ordenados por custo decrescente.</p>
    <p className="text-muted-foreground mb-2">Cálculo: Agrupa <code className="bg-muted px-1 rounded text-xs">maintenance_records</code> por <code className="bg-muted px-1 rounded text-xs">item</code>, soma <code className="bg-muted px-1 rounded text-xs">custo</code> e conta <code className="bg-muted px-1 rounded text-xs">ocorrências</code>. Ordena por custo DESC.</p>
    <p className="text-muted-foreground mb-2">Estado vazio: <em>"Nenhuma manutenção registrada"</em></p>

    <h3 className="text-lg font-semibold text-primary mt-6 mb-2">2.5 Próximas Manutenções</h3>
    <p className="text-muted-foreground mb-2">Lista manutenções com <code className="bg-muted px-1 rounded text-xs">status === "agendada"</code>, ordenadas por proximidade da data.</p>
    <table className="w-full text-sm border-collapse mb-4">
      <thead><tr className="bg-muted"><th className="border border-border p-2">Condição</th><th className="border border-border p-2">Badge</th></tr></thead>
      <tbody>
        <tr><td className="border border-border p-2">diffDays &lt; 0</td><td className="border border-border p-2">Destructive — "Xd atrasado"</td></tr>
        <tr><td className="border border-border p-2">diffDays === 0</td><td className="border border-border p-2">Destructive — "Hoje"</td></tr>
        <tr><td className="border border-border p-2">diffDays ≤ 7</td><td className="border border-border p-2">Destructive — "Xd"</td></tr>
        <tr><td className="border border-border p-2">diffDays ≤ 30</td><td className="border border-border p-2">Secondary — "Xd"</td></tr>
        <tr><td className="border border-border p-2">diffDays &gt; 30</td><td className="border border-border p-2">Default — "Xd"</td></tr>
      </tbody>
    </table>
    <p className="text-muted-foreground">Cálculo: <code className="bg-muted px-1 rounded text-xs">diffDays = ceil((dueDate - today) / 86400000)</code></p>

    <h3 className="text-lg font-semibold text-primary mt-6 mb-2">2.6 Consumo por Veículo</h3>
    <p className="text-muted-foreground mb-2">Top 5 veículos por custo de combustível. Exibe km/L médio e custo total por veículo.</p>
    <p className="text-muted-foreground">Estado vazio: <em>"Nenhum abastecimento registrado"</em></p>

    <h3 className="text-lg font-semibold text-primary mt-6 mb-2">2.7 Inspeções Recentes</h3>
    <p className="text-muted-foreground mb-2">Últimos 5 checklists. Classificação de status:</p>
    <table className="w-full text-sm border-collapse mb-4">
      <thead><tr className="bg-muted"><th className="border border-border p-2">Condição</th><th className="border border-border p-2">Status</th></tr></thead>
      <tbody>
        <tr><td className="border border-border p-2">Alguma condição "bad" OU &gt;2 avarias</td><td className="border border-border p-2">Ruim (destructive)</td></tr>
        <tr><td className="border border-border p-2">Alguma condição "medium" OU avarias &gt; 0</td><td className="border border-border p-2">Regular (secondary)</td></tr>
        <tr><td className="border border-border p-2">Tudo "good" ou null, sem avarias</td><td className="border border-border p-2">Bom (default)</td></tr>
      </tbody>
    </table>
  </div>
);

const SectionVehicles = () => (
  <div>
    <h2 className="text-xl font-bold text-foreground border-b-2 border-primary pb-2 mb-4 page-break">3. Veículos (/veiculos)</h2>
    <ScreenshotImg src={screenshotVeiculos} alt="Lista de Veículos — /veiculos" />

    <h3 className="text-lg font-semibold text-primary mt-4 mb-2">3.1 Listagem</h3>
    <p className="text-muted-foreground mb-2">Exibe todos os veículos do usuário com contador: <code className="bg-muted px-1 rounded text-xs">"X veículo(s) cadastrado(s)"</code></p>
    <p className="text-muted-foreground mb-2">Status disponíveis: <strong>Ativo</strong>, <strong>Inativo</strong>, <strong>Em Manutenção</strong></p>

    <h3 className="text-lg font-semibold text-primary mt-6 mb-2">3.2 Formulário de Cadastro/Edição</h3>
    <p className="text-muted-foreground mb-2">Campos: Placa, Modelo, Tipo, Marca, Ano, Cor, Empresa, Quilometragem, Status.</p>
    <table className="w-full text-sm border-collapse mb-4">
      <thead><tr className="bg-muted"><th className="border border-border p-2">Tipo de Veículo</th><th className="border border-border p-2">Valor interno</th></tr></thead>
      <tbody>
        {[["Caminhão","caminhao"],["Carro de Passeio","carro_passeio"],["Van","van"],["Furgão","furgao"],["Ônibus","onibus"],["Moto","moto"],["Picape","picape"]].map(([l,v]) => (
          <tr key={v}><td className="border border-border p-2">{l}</td><td className="border border-border p-2"><code className="bg-muted px-1 rounded text-xs">{v}</code></td></tr>
        ))}
      </tbody>
    </table>

    <h3 className="text-lg font-semibold text-primary mt-6 mb-2">3.3 Mensagens</h3>
    <table className="w-full text-sm border-collapse mb-4">
      <thead><tr className="bg-muted"><th className="border border-border p-2">Ação</th><th className="border border-border p-2">Sucesso</th><th className="border border-border p-2">Erro</th></tr></thead>
      <tbody>
        <tr><td className="border border-border p-2">Cadastrar</td><td className="border border-border p-2">"Veículo cadastrado com sucesso!"</td><td className="border border-border p-2">"Erro ao cadastrar veículo" / "Já existe um veículo com esta placa"</td></tr>
        <tr><td className="border border-border p-2">Editar</td><td className="border border-border p-2">"Veículo atualizado com sucesso!"</td><td className="border border-border p-2">"Erro ao atualizar veículo"</td></tr>
        <tr><td className="border border-border p-2">Excluir</td><td className="border border-border p-2">"Veículo e registros associados excluídos com sucesso"</td><td className="border border-border p-2">"Erro ao excluir veículo"</td></tr>
      </tbody>
    </table>
    <p className="text-muted-foreground mb-2"><strong>Exclusão em cascata:</strong> Ao excluir um veículo, também são excluídos seus registros de combustível, manutenção e checklists vinculados.</p>

    <h3 className="text-lg font-semibold text-primary mt-6 mb-2">3.4 Perfil do Veículo (/veiculos/:id)</h3>
    <p className="text-muted-foreground mb-2">Página individual com dados técnicos + 3 abas: <strong>Manutenção</strong>, <strong>Combustível</strong>, <strong>Inspeções</strong>.</p>
    <p className="text-muted-foreground mb-2">Cards resumo: Odômetro, Custo Manutenção, Custo Combustível, Consumo médio (km/L).</p>
    <p className="text-muted-foreground">Veículo não encontrado: <em>"Veículo não encontrado"</em> + botão "Voltar".</p>
  </div>
);

const SectionChecklist = () => (
  <div>
    <h2 className="text-xl font-bold text-foreground border-b-2 border-primary pb-2 mb-4 page-break">4. Checklist de Inspeção (/checklist)</h2>
    <ScreenshotImg src={screenshotChecklist} alt="Checklist de Inspeção — /checklist" />

    <h3 className="text-lg font-semibold text-primary mt-4 mb-2">4.1 Formulário</h3>
    <p className="text-muted-foreground mb-2">Seções colapsáveis:</p>
    <table className="w-full text-sm border-collapse mb-4">
      <thead><tr className="bg-muted"><th className="border border-border p-2">Seção</th><th className="border border-border p-2">Campos</th><th className="border border-border p-2">Tipo de resposta</th></tr></thead>
      <tbody>
        <tr><td className="border border-border p-2">Informações Gerais</td><td className="border border-border p-2">Inspetor*, Data, Veículo*, Tipo, Quilometragem</td><td className="border border-border p-2">Texto / Select</td></tr>
        <tr><td className="border border-border p-2">Áreas Afetadas</td><td className="border border-border p-2">Diagrama interativo do veículo</td><td className="border border-border p-2">Marcadores: risco, amassado, quebrado, outro</td></tr>
        <tr><td className="border border-border p-2">Condições do Veículo</td><td className="border border-border p-2">Limpeza Externa/Interna, Pneus, Estepe</td><td className="border border-border p-2">Bom / Regular / Ruim</td></tr>
        <tr><td className="border border-border p-2">Luzes Dianteiras (E/D)</td><td className="border border-border p-2">Farol, Seta, Lanterna</td><td className="border border-border p-2">Sim / Não / N/A</td></tr>
        <tr><td className="border border-border p-2">Luzes Traseiras (E/D)</td><td className="border border-border p-2">Lanterna, Freio, Seta, Ré</td><td className="border border-border p-2">Sim / Não / N/A</td></tr>
        <tr><td className="border border-border p-2">Outros Itens</td><td className="border border-border p-2">Triângulo, Extintor, Macaco, Chave de Roda, Documentos</td><td className="border border-border p-2">Sim / Não / N/A</td></tr>
        <tr><td className="border border-border p-2">Verificação Mecânica</td><td className="border border-border p-2">Nível de Óleo, Nível de Água, Fluido de Freio, Bateria, Correia</td><td className="border border-border p-2">Sim / Não / N/A</td></tr>
        <tr><td className="border border-border p-2">Observações e Imagens</td><td className="border border-border p-2">Texto livre + Upload de imagens</td><td className="border border-border p-2">Textarea + Images</td></tr>
      </tbody>
    </table>
    <p className="text-muted-foreground mb-2">Validação submit: <code className="bg-muted px-1 rounded text-xs">"Selecione um veículo e preencha o nome do inspetor"</code></p>

    <h3 className="text-lg font-semibold text-primary mt-6 mb-2">4.2 Classificação de Status (Checklist)</h3>
    <table className="w-full text-sm border-collapse mb-4">
      <thead><tr className="bg-muted"><th className="border border-border p-2">Condição</th><th className="border border-border p-2">Status</th></tr></thead>
      <tbody>
        <tr><td className="border border-border p-2">Condição "bad" OU &gt;2 avarias</td><td className="border border-border p-2">Crítico</td></tr>
        <tr><td className="border border-border p-2">Condição "medium" OU avarias &gt; 0</td><td className="border border-border p-2">Atenção</td></tr>
        <tr><td className="border border-border p-2">Demais casos</td><td className="border border-border p-2">Bom</td></tr>
      </tbody>
    </table>

    <h3 className="text-lg font-semibold text-primary mt-6 mb-2">4.3 Filtros</h3>
    <p className="text-muted-foreground mb-2">Veículo, Status (Bom/Atenção/Crítico), Data De/Até. Botão "Limpar" quando filtro ativo.</p>
    <p className="text-muted-foreground mb-2">Subtítulo: <code className="bg-muted px-1 rounded text-xs">"X registro(s) (filtrado de Y)"</code></p>

    <h3 className="text-lg font-semibold text-primary mt-6 mb-2">4.4 Exportação CSV</h3>
    <p className="text-muted-foreground mb-2">Colunas: Data, Inspetor, Veículo, Placa, Tipo, Quilometragem, Limpeza Externa/Interna, Pneus, Estepe, Áreas Afetadas, Observações.</p>
    <p className="text-muted-foreground mb-2">Separador: <code className="bg-muted px-1 rounded text-xs">;</code> (ponto e vírgula). Encoding: UTF-8 com BOM.</p>
    <p className="text-muted-foreground">Arquivo: <code className="bg-muted px-1 rounded text-xs">inspecoes-veiculares-YYYY-MM-DD.csv</code></p>

    <h3 className="text-lg font-semibold text-primary mt-6 mb-2">4.5 Alerta de Veículos Avariados</h3>
    <p className="text-muted-foreground mb-2">Banner exibido quando há veículos com problemas detectados na última inspeção e <strong>sem manutenção registrada posterior</strong>.</p>
    <p className="text-muted-foreground mb-2">Título: <em>"Veículos que precisam de manutenção"</em>. Pode ser dispensado (localStorage).</p>

    <h3 className="text-lg font-semibold text-primary mt-6 mb-2">4.6 Mensagens</h3>
    <table className="w-full text-sm border-collapse mb-4">
      <thead><tr className="bg-muted"><th className="border border-border p-2">Ação</th><th className="border border-border p-2">Mensagem</th></tr></thead>
      <tbody>
        <tr><td className="border border-border p-2">Salvar novo</td><td className="border border-border p-2">"Checklist salvo com sucesso!"</td></tr>
        <tr><td className="border border-border p-2">Atualizar</td><td className="border border-border p-2">"Checklist atualizado com sucesso!"</td></tr>
        <tr><td className="border border-border p-2">Excluir</td><td className="border border-border p-2">"Checklist excluído com sucesso"</td></tr>
        <tr><td className="border border-border p-2">Limpar formulário</td><td className="border border-border p-2">"Formulário limpo" (info)</td></tr>
        <tr><td className="border border-border p-2">Sem veículo cadastrado</td><td className="border border-border p-2">"Quase lá! Adicione seu primeiro veículo para liberar a criação de checklists."</td></tr>
      </tbody>
    </table>
  </div>
);

const SectionMaintenance = () => (
  <div>
    <h2 className="text-xl font-bold text-foreground border-b-2 border-primary pb-2 mb-4 page-break">5. Manutenção (/manutencao)</h2>
    <ScreenshotImg src={screenshotManutencao} alt="Controle de Manutenção — /manutencao" />

    <h3 className="text-lg font-semibold text-primary mt-4 mb-2">5.1 Formulário</h3>
    <p className="text-muted-foreground mb-2">Campos: Veículo, Tipo (Preventiva/Corretiva), Grupo, Item, Descrição, Custo, Data, Quilometragem Atual/Próxima, Data Próxima, Fornecedor, Nota Fiscal, Status, Observações, Imagens.</p>

    <h3 className="text-lg font-semibold text-primary mt-6 mb-2">5.2 Grupos de Manutenção</h3>
    <table className="w-full text-sm border-collapse mb-4">
      <thead><tr className="bg-muted"><th className="border border-border p-2">Grupo</th><th className="border border-border p-2">Itens</th></tr></thead>
      <tbody>
        <tr><td className="border border-border p-2">Ar Condicionado</td><td className="border border-border p-2">Correia do compressor, Limpeza + Filtro</td></tr>
        <tr><td className="border border-border p-2">Direção</td><td className="border border-border p-2">Fluido da direção hidráulica, Correia poly-v</td></tr>
        <tr><td className="border border-border p-2">Freio</td><td className="border border-border p-2">Pastilha, Disco, Fluido de freio</td></tr>
        <tr><td className="border border-border p-2">Limpadores</td><td className="border border-border p-2">Limpadores de parabrisa, Água do limpador</td></tr>
        <tr><td className="border border-border p-2">Motor</td><td className="border border-border p-2">Filtro de combustível, Correia dentada + rolamentos, Velas, Correia do alternador, Óleo do motor</td></tr>
        <tr><td className="border border-border p-2">Pneus</td><td className="border border-border p-2">Alinhamento, Calibragem, Calibragem do estepe, Pneus, Rodízio</td></tr>
        <tr><td className="border border-border p-2">Outros</td><td className="border border-border p-2">Fluido das transmissões, Luzes, Bateria, Suspensão, Mangueiras, Líquido + Limpeza do radiador</td></tr>
      </tbody>
    </table>

    <h3 className="text-lg font-semibold text-primary mt-6 mb-2">5.3 Status de Manutenção</h3>
    <p className="text-muted-foreground mb-2"><strong>Realizada</strong>, <strong>Agendada</strong>, <strong>Pendente</strong></p>
    <p className="text-muted-foreground mb-2">Ação "Marcar como Realizada": Muda status para <code className="bg-muted px-1 rounded text-xs">realizada</code> e define <code className="bg-muted px-1 rounded text-xs">data_manutencao</code> como hoje.</p>

    <h3 className="text-lg font-semibold text-primary mt-6 mb-2">5.4 Filtros</h3>
    <p className="text-muted-foreground mb-2">Veículo, Status (Realizada/Agendada/Pendente), Data De/Até.</p>
    <p className="text-muted-foreground mb-2">Subtítulo: <code className="bg-muted px-1 rounded text-xs">"X registro(s) (filtrado de Y) • Total: R$ Z"</code></p>

    <h3 className="text-lg font-semibold text-primary mt-6 mb-2">5.5 Exportação CSV</h3>
    <p className="text-muted-foreground mb-2">Colunas: Data, Veículo, Placa, Tipo, Grupo, Item, Descrição, Custo, Quilometragem, Próx. Quilometragem, Próx. Data, Fornecedor, Nota Fiscal, Status, Observações.</p>
    <p className="text-muted-foreground">Arquivo: <code className="bg-muted px-1 rounded text-xs">manutencoes-YYYY-MM-DD.csv</code></p>

    <h3 className="text-lg font-semibold text-primary mt-6 mb-2">5.6 Mensagens</h3>
    <table className="w-full text-sm border-collapse mb-4">
      <thead><tr className="bg-muted"><th className="border border-border p-2">Ação</th><th className="border border-border p-2">Mensagem</th></tr></thead>
      <tbody>
        <tr><td className="border border-border p-2">Cadastrar</td><td className="border border-border p-2">"Manutenção registrada com sucesso!"</td></tr>
        <tr><td className="border border-border p-2">Editar</td><td className="border border-border p-2">"Registro atualizado com sucesso!"</td></tr>
        <tr><td className="border border-border p-2">Excluir</td><td className="border border-border p-2">"Registro excluído com sucesso"</td></tr>
        <tr><td className="border border-border p-2">Sem veículo</td><td className="border border-border p-2">"Sua frota ainda está vazia. Adicione seu primeiro veículo para registrar uma manutenção."</td></tr>
      </tbody>
    </table>
  </div>
);

const SectionFuel = () => (
  <div>
    <h2 className="text-xl font-bold text-foreground border-b-2 border-primary pb-2 mb-4 page-break">6. Combustível (/combustivel)</h2>
    <ScreenshotImg src={screenshotCombustivel} alt="Controle de Combustível — /combustivel" />

    <h3 className="text-lg font-semibold text-primary mt-4 mb-2">6.1 Formulário</h3>
    <p className="text-muted-foreground mb-2">Campos: Veículo, Data, Posto, Tipo Combustível, Litros, Valor Total, Quilometragem, Tanque Cheio, Condutor, Observações, Imagens.</p>

    <h3 className="text-lg font-semibold text-primary mt-6 mb-2">6.2 Tipos de Combustível</h3>
    <table className="w-full text-sm border-collapse mb-4">
      <thead><tr className="bg-muted"><th className="border border-border p-2">Label</th><th className="border border-border p-2">Valor</th></tr></thead>
      <tbody>
        {[["Gasolina Comum","gasolina_comum"],["Gasolina Aditivada","gasolina_aditivada"],["Etanol","etanol"],["Diesel","diesel"],["Diesel S10","diesel_s10"],["GNV","gnv"]].map(([l,v]) => (
          <tr key={v}><td className="border border-border p-2">{l}</td><td className="border border-border p-2"><code className="bg-muted px-1 rounded text-xs">{v}</code></td></tr>
        ))}
      </tbody>
    </table>

    <h3 className="text-lg font-semibold text-primary mt-6 mb-2">6.3 Cálculos Automáticos</h3>
    <table className="w-full text-sm border-collapse mb-4">
      <thead><tr className="bg-muted"><th className="border border-border p-2">Campo</th><th className="border border-border p-2">Fórmula</th><th className="border border-border p-2">Condição</th></tr></thead>
      <tbody>
        <tr><td className="border border-border p-2">Valor por litro</td><td className="border border-border p-2"><code className="bg-muted px-1 rounded text-xs">valor_total / litros</code></td><td className="border border-border p-2">Sempre</td></tr>
        <tr><td className="border border-border p-2">Km rodados</td><td className="border border-border p-2"><code className="bg-muted px-1 rounded text-xs">quilometragem_atual − quilometragem_abast_anterior</code></td><td className="border border-border p-2">Se existe abastecimento anterior do mesmo veículo</td></tr>
        <tr><td className="border border-border p-2">Km por litro</td><td className="border border-border p-2"><code className="bg-muted px-1 rounded text-xs">km_rodados / litros</code></td><td className="border border-border p-2">Se km_rodados calculado E tanque_cheio=true no abastecimento atual E anterior</td></tr>
      </tbody>
    </table>
    <p className="text-muted-foreground mb-2"><strong>Efeito colateral:</strong> Ao registrar abastecimento, o odômetro do veículo (<code className="bg-muted px-1 rounded text-xs">quilometragem_atual</code>) é atualizado automaticamente.</p>

    <h3 className="text-lg font-semibold text-primary mt-6 mb-2">6.4 Métricas Resumidas</h3>
    <p className="text-muted-foreground mb-2">Banner no topo: <code className="bg-muted px-1 rounded text-xs">"Média de consumo da frota: X km/L"</code> (exibido se avgKmPerLiter &gt; 0).</p>
    <p className="text-muted-foreground mb-2">Subtítulo: <code className="bg-muted px-1 rounded text-xs">"X registro(s) • Total: R$ Y • Z L"</code></p>

    <h3 className="text-lg font-semibold text-primary mt-6 mb-2">6.5 Exportação CSV</h3>
    <p className="text-muted-foreground mb-2">Colunas: Data, Veículo, Placa, Posto, Combustível, Litros, Valor Total, Valor/Litro, Quilometragem, Km Rodados, Km/L, Tanque Cheio, Condutor, Observações.</p>
    <p className="text-muted-foreground">Arquivo: <code className="bg-muted px-1 rounded text-xs">abastecimentos-YYYY-MM-DD.csv</code></p>

    <h3 className="text-lg font-semibold text-primary mt-6 mb-2">6.6 Mensagens</h3>
    <table className="w-full text-sm border-collapse mb-4">
      <thead><tr className="bg-muted"><th className="border border-border p-2">Ação</th><th className="border border-border p-2">Mensagem</th></tr></thead>
      <tbody>
        <tr><td className="border border-border p-2">Cadastrar</td><td className="border border-border p-2">"Abastecimento registrado com sucesso!"</td></tr>
        <tr><td className="border border-border p-2">Editar</td><td className="border border-border p-2">"Registro atualizado com sucesso!"</td></tr>
        <tr><td className="border border-border p-2">Excluir</td><td className="border border-border p-2">"Registro excluído com sucesso"</td></tr>
        <tr><td className="border border-border p-2">Sem veículo</td><td className="border border-border p-2">"Tudo pronto para abastecer? Primeiro, precisamos dos dados do seu veículo."</td></tr>
      </tbody>
    </table>
  </div>
);

const SectionProfile = () => (
  <div>
    <h2 className="text-xl font-bold text-foreground border-b-2 border-primary pb-2 mb-4 page-break">7. Perfil (/profile)</h2>
    <ScreenshotImg src={screenshotPerfil} alt="Meu Perfil — /profile" />
    <p className="text-muted-foreground mb-2">Campos editáveis: Nome, Telefone, Empresa, Cargo (select), Setor (select), Tamanho da Frota (select), Cidade, Estado (máx. 2 caracteres).</p>
    <p className="text-muted-foreground mb-2">Campo somente leitura: E-mail.</p>
    <p className="text-muted-foreground mb-2">Ao salvar, define <code className="bg-muted px-1 rounded text-xs">profile_completed = true</code>.</p>
    <table className="w-full text-sm border-collapse mb-4">
      <thead><tr className="bg-muted"><th className="border border-border p-2">Ação</th><th className="border border-border p-2">Mensagem</th></tr></thead>
      <tbody>
        <tr><td className="border border-border p-2">Salvar</td><td className="border border-border p-2">"Perfil atualizado com sucesso!"</td></tr>
        <tr><td className="border border-border p-2">Erro</td><td className="border border-border p-2">"Erro ao salvar" + detalhe</td></tr>
      </tbody>
    </table>
  </div>
);

const SectionNavigation = () => (
  <div>
    <h2 className="text-xl font-bold text-foreground border-b-2 border-primary pb-2 mb-4 page-break">8. Navegação e Rotas</h2>
    <table className="w-full text-sm border-collapse mb-4">
      <thead><tr className="bg-muted"><th className="border border-border p-2">Rota</th><th className="border border-border p-2">Página</th><th className="border border-border p-2">Acesso</th></tr></thead>
      <tbody>
        <tr><td className="border border-border p-2">/auth</td><td className="border border-border p-2">Login / Cadastro</td><td className="border border-border p-2">Público</td></tr>
        <tr><td className="border border-border p-2">/</td><td className="border border-border p-2">Painel de Controle</td><td className="border border-border p-2">Autenticado</td></tr>
        <tr><td className="border border-border p-2">/veiculos</td><td className="border border-border p-2">Lista de Veículos</td><td className="border border-border p-2">Autenticado</td></tr>
        <tr><td className="border border-border p-2">/veiculos/:id</td><td className="border border-border p-2">Perfil do Veículo</td><td className="border border-border p-2">Autenticado</td></tr>
        <tr><td className="border border-border p-2">/checklist</td><td className="border border-border p-2">Checklist de Inspeção</td><td className="border border-border p-2">Autenticado</td></tr>
        <tr><td className="border border-border p-2">/manutencao</td><td className="border border-border p-2">Controle de Manutenção</td><td className="border border-border p-2">Autenticado</td></tr>
        <tr><td className="border border-border p-2">/combustivel</td><td className="border border-border p-2">Controle de Combustível</td><td className="border border-border p-2">Autenticado</td></tr>
        <tr><td className="border border-border p-2">/profile</td><td className="border border-border p-2">Meu Perfil</td><td className="border border-border p-2">Autenticado</td></tr>
        <tr><td className="border border-border p-2">/admin/popups</td><td className="border border-border p-2">Gerenciador de Popups e Slider</td><td className="border border-border p-2">Admin</td></tr>
        <tr><td className="border border-border p-2">*</td><td className="border border-border p-2">Página não encontrada</td><td className="border border-border p-2">Público</td></tr>
      </tbody>
    </table>

    <h3 className="text-lg font-semibold text-primary mt-6 mb-2">8.1 Menu de Navegação</h3>
    <p className="text-muted-foreground mb-2">Desktop: Barra horizontal fixa. Mobile: Menu hambúrguer expansível.</p>
    <p className="text-muted-foreground mb-2">Itens: Painel, Veículos, Checklist, Manutenção, Combustível.</p>
    <p className="text-muted-foreground mb-2">Menu do usuário: E-mail, Meu Perfil, Sair.</p>

    <h3 className="text-lg font-semibold text-primary mt-6 mb-2">8.2 Estados Vazios</h3>
    <p className="text-muted-foreground mb-2">Quando o usuário tenta acessar Checklist, Manutenção ou Combustível sem veículos cadastrados, é exibida uma tela com botão "Cadastrar veículo" direcionando para /veiculos.</p>
  </div>
);

const SectionDatabase = () => (
  <div>
    <h2 className="text-xl font-bold text-foreground border-b-2 border-primary pb-2 mb-4 page-break">9. Estrutura de Dados</h2>
    <table className="w-full text-sm border-collapse mb-4">
      <thead><tr className="bg-muted"><th className="border border-border p-2">Tabela</th><th className="border border-border p-2">Campos principais</th><th className="border border-border p-2">RLS</th></tr></thead>
      <tbody>
        <tr><td className="border border-border p-2">vehicles</td><td className="border border-border p-2">placa, modelo, tipo, marca, ano, cor, empresa, quilometragem_atual, status</td><td className="border border-border p-2">user_id</td></tr>
        <tr><td className="border border-border p-2">fuel_records</td><td className="border border-border p-2">vehicle_id, data_abastecimento, tipo_combustivel, litros, valor_total, valor_litro, quilometragem, km_rodados, km_por_litro, tanque_cheio, condutor</td><td className="border border-border p-2">user_id</td></tr>
        <tr><td className="border border-border p-2">maintenance_records</td><td className="border border-border p-2">vehicle_id, tipo_manutencao, grupo, item, custo, data_manutencao, data_proxima, quilometragem_atual/proxima, fornecedor, nota_fiscal, status</td><td className="border border-border p-2">user_id</td></tr>
        <tr><td className="border border-border p-2">checklists</td><td className="border border-border p-2">data (JSONB com toda a estrutura do checklist)</td><td className="border border-border p-2">user_id</td></tr>
        <tr><td className="border border-border p-2">profiles</td><td className="border border-border p-2">nome, email, telefone, empresa, setor, cargo, tamanho_frota, cidade, estado, aceite_marketing, profile_completed</td><td className="border border-border p-2">user_id</td></tr>
        <tr><td className="border border-border p-2">analytics_events</td><td className="border border-border p-2">event_type, event_name, page_path, session_id, metadata</td><td className="border border-border p-2">user_id</td></tr>
        <tr><td className="border border-border p-2">user_roles</td><td className="border border-border p-2">user_id, role (admin/user)</td><td className="border border-border p-2">user_id</td></tr>
        <tr><td className="border border-border p-2">home_slides</td><td className="border border-border p-2">image_url, redirect_url, display_order, is_active</td><td className="border border-border p-2">Público (leitura)</td></tr>
        <tr><td className="border border-border p-2">popup_definitions</td><td className="border border-border p-2">name, title, description, form_schema, is_active</td><td className="border border-border p-2">Admin</td></tr>
        <tr><td className="border border-border p-2">popup_triggers</td><td className="border border-border p-2">popup_id, trigger_type, conditions, pages, priority</td><td className="border border-border p-2">Admin</td></tr>
      </tbody>
    </table>

    <h3 className="text-lg font-semibold text-primary mt-6 mb-2">9.1 Rastreamento de Eventos</h3>
    <p className="text-muted-foreground mb-2">O sistema rastreia eventos de CRUD (cadastro, edição, exclusão, exportação) na tabela <code className="bg-muted px-1 rounded text-xs">analytics_events</code> via função <code className="bg-muted px-1 rounded text-xs">trackUserEvent()</code>.</p>
    <p className="text-muted-foreground">Elementos com <code className="bg-muted px-1 rounded text-xs">data-track</code> são automaticamente rastreados por clique.</p>
  </div>
);

/* -------------------------------------------------------------------------- */
/* Main Page                                                                   */
/* -------------------------------------------------------------------------- */

const Documentation = () => {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8 no-print">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Documentação Técnica</h1>
              <p className="text-muted-foreground mt-1">VeiculoCheck — Sistema de Gestão de Frota</p>
            </div>
            <Button onClick={handleExportPDF} className="gap-2">
              <Download className="h-4 w-4" />
              Exportar PDF
            </Button>
          </div>

          <div className="print-area space-y-8">
            {/* Print header */}
            <div className="hidden print:block mb-8">
              <h1 className="text-3xl font-bold">VeiculoCheck — Documentação Técnica</h1>
              <p className="text-sm text-gray-500">Gerado em {new Date().toLocaleDateString("pt-BR")} • Uso interno / time de desenvolvimento</p>
            </div>

            <Card className="no-print">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Índice
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Autenticação</li>
                  <li>Painel de Controle (Cockpit)</li>
                  <li>Veículos</li>
                  <li>Checklist de Inspeção</li>
                  <li>Manutenção</li>
                  <li>Combustível</li>
                  <li>Perfil</li>
                  <li>Navegação e Rotas</li>
                  <li>Estrutura de Dados</li>
                </ol>
              </CardContent>
            </Card>

            <Tabs defaultValue="auth" className="no-print">
              <TabsList className="w-full flex flex-wrap h-auto gap-1">
                <TabsTrigger value="auth">Autenticação</TabsTrigger>
                <TabsTrigger value="cockpit">Painel</TabsTrigger>
                <TabsTrigger value="vehicles">Veículos</TabsTrigger>
                <TabsTrigger value="checklist">Checklist</TabsTrigger>
                <TabsTrigger value="maintenance">Manutenção</TabsTrigger>
                <TabsTrigger value="fuel">Combustível</TabsTrigger>
                <TabsTrigger value="profile">Perfil</TabsTrigger>
                <TabsTrigger value="nav">Navegação</TabsTrigger>
                <TabsTrigger value="db">Dados</TabsTrigger>
              </TabsList>
              <TabsContent value="auth" className="mt-6"><SectionAuth /></TabsContent>
              <TabsContent value="cockpit" className="mt-6"><SectionCockpit /></TabsContent>
              <TabsContent value="vehicles" className="mt-6"><SectionVehicles /></TabsContent>
              <TabsContent value="checklist" className="mt-6"><SectionChecklist /></TabsContent>
              <TabsContent value="maintenance" className="mt-6"><SectionMaintenance /></TabsContent>
              <TabsContent value="fuel" className="mt-6"><SectionFuel /></TabsContent>
              <TabsContent value="profile" className="mt-6"><SectionProfile /></TabsContent>
              <TabsContent value="nav" className="mt-6"><SectionNavigation /></TabsContent>
              <TabsContent value="db" className="mt-6"><SectionDatabase /></TabsContent>
            </Tabs>

            {/* Print: show all sections */}
            <div className="hidden print:block space-y-6">
              <SectionAuth />
              <SectionCockpit />
              <SectionVehicles />
              <SectionChecklist />
              <SectionMaintenance />
              <SectionFuel />
              <SectionProfile />
              <SectionNavigation />
              <SectionDatabase />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Documentation;

-- =====================================================
-- SISTEMA MODULAR DE GESTÃO DE FROTA
-- Tabelas centrais compartilhadas entre módulos
-- =====================================================

-- 1. TABELA DE VEÍCULOS (Entidade Central Compartilhada)
-- Os veículos cadastrados aqui são reutilizados em todos os módulos
CREATE TABLE public.vehicles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  placa TEXT NOT NULL,
  modelo TEXT NOT NULL,
  tipo TEXT NOT NULL, -- caminhao, carro_passeio, van, furgao, onibus, moto, picape
  marca TEXT,
  ano INTEGER,
  cor TEXT,
  empresa TEXT,
  quilometragem_atual INTEGER DEFAULT 0,
  status TEXT DEFAULT 'ativo', -- ativo, inativo, em_manutencao
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT unique_placa_per_user UNIQUE (user_id, placa)
);

-- Enable RLS
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for vehicles
CREATE POLICY "Users can view their own vehicles"
ON public.vehicles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own vehicles"
ON public.vehicles FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own vehicles"
ON public.vehicles FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own vehicles"
ON public.vehicles FOR DELETE
USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_vehicles_updated_at
BEFORE UPDATE ON public.vehicles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- 2. TABELA DE REGISTROS DE MANUTENÇÃO
-- =====================================================
CREATE TABLE public.maintenance_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  tipo_manutencao TEXT NOT NULL, -- preventiva, corretiva, pneus, freios, motor, etc
  grupo TEXT, -- ar, direcao, freio, limpadores, motor, pneus, outros
  item TEXT NOT NULL,
  descricao TEXT,
  custo DECIMAL(10,2) DEFAULT 0,
  quilometragem_atual INTEGER,
  quilometragem_proxima INTEGER, -- km para próxima manutenção
  data_manutencao DATE NOT NULL,
  data_proxima DATE, -- data próxima manutenção
  fornecedor TEXT,
  nota_fiscal TEXT,
  status TEXT DEFAULT 'realizada', -- realizada, agendada, pendente
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.maintenance_records ENABLE ROW LEVEL SECURITY;

-- RLS Policies for maintenance_records
CREATE POLICY "Users can view their own maintenance records"
ON public.maintenance_records FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own maintenance records"
ON public.maintenance_records FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own maintenance records"
ON public.maintenance_records FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own maintenance records"
ON public.maintenance_records FOR DELETE
USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_maintenance_records_updated_at
BEFORE UPDATE ON public.maintenance_records
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- 3. TABELA DE REGISTROS DE COMBUSTÍVEL/ABASTECIMENTO
-- =====================================================
CREATE TABLE public.fuel_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  data_abastecimento TIMESTAMP WITH TIME ZONE NOT NULL,
  posto TEXT,
  tipo_combustivel TEXT NOT NULL, -- gasolina_comum, gasolina_aditivada, etanol, diesel, diesel_s10, gnv
  litros DECIMAL(10,3) NOT NULL,
  valor_total DECIMAL(10,2) NOT NULL,
  valor_litro DECIMAL(10,3), -- calculado automaticamente
  quilometragem INTEGER NOT NULL,
  km_rodados INTEGER, -- calculado: diferença do último abastecimento
  km_por_litro DECIMAL(10,2), -- calculado: km_rodados / litros
  tanque_cheio BOOLEAN DEFAULT true,
  condutor TEXT,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.fuel_records ENABLE ROW LEVEL SECURITY;

-- RLS Policies for fuel_records
CREATE POLICY "Users can view their own fuel records"
ON public.fuel_records FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own fuel records"
ON public.fuel_records FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own fuel records"
ON public.fuel_records FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own fuel records"
ON public.fuel_records FOR DELETE
USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_fuel_records_updated_at
BEFORE UPDATE ON public.fuel_records
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- 4. ÍNDICES PARA PERFORMANCE
-- =====================================================
CREATE INDEX idx_vehicles_user_id ON public.vehicles(user_id);
CREATE INDEX idx_vehicles_placa ON public.vehicles(placa);
CREATE INDEX idx_maintenance_vehicle_id ON public.maintenance_records(vehicle_id);
CREATE INDEX idx_maintenance_user_id ON public.maintenance_records(user_id);
CREATE INDEX idx_maintenance_data ON public.maintenance_records(data_manutencao);
CREATE INDEX idx_fuel_vehicle_id ON public.fuel_records(vehicle_id);
CREATE INDEX idx_fuel_user_id ON public.fuel_records(user_id);
CREATE INDEX idx_fuel_data ON public.fuel_records(data_abastecimento);
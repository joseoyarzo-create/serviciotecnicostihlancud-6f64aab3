-- Drop all existing public access policies for clientes
DROP POLICY IF EXISTS "Acceso público lectura clientes" ON public.clientes;
DROP POLICY IF EXISTS "Acceso público escritura clientes" ON public.clientes;
DROP POLICY IF EXISTS "Acceso público actualización clientes" ON public.clientes;
DROP POLICY IF EXISTS "Acceso público eliminación clientes" ON public.clientes;

-- Create authentication-based policies for clientes
CREATE POLICY "Authenticated users can read clientes" 
  ON public.clientes FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Authenticated users can insert clientes" 
  ON public.clientes FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update clientes" 
  ON public.clientes FOR UPDATE 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete clientes" 
  ON public.clientes FOR DELETE 
  TO authenticated 
  USING (true);

-- Drop all existing public access policies for fichas
DROP POLICY IF EXISTS "Acceso público lectura fichas" ON public.fichas;
DROP POLICY IF EXISTS "Acceso público escritura fichas" ON public.fichas;
DROP POLICY IF EXISTS "Acceso público actualización fichas" ON public.fichas;
DROP POLICY IF EXISTS "Acceso público eliminación fichas" ON public.fichas;

-- Create authentication-based policies for fichas
CREATE POLICY "Authenticated users can read fichas" 
  ON public.fichas FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Authenticated users can insert fichas" 
  ON public.fichas FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update fichas" 
  ON public.fichas FOR UPDATE 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete fichas" 
  ON public.fichas FOR DELETE 
  TO authenticated 
  USING (true);

-- Drop all existing public access policies for repuestos
DROP POLICY IF EXISTS "Acceso público lectura repuestos" ON public.repuestos;
DROP POLICY IF EXISTS "Acceso público escritura repuestos" ON public.repuestos;
DROP POLICY IF EXISTS "Acceso público actualización repuestos" ON public.repuestos;
DROP POLICY IF EXISTS "Acceso público eliminación repuestos" ON public.repuestos;

-- Create authentication-based policies for repuestos
CREATE POLICY "Authenticated users can read repuestos" 
  ON public.repuestos FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Authenticated users can insert repuestos" 
  ON public.repuestos FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update repuestos" 
  ON public.repuestos FOR UPDATE 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete repuestos" 
  ON public.repuestos FOR DELETE 
  TO authenticated 
  USING (true);

-- Drop all existing public access policies for modelos
DROP POLICY IF EXISTS "Acceso público lectura modelos" ON public.modelos;
DROP POLICY IF EXISTS "Acceso público escritura modelos" ON public.modelos;
DROP POLICY IF EXISTS "Acceso público actualización modelos" ON public.modelos;
DROP POLICY IF EXISTS "Acceso público eliminación modelos" ON public.modelos;

-- Create authentication-based policies for modelos
CREATE POLICY "Authenticated users can read modelos" 
  ON public.modelos FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Authenticated users can insert modelos" 
  ON public.modelos FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update modelos" 
  ON public.modelos FOR UPDATE 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete modelos" 
  ON public.modelos FOR DELETE 
  TO authenticated 
  USING (true);

-- Drop all existing public access policies for contador
DROP POLICY IF EXISTS "Acceso público lectura contador" ON public.contador;
DROP POLICY IF EXISTS "Acceso público actualización contador" ON public.contador;

-- Create authentication-based policies for contador (no DELETE allowed)
CREATE POLICY "Authenticated users can read contador" 
  ON public.contador FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Authenticated users can update contador" 
  ON public.contador FOR UPDATE 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);
import { supabase } from '@/integrations/supabase/client';
import { Cliente, Repuesto, FichaTecnica, ServicioItem, RepuestoFicha } from '@/types';
import type { Json } from '@/integrations/supabase/types';
import { z } from 'zod';

// Validation schemas
const ClienteSchema = z.object({
  id: z.string().min(1),
  nombre: z.string().trim().min(1, 'Nombre requerido').max(200),
  telefono: z.string().trim().max(50).optional().or(z.literal('')),
});

const RepuestoSchema = z.object({
  id: z.string().min(1),
  codigo: z.string().trim().min(1, 'Código requerido').max(100),
  nombre: z.string().trim().min(1, 'Nombre requerido').max(300),
  precio: z.number().nonnegative('Precio inválido').max(100000000),
});

const ModeloSchema = z.object({
  id: z.string().min(1),
  modelo: z.string().trim().min(1, 'Modelo requerido').max(200),
});

const FichaSchema = z.object({
  id: z.string().min(1),
  numeroBoleta: z.string().trim().min(1).max(50),
  modeloMaquina: z.string().trim().min(1).max(200),
  numeroSerie: z.string().trim().max(100).optional().or(z.literal('')),
  tipoAveria: z.string().trim().max(2000).optional().or(z.literal('')),
  tecnico: z.enum(['JORGE', 'JEAN']),
  cliente: z.object({
    nombre: z.string().trim().min(1).max(200),
    telefono: z.string().trim().max(50).optional().or(z.literal('')),
  }),
});


// Clientes
export const getClientes = async (): Promise<Cliente[]> => {
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .order('nombre');
  
  if (error) {
    // error logged silently;
    return [];
  }
  
  return data.map(c => ({
    id: c.id,
    nombre: c.nombre,
    telefono: c.telefono || '',
  }));
};

export const saveCliente = async (cliente: Cliente): Promise<void> => {
  const validated = ClienteSchema.parse(cliente);
  const { error } = await supabase
    .from('clientes')
    .upsert({
      id: validated.id,
      nombre: validated.nombre,
      telefono: validated.telefono || null,
    }, { onConflict: 'id' });
  
  if (error) throw new Error('No se pudo guardar el cliente');
};

// Repuestos
export const getRepuestos = async (): Promise<Repuesto[]> => {
  const { data, error } = await supabase
    .from('repuestos')
    .select('*')
    .order('nombre');
  
  if (error) {
    // error logged silently;
    return [];
  }
  
  return data.map(r => ({
    id: r.id,
    codigo: r.codigo,
    nombre: r.nombre,
    precio: Number(r.precio),
  }));
};

export const saveRepuesto = async (repuesto: Repuesto): Promise<void> => {
  const validated = RepuestoSchema.parse(repuesto);
  const { error } = await supabase
    .from('repuestos')
    .upsert(validated, { onConflict: 'id' });
  
  if (error) throw new Error('No se pudo guardar el repuesto');
};

export const saveRepuestosBulk = async (nuevosRepuestos: Repuesto[]): Promise<void> => {
  for (const repuesto of nuevosRepuestos) {
    const validated = RepuestoSchema.parse(repuesto);
    const { data: existing } = await supabase
      .from('repuestos')
      .select('id')
      .eq('codigo', validated.codigo)
      .maybeSingle();
    
    if (existing) {
      await supabase
        .from('repuestos')
        .update({
          nombre: validated.nombre,
          precio: validated.precio,
        })
        .eq('id', existing.id);
    } else {
      await supabase
        .from('repuestos')
        .insert(validated);
    }
  }
};

export const deleteRepuesto = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('repuestos')
    .delete()
    .eq('id', id);
  
  if (error) {
    // error logged silently;
    throw error;
  }
};

// Modelos
export const getModelos = async (): Promise<{ id: string; modelo: string }[]> => {
  const { data, error } = await supabase
    .from('modelos')
    .select('*')
    .order('nombre');
  
  if (error) {
    // error logged silently;
    return [];
  }
  
  return data.map(m => ({
    id: m.id,
    modelo: m.nombre,
  }));
};

export const saveModelo = async (modelo: { id: string; modelo: string }): Promise<void> => {
  const { error } = await supabase
    .from('modelos')
    .upsert({
      id: modelo.id,
      nombre: modelo.modelo,
    }, { onConflict: 'id' });
  
  if (error) {
    // error logged silently;
    throw error;
  }
};

// Fichas Técnicas
export const getFichas = async (): Promise<FichaTecnica[]> => {
  const { data, error } = await supabase
    .from('fichas')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    // error logged silently;
    return [];
  }
  
  return data.map(f => ({
    id: f.id,
    numeroBoleta: f.numero_boleta,
    numeroServicio: f.numero_boleta,
    fechaIngreso: new Date(f.fecha_ingreso),
    fechaReparacion: f.fecha_reparacion ? new Date(f.fecha_reparacion) : null,
    fechaEntrega: f.fecha_entrega ? new Date(f.fecha_entrega) : null,
    cliente: {
      id: f.id,
      nombre: f.cliente_nombre,
      telefono: f.cliente_telefono || '',
    },
    modeloMaquina: f.modelo_maquina,
    numeroSerie: f.numero_serie || '',
    tipoAveria: f.observaciones || '',
    repuestos: (Array.isArray(f.repuestos) ? f.repuestos : []) as unknown as RepuestoFicha[],
    servicios: (Array.isArray(f.servicios) ? f.servicios : []) as unknown as ServicioItem[],
    recomendaciones: 'REPARACIÓN GARANTIZADA POR 10 DÍAS DE LA FECHA DE RETIRO',
    tecnico: f.mecanico as 'JORGE' | 'JEAN',
  }));
};

export const getFichaById = async (id: string): Promise<FichaTecnica | null> => {
  const { data, error } = await supabase
    .from('fichas')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    // error logged silently;
    return null;
  }
  
  return {
    id: data.id,
    numeroBoleta: data.numero_boleta,
    numeroServicio: data.numero_boleta,
    fechaIngreso: new Date(data.fecha_ingreso),
    fechaReparacion: data.fecha_reparacion ? new Date(data.fecha_reparacion) : null,
    fechaEntrega: data.fecha_entrega ? new Date(data.fecha_entrega) : null,
    cliente: {
      id: data.id,
      nombre: data.cliente_nombre,
      telefono: data.cliente_telefono || '',
    },
    modeloMaquina: data.modelo_maquina,
    numeroSerie: data.numero_serie || '',
    tipoAveria: data.observaciones || '',
    repuestos: (Array.isArray(data.repuestos) ? data.repuestos : []) as unknown as RepuestoFicha[],
    servicios: (Array.isArray(data.servicios) ? data.servicios : []) as unknown as ServicioItem[],
    recomendaciones: 'REPARACIÓN GARANTIZADA POR 10 DÍAS DE LA FECHA DE RETIRO',
    tecnico: data.mecanico as 'JORGE' | 'JEAN',
  };
};

export const saveFicha = async (ficha: FichaTecnica): Promise<void> => {
  const fichaData = {
    numero_boleta: ficha.numeroBoleta,
    fecha_ingreso: ficha.fechaIngreso.toISOString(),
    fecha_reparacion: ficha.fechaReparacion?.toISOString() || null,
    fecha_entrega: ficha.fechaEntrega?.toISOString() || null,
    cliente_nombre: ficha.cliente.nombre,
    cliente_telefono: ficha.cliente.telefono,
    modelo_maquina: ficha.modeloMaquina,
    numero_serie: ficha.numeroSerie,
    mecanico: ficha.tecnico,
    repuestos: JSON.parse(JSON.stringify(ficha.repuestos)) as Json,
    servicios: JSON.parse(JSON.stringify(ficha.servicios)) as Json,
    observaciones: ficha.tipoAveria,
  };

  // Check if ficha exists
  const { data: existing } = await supabase
    .from('fichas')
    .select('id')
    .eq('id', ficha.id)
    .maybeSingle();

  let error;
  if (existing) {
    const result = await supabase
      .from('fichas')
      .update(fichaData)
      .eq('id', ficha.id);
    error = result.error;
  } else {
    const insertData = { ...fichaData } as Record<string, unknown>;
    insertData.id = ficha.id;
    const result = await supabase
      .from('fichas')
      .insert(insertData as never);
    error = result.error;
  }
  
  if (error) {
    // error logged silently;
    throw error;
  }
};

export const deleteFicha = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('fichas')
    .delete()
    .eq('id', id);
  
  if (error) {
    // error logged silently;
    throw error;
  }
};

// Contador
export const getNextNumero = async (): Promise<number> => {
  const { data, error } = await supabase
    .from('contador')
    .select('valor')
    .eq('id', 'boleta')
    .single();
  
  if (error) {
    // error logged silently;
    return 1;
  }
  
  return (data?.valor || 0) + 1;
};

export const incrementContador = async (): Promise<void> => {
  const nextValue = await getNextNumero();
  
  const { error } = await supabase
    .from('contador')
    .update({ valor: nextValue })
    .eq('id', 'boleta');
  
  if (error) {
    // error logged silently;
    throw error;
  }
};

// Generate ID helper
export const generateId = (): string => {
  return crypto.randomUUID();
};

export const getNextFolio = async (): Promise<string> => {
  try {
    const { data, error } = await supabase
      .from('fichas')
      .select('numero_boleta')
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) {
      // error logged silently;
      return '';
    }

    if (data && data.length > 0) {
      const lastBoleta = data[0].numero_boleta;
      // Try to extract the last sequence of digits
      const match = lastBoleta.match(/(\d+)$/);
      if (match) {
        const num = parseInt(match[1], 10);
        return (num + 1).toString();
      }
      // If it's a number but parsed simply
      const simpleNum = parseInt(lastBoleta, 10);
      if (!isNaN(simpleNum)) {
        return (simpleNum + 1).toString();
      }
    }
    
    return '1';
  } catch (error) {
    // error logged silently;
    return '';
  }
};

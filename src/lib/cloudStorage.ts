import { supabase } from '@/integrations/supabase/client';
import { Cliente, Repuesto, FichaTecnica, ServicioItem, RepuestoFicha } from '@/types';
import type { Json } from '@/integrations/supabase/types';

// Clientes
export const getClientes = async (): Promise<Cliente[]> => {
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .order('nombre');
  
  if (error) {
    console.error('Error fetching clientes:', error);
    return [];
  }
  
  return data.map(c => ({
    id: c.id,
    nombre: c.nombre,
    telefono: c.telefono || '',
  }));
};

export const saveCliente = async (cliente: Cliente): Promise<void> => {
  const { error } = await supabase
    .from('clientes')
    .upsert({
      id: cliente.id,
      nombre: cliente.nombre,
      telefono: cliente.telefono,
    }, { onConflict: 'id' });
  
  if (error) {
    console.error('Error saving cliente:', error);
    throw error;
  }
};

// Repuestos
export const getRepuestos = async (): Promise<Repuesto[]> => {
  const { data, error } = await supabase
    .from('repuestos')
    .select('*')
    .order('nombre');
  
  if (error) {
    console.error('Error fetching repuestos:', error);
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
  const { error } = await supabase
    .from('repuestos')
    .upsert({
      id: repuesto.id,
      codigo: repuesto.codigo,
      nombre: repuesto.nombre,
      precio: repuesto.precio,
    }, { onConflict: 'id' });
  
  if (error) {
    console.error('Error saving repuesto:', error);
    throw error;
  }
};

export const saveRepuestosBulk = async (nuevosRepuestos: Repuesto[]): Promise<void> => {
  for (const repuesto of nuevosRepuestos) {
    const { data: existing } = await supabase
      .from('repuestos')
      .select('id')
      .eq('codigo', repuesto.codigo)
      .maybeSingle();
    
    if (existing) {
      await supabase
        .from('repuestos')
        .update({
          nombre: repuesto.nombre,
          precio: repuesto.precio,
        })
        .eq('id', existing.id);
    } else {
      await supabase
        .from('repuestos')
        .insert({
          id: repuesto.id,
          codigo: repuesto.codigo,
          nombre: repuesto.nombre,
          precio: repuesto.precio,
        });
    }
  }
};

export const deleteRepuesto = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('repuestos')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting repuesto:', error);
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
    console.error('Error fetching modelos:', error);
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
    console.error('Error saving modelo:', error);
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
    console.error('Error fetching fichas:', error);
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
    estado: (f.cliente_direccion === 'ENTREGADA' ? 'ENTREGADA' : 'TALLER') as 'TALLER' | 'ENTREGADA',
  }));
};

export const getFichaById = async (id: string): Promise<FichaTecnica | null> => {
  const { data, error } = await supabase
    .from('fichas')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching ficha:', error);
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
    estado: (data.cliente_direccion === 'ENTREGADA' ? 'ENTREGADA' : 'TALLER') as 'TALLER' | 'ENTREGADA',
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
    cliente_direccion: ficha.estado,
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
    console.error('Error saving ficha:', error);
    throw error;
  }
};

export const updateFichaEstado = async (id: string, estado: 'TALLER' | 'ENTREGADA'): Promise<void> => {
  const updateData: Record<string, unknown> = { cliente_direccion: estado };
  
  // Si se cambia a ENTREGADA, también podemos establecer la fecha de entrega si no existe
  if (estado === 'ENTREGADA') {
    updateData.fecha_entrega = new Date().toISOString();
  }

  const { error } = await supabase
    .from('fichas')
    .update(updateData)
    .eq('id', id);
  
  if (error) {
    console.error('Error updating ficha estado:', error);
    throw error;
  }
};

export const deleteFicha = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('fichas')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting ficha:', error);
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
    console.error('Error fetching contador:', error);
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
    console.error('Error incrementing contador:', error);
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
      console.error('Error fetching last folio:', error);
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
    console.error('Error in getNextFolio:', error);
    return '';
  }
};

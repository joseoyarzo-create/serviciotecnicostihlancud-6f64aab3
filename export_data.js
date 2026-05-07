
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Error: VITE_SUPABASE_URL o VITE_SUPABASE_PUBLISHABLE_KEY no están definidos en el .env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function exportData() {
  console.log('Iniciando exportación de datos...');

  try {
    // Exportar Clientes
    const { data: clientes, error: errClientes } = await supabase.from('clientes').select('*');
    if (errClientes) throw errClientes;
    fs.writeFileSync('export_clientes.json', JSON.stringify(clientes, null, 2));
    console.log(`- Clientes exportados: ${clientes.length}`);

    // Exportar Repuestos
    const { data: repuestos, error: errRepuestos } = await supabase.from('repuestos').select('*');
    if (errRepuestos) throw errRepuestos;
    fs.writeFileSync('export_repuestos.json', JSON.stringify(repuestos, null, 2));
    console.log(`- Repuestos exportados: ${repuestos.length}`);

    // Exportar Fichas
    const { data: fichas, error: errFichas } = await supabase.from('fichas').select('*');
    if (errFichas) throw errFichas;
    fs.writeFileSync('export_fichas.json', JSON.stringify(fichas, null, 2));
    console.log(`- Fichas exportadas: ${fichas.length}`);

    // Exportar Modelos
    const { data: modelos, error: errModelos } = await supabase.from('modelos').select('*');
    if (errModelos) throw errModelos;
    fs.writeFileSync('export_modelos.json', JSON.stringify(modelos, null, 2));
    console.log(`- Modelos exportados: ${modelos.length}`);

    console.log('\n¡Exportación completada con éxito!');
    console.log('Archivos generados: export_clientes.json, export_repuestos.json, export_fichas.json, export_modelos.json');
  } catch (error) {
    console.error('Error durante la exportación:', error);
  }
}

exportData();

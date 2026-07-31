import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ ERRO: Faltando credenciais do Supabase no .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const USERS = [
  {
    email: 'abner@canhoto.com',
    password: 'AbnerTAF2027!',
    data: {
      full_name: 'Abner',
      nickname: 'Abner',
      experience_level: 'beginner'
    }
  },
  {
    email: 'joao@canhoto.com',
    password: 'JoaoTAF2027!',
    data: {
      full_name: 'João Vitor',
      nickname: 'João',
      experience_level: 'beginner'
    }
  }
];

async function seedUsers() {
  console.log('🚀 Iniciando criação de usuários X1...');
  
  for (const u of USERS) {
    console.log(`\nTentando criar: ${u.data.full_name} (${u.email})`);
    const { data, error } = await supabase.auth.signUp({
      email: u.email,
      password: u.password,
      options: {
        data: u.data,
      }
    });

    if (error) {
      console.error(`❌ Erro ao criar ${u.data.full_name}:`, error.message);
    } else {
      console.log(`✅ Usuário ${u.data.full_name} criado com sucesso! ID: ${data.user?.id}`);
    }
  }
  
  console.log('\n✅ Script finalizado.');
}

seedUsers();

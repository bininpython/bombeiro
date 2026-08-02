export type Exercise = {
  id: string;
  name: string;
  sets?: string;
  reps?: string;
  duration?: string;
  notes?: string;
};

export type WorkoutDay = {
  dayOfWeek: number; // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
  title: string;
  exercises: Exercise[];
};

export const WORKOUT_ROUTINE: WorkoutDay[] = [
  {
    dayOfWeek: 0,
    title: 'Domingo — Recuperação',
    exercises: [
      { id: 'sun_walk', name: 'Caminhada leve' },
      { id: 'sun_mob', name: 'Mobilidade' },
      { id: 'sun_stretch', name: 'Alongamento' },
      { id: 'sun_rest', name: 'Descanso ativo' }
    ]
  },
  {
    dayOfWeek: 1,
    title: 'Segunda — Peito, tríceps e corrida leve',
    exercises: [
      { id: 'mon_pushup', name: 'Flexão de braço', sets: '4', reps: '12 a 20' },
      { id: 'mon_bench', name: 'Supino ou variação', sets: '4', reps: '8-12' },
      { id: 'mon_triceps', name: 'Tríceps', sets: '3', reps: '10-15' },
      { id: 'mon_abs', name: 'Abdominal', sets: '3', reps: '20' },
      { id: 'mon_run', name: 'Corrida leve', duration: '25 a 35 minutos' }
    ]
  },
  {
    dayOfWeek: 2,
    title: 'Terça — Costas, bíceps e barra',
    exercises: [
      { id: 'tue_pullup', name: 'Barra fixa', sets: '5' },
      { id: 'tue_row', name: 'Remada', sets: '4', reps: '10-12' },
      { id: 'tue_biceps', name: 'Rosca bíceps', sets: '3', reps: '10-12' },
      { id: 'tue_plank', name: 'Prancha', sets: '3', duration: '45-60 segundos' },
      { id: 'tue_sprint', name: 'Tiros de corrida', sets: '6', reps: '200 metros' }
    ]
  },
  {
    dayOfWeek: 3,
    title: 'Quarta — Pernas e bicicleta',
    exercises: [
      { id: 'wed_squat', name: 'Agachamento', sets: '4', reps: '10-15' },
      { id: 'wed_lunge', name: 'Afundo', sets: '3', reps: '12 por perna' },
      { id: 'wed_deadlift', name: 'Levantamento terra romeno', sets: '3', reps: '10-12' },
      { id: 'wed_calf', name: 'Panturrilha', sets: '4', reps: '15-20' },
      { id: 'wed_bike', name: 'Bike', duration: '30 a 40 minutos' }
    ]
  },
  {
    dayOfWeek: 4,
    title: 'Quinta — Ombros, core e agilidade',
    exercises: [
      { id: 'thu_shoulder', name: 'Desenvolvimento de ombros', sets: '4', reps: '8-12' },
      { id: 'thu_lateral', name: 'Elevação lateral', sets: '3', reps: '12-15' },
      { id: 'thu_abs', name: 'Abdominal', sets: '4', reps: '20-30' },
      { id: 'thu_shuttle', name: 'Shuttle Run', reps: '4 a 6 repetições' },
      { id: 'thu_mob', name: 'Mobilidade', duration: '10 minutos' }
    ]
  },
  {
    dayOfWeek: 5,
    title: 'Sexta — Corpo inteiro e simulado',
    exercises: [
      { id: 'fri_pullup', name: 'Barra fixa', sets: '4' },
      { id: 'fri_pushup', name: 'Flexão de braço', sets: '4' },
      { id: 'fri_squat', name: 'Agachamento', sets: '3', reps: '12' },
      { id: 'fri_run', name: 'Corrida de 2.400 metros' },
      { id: 'fri_abs', name: 'Abdominal máximo', duration: 'em 60 segundos' }
    ]
  },
  {
    dayOfWeek: 6,
    title: 'Sábado — Natação e resistência (Apenas Ciclismo/Trote)',
    exercises: [
      { id: 'sat_bike', name: 'Bike leve ou trote', duration: '20 a 30 minutos' },
      { id: 'sat_stretch', name: 'Alongamento' }
    ]
  }
];

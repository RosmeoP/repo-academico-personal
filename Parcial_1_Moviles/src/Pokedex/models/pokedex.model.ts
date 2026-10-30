export interface TrainerStats {
  badges: number;
  pokemon: number;
  wins: number;
}

export interface PokemonPlaceholder {
  id: string;
  name: string;
  imageUrl: string;
}

export interface TrainerProfile {
  name: string;
  biography: string;
  stats: TrainerStats;
  pokemon: PokemonPlaceholder[];
}

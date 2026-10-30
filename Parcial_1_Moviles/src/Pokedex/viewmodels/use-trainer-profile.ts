import { useMemo, useState } from 'react';

import { TrainerProfile } from '../models/pokedex.model';

const trainer: TrainerProfile = {
  name: 'Ash Ketchum',
  biography: 'Pokemon Master in training. Pallet Town, Kanto Region.',
  stats: { badges: 8, pokemon: 151, wins: 342 },
  pokemon: [
    { id: 'pikachu', name: 'Pikachu', imageUrl: 'https://i.blogs.es/6f1593/pikachu/450_1000.webp' },
    { id: 'charizard', name: 'Charizard', imageUrl: 'https://imagenes.hobbyconsolas.com/files/image_1920_1080/uploads/imagenes/2023/04/25/6901733a3c67f.png' },
    { id: 'squirtle', name: 'Squirtle', imageUrl: 'https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/007.png' },
    { id: 'bulbasaur', name: 'Bulbasaur', imageUrl: 'https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/001.png' },
    { id: 'charmander', name: 'Charmander', imageUrl: 'https://pokemon-go.name/wp-content/uploads/2024/03/004-pokemon-charmander.webp' },
    { id: 'jigglypuff', name: 'Jigglypuff', imageUrl: 'https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/039.png' },
  ],
};

export function useTrainerProfile() {
  const [activeTab, setActiveTab] = useState<'grid' | 'profile'>('grid');
  return useMemo(() => ({ trainer, activeTab, setActiveTab }), [activeTab]);
}

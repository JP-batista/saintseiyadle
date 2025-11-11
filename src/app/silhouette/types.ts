// src/app/silhouette/types.ts

export type Armor = {
  name: string;
  category: string;
  description: string;
  knight: string;
  saga: string;
  silhouetteImg: string; 
  revealedImg: string; 
};

export type SelectedArmor = Armor;

export type Attempt = {
  name: string; 
};
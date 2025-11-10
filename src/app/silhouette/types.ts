// src/app/silhouette/types.ts

/**
 * Define a estrutura de uma Armadura individual, 
 * conforme os dados em /data/armors/armorsDLE_pt.ts
 */
export type Armor = {
  name: string;
  category: string;
  description: string;
  knight: string;
  saga: string;
  silhouetteImg: string; // Caminho para a imagem da silhueta (com zoom)
  revealedImg: string;  // Caminho para a imagem revelada (para o ResultCard)
};

/**
 * A Armadura selecionada para o desafio do dia.
 * Neste modo, é o próprio objeto Armor.
 */
export type SelectedArmor = Armor;

/**
 * Uma tentativa no Modo Silhueta é o nome da armadura 
 * que o usuário palpitou.
 */
export type Attempt = {
  name: string; // O palpite (string)
};
export class Pokemon {
  constructor(
    public name: string,
    public url: string,
    public id: number,
    public imageUrl: string,
    public types: string[] = [],
    public abilities: string[] = [],
    public stats: { name: string; value: number }[] = [],
    public images: string[] = [], // já existente
    public description?: string,  // nova descrição (flavor text)
    public habitat?: string,      // habitat do Pokémon
    public generation?: string    // geração do Pokémon
  ) {}
}

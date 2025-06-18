export class Pokemon {
  constructor(
    public name: string,
    public url: string,
    public id: number,
    public imageUrl: string,
    public types: string[] = [],
    public abilities: string[] = [],
    public stats: { name: string; value: number }[] = [],
    public images: string[] = [],
    public description?: string,
    public habitat?: string,
    public generation?: string
  ) {}
}

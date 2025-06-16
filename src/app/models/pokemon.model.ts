export class Pokemon {
  constructor(public name: string, public url: string) {}

  getId(): string {
    const parts = this.url.split("/").filter(Boolean);
    return parts[parts.length - 1];
  }
}

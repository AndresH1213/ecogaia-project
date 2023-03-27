export class Combo {
  constructor(
    public _id: string,
    public name: string,
    public price: number,
    public image: string,
    public products: { _id: string; name: string }[],
    public code?: string
  ) {}

  get oneImage() {
    return this.image;
  }
}

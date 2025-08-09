export class Product {
  public id: number;
  public nome: string;
  public preco: number;

  constructor(id: number, nome: string, preco: number) {
    this.id = id;
    this.nome = nome;
    this.preco = preco;
  }
}

export let produtos: Product[] = [];

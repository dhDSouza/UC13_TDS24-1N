export class User {
  public id: number;
  public nome: string;
  public email: string;

  constructor(id: number, nome: string, email: string) {
    this.id = id;
    this.nome = nome;
    this.email = email;
  }
}

export let usuarios: User[] = []; // Simulando o banco de dados com uma lista

export class Piece {
  name: string;
  id: string;
  value: number;
  children: Piece[];
  link?: string[];

  constructor(name: string,id: string, value: number, link?: string[] ) {
    this.name = name;
    this.id = id;
    this.value = value;
    this.children = [];
    this.link = link;
  }

}

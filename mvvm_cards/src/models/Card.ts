import { ICard } from "./i_card";

let id = 0

export default class Card implements ICard {
 
  id: number;
  name: string = "";
  description: string = "";
  drawing: null = null;

  constructor() {
     // in the real app backend should set it
    this.id = id++;
  }
}
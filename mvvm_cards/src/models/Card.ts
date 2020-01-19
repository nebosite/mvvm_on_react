import { ICard } from "./i_card";

export default class Card implements ICard {
  name: string = "";
  description: string = "";
  drawing: null = null;
}
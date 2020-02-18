import { ICard } from "./i_card";

// -------------------------------------------------------------------
// This is everything that the UI is allowed to "know" about the 
// application model.  The UI can bind to the properties to learn 
// when the underlying data has changed.   It can call the functions
// or even set properties when certain UI actions should do so.  
// -------------------------------------------------------------------
export interface IAppModel {
    docTitle: string;

    newCards: ICard[];
    activeCards: ICard[];
    doneCards: ICard[];
    createNewCard(card: ICard): void;

    moveCardToNew(card: ICard, positionIndex?: number): void;
    moveCardToActive(card: ICard, positionIndex?: number): void;
    moveCardToDone(card: ICard, positionIndex?: number): void;
    
    removeCardFromNew(card: ICard): void;
    removeCardFromActive(card: ICard): void;
    removeCardFromDone(card: ICard): void;
};

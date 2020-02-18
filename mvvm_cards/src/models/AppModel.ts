import { observable, action } from "mobx";
import { IAppModel } from "./i_appmodel";
import { ICard } from "./i_card";


// -------------------------------------------------------------------
// This is the implementation of IAppModel.  All of the business logic
// should go here, or be reachable from here in containers or children.
// The app model should never "know" about the UI.  It's job is to think
// abstractly about the business part of the application.
//
// MOBX - this is how we modify the class to generate events when the 
// data changes.  
//
//      @observable - add to fields that we want to observe.  
//      @action     - add to functions that change observable values
//      
//                  Note: The getters and setters that reference 
//                        observable fields are automatically marked 
//                        as @observable or @action
// -------------------------------------------------------------------
export class AppModel implements IAppModel {
    @observable
    docTitle = "Main Document Title"

    @observable
    _newCards: ICard[] = [
         {
            id: 0,
            name: "Test Initial Card 0",
            description: "Test Initial Card Description 0",
            drawing: null
        },
        {
            id: 1,
            name: "Test Initial Card 1",
            description: "Test Initial Card Description 1",
            drawing: null
        } 
        ,
        {
            id: 2,
            name: "FFFFFF",
            description: "ZZZZZZ",
            drawing: null
        } 
    ]
    get newCards() { return this._newCards; }
    set newCards(cards: ICard[]) { this._newCards = cards; }

    @action
    moveCardToNew = (card: ICard, positionIndex: number = 0) => {
        // TODO: check is instance Card
        this.addCardByType(card, "_newCards", positionIndex);
    }

    // TODO: reduce boilerplate
    @action
    removeCardFromNew = (card: ICard) => {
        // TODO: check is instance Card
        this.removeCardByType(card, "_newCards");
    }

    @observable
    _activeCards: ICard[] = []
    get activeCards() { return this._activeCards; }
    set activeCards(cards: ICard[]) { this._activeCards = cards; }

    @action
    moveCardToActive = (card: ICard, positionIndex: number = 0) => {
        // TODO: check is instance Card
        this.addCardByType(card, "_activeCards", positionIndex);
    }

    @action
    removeCardFromActive = (card: ICard) => {
        // TODO: check is instance Card
        this.removeCardByType(card, "_activeCards");
    }

    @observable
    _doneCards: ICard[] = []
    // TODO: do we need setters if we are using pushing strategy?
    get doneCards() { return this._doneCards; }
    set doneCards(cards: ICard[]) { this._doneCards = cards; }

    @action
    moveCardToDone = (card: ICard, positionIndex: number = 0) => {
        // TODO: check is instance Card
        this.addCardByType(card, "_doneCards", positionIndex);
    }

    @action
    removeCardFromDone = (card: ICard) => {
        // TODO: check is instance Card
        this.removeCardByType(card, "_doneCards");
    }
    

     // in the current Mobx version we might not to write the action. Result will be the same
    // we need to use bound if we are using action to save the context.
    // Or we can use lambda (arrow) function if we aren't using mobx action
    @action.bound
    createNewCard(card: ICard) { 
        this._newCards.unshift(card);
     }

     private addCardByType(card: ICard, type: "_newCards" | "_activeCards" | "_doneCards", positionIndex: number) {
        this[type].splice(positionIndex, 0, card);
     }

     private removeCardByType(card: ICard, type: "_newCards" | "_activeCards" | "_doneCards") {
        const cardIndex = this[type].indexOf(card);
        this[type].splice(cardIndex, 1);
     }

}

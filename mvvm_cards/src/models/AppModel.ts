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
    _cards: ICard[] = []
    get cards() { return this._cards; }
    set cards(cards: ICard[]) { this._cards = cards; }

     // in the current Mobx version we might not to write the action. Result will be the same
     // we need to use bound if we are using action to save the context. 
     // Or we can use lambda (arrow) function if we waren't using mobx action
    @action.bound
    addCard(card: ICard) { 
        this._cards.unshift(card);
     }

}

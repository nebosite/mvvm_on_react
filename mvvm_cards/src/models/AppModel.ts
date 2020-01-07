import { observable, action } from "mobx";
import { IAppModel } from "./i_appmodel";


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
    data = "Some test data of the AppModel"

    @action
    changeData = () => {
        this.data = "Modified test data of the AppModel"
    }
}

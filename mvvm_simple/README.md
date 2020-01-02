# mvvm_simple
This app shows a simple MVVM approach using React/Typescript/Mobx 

MVVM features:

* All UI changes here are prompted by events from the app model.  
  * Even the mouse events have to go through the app model to update the UI
* The UI layer is now allowed to "know" about the app logic except for what is provided by the IAppModel interface.   In principle, this allows us to test the UI fully with no back end.
* Good code "smells"
  * UI layer and backend data layers have virtual no logic and therefor require little testing except for integration tests to ensure they are hooked up.
  * App logic is full unit tested with fast-running tests that do not require complicated setup of UI or back end.


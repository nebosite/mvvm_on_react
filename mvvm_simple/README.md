# mvvm_simple
This app shows a simple MVVM approach using React/Typescript/Mobx.  It is especially aimed at XAML (WPF/UWP) developers who will be used to certain kinds of patterns in application development.  If you are used to writing databound MVVM style applications in WPF, this example should feel familiar to you.

Note that this example deliberately excludes common conventions typically found in nodejs applications.  In particular:

* CSS formatting 
* Specific directory structures with corresponding index files to simplify imports

The point of the exclusion is to minimize elements that do not contribute to the MVVM pattern.  This makes it easier to read the code and gives you, the reader, a simple bare-bones starting point that you can decorate as you please.  

## MVVM features:

MVVM provides significant benefits for application development that I have tried to illustrate with this demo.   The following features are visible in the demo and come directly from the application of the MVVM pattern:

* All UI changes here are prompted by data change events from the app model.  
  * Even the mouse events, which might otherwise get routed directly to the UI, have to go through the app model to update the UI
* Clean isolation of UI and Business logic.  The UI layer is not allowed to "know" about the business logic except for what is provided by the IAppModel interface.   In principle, this allows us to test the UI fully with no back end.
* Clean back end isolation.  The back end data storage layer is also isolated through an interface.
* Conceptual simplicity.  Business logic elements are contained together in the same AppModel class.   This simplifies code organization, often providing needed elements in the same code file with ony simple coding required to access them.   *(In a more complicated example, we would see additional models as children or simply contained by the AppModel class.  Again this is a logic and conceptually simple way to think about needed data.)* 
* Excellent Testing
  * Simple Integration testing. UI layer and backend data layers have virtual no logic and therefor require little testing except for integration tests to ensure they are hooked up.
  * Simple logic testing. All of the interesting logic of the application is contained in a easily testable class.  
  * Fast tests.  Unit tests are fast-running and do not require complicated setup of UI or back end.

## Compiling and running the app

1. ```npm install```
2. ```npm start```
3. In the browser window that comes up, notice:
   1.  The UI responds to various form of input from the mouse and keyboard
   2. The same data is displayed on multiple pages using the same source
4. To run tests: ```npm test```




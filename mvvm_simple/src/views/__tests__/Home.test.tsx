import * as React from "react"
import { mount } from "enzyme"
import { Provider } from "mobx-react";
import { AppModel } from "models/AppModel";
import { IDataModel } from "models/i_dataModel"
import Home from "../HomePage";

// -------------------------------------------------------------------
// An example of an integration test that takes advantage of the 
// interfaces used to isolate the components.   The main advantage
// of this test is to ensure that the interfaces are "wired up" properly.
// An integration test should NOT be used to exercise logic; that would
// be considered a "bad smell" in the code.  All logic should be tested
// directly in unit tests.  If that is not possible, the most likely 
// reason is that the architecture of the app is wrong and could
// benefit from a rewrite to make the unit tests possible.
// -------------------------------------------------------------------


// Mocking the back end
type StorageMock = IDataModel & { storage: { AppData: string } }
const storageMock: StorageMock = {
	storage: { AppData: "" },
	save(jsonData: string) {
		this.storage["AppData"] = jsonData;
	},    

	load() {
			return this.storage["AppData"];
	}
}

// In this test we hook up mock versions of of the UI and
// backend to confirm that they are fully connected through 
// the appModel.  
describe("Home and AppModel binding", () => {
	it(`should confirm that after adding & selecting some flavor the Home comp 
	shoud continue to keep the AppModel data even after the component re-opening`, () => {
		// could be done at the tearUp stage
		const appModel = new AppModel(storageMock);
		const wrapper = mount(<Provider appModel={appModel}><Home /></Provider>)
		
		const selectedFlavorBoxWrapper = wrapper.find(".selected-flavor-box");
		const flavorInputWrapper = wrapper.find(".flavor-input");
		const flavorAddBtnWrapper = wrapper.find(".flavor-add-btn");

		// at the start the selected flavor contains the selected flavor of the AppModel
		expect(selectedFlavorBoxWrapper.text()).toBe(appModel.selectedFlavor);

		// simulate the user typing action in the flavor text input
		const event = {target: {value: "foo"}};
		flavorInputWrapper.simulate("change", event);

		// simulate the user flavor add action
		flavorAddBtnWrapper.simulate("click");
		
		// verify that the view updates accordingly 
		expect(appModel.selectedFlavor).toBe("foo")
		expect(selectedFlavorBoxWrapper.text()).toBe("foo");

		// simulate component unmount lifecycle (happens when the component destroyed). Eg. close page
		wrapper.unmount();

		// re-mount component.
		wrapper.mount();
		
		// check the app model saved state
		expect(appModel.selectedFlavor).toBe("foo")
		
		// check the MVVM binding 
		expect(selectedFlavorBoxWrapper.text()).toBe("foo");
		
		// check if our storage saved our data and keep it even after component destroying
		// if we return the JSON we could describe a correct type and avoid repeated convertation
		expect(JSON.parse(storageMock.load()).selected).toBe("foo");
	});
	
});
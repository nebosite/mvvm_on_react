import { AppModel } from "../AppModel";
import { IDataModel } from "models/i_dataModel";

class MockData implements IDataModel {
	LastWrittenData: string | null = null;

	save(jsonData: string) {
		this.LastWrittenData = jsonData;
	}
	
	load(){
		return this.LastWrittenData;
	}
}

describe("AppModel.constructor", () => {
	const mockData = new MockData();
	mockData.LastWrittenData = '{"flavors": ["A", "B"]}';
	const appModel = new AppModel(mockData);
	it(`should load data`, () => {
		expect(appModel.flavors.toString()).toEqual("A,B");
   	})

   	it(`should select first by default`, () => {
		expect(appModel.selectedFlavor).toEqual("A");
	})	

	const mockData2 = new MockData();
	mockData2.LastWrittenData = '{"flavors": ["R", "S"],"selected":"S"}';
	const appModel2 = new AppModel(mockData2);
	it(`should select other if specified`, () => {
		expect(appModel2.selectedFlavor).toEqual("S");
	})	

});

describe("AppModel.setLowerCase", () => {
	const appModel = new AppModel(new MockData());
	it(`should make the flavorInput text lowercased`, () => {
		appModel.flavorInput = "TEXT";
		appModel.setLowercase();
		expect(appModel.flavorInput).toBe("text");
   })
});

describe("AppModel.setUpperCase", () => {
	const appModel = new AppModel(new MockData());
	it(`should make the flavorInput text upperCased`, () => {
		appModel.flavorInput = "text";
		appModel.setUppercase();
		expect(appModel.flavorInput).toBe("TEXT");
   })
});

describe("AppModel.chooseStrawberry", () => {
	const appModel = new AppModel(new MockData());
	it(`should change the selectedFlavor to "Strawberry"`, () => {
		appModel.selectedFlavor = "Dummy Text";
		expect(appModel.selectedFlavor).toBe("Dummy Text");
		appModel.chooseStrawberry();
		expect(appModel.selectedFlavor).toBe('Strawberry');
   })
});

describe("AppModel.addFlavor", () => {
	const mockData = new MockData();
	mockData.LastWrittenData = '{"flavors": ["1"]}';
	const appModel = new AppModel(mockData);
	appModel.flavorInput = "grape";
	appModel.addFlavor();
	it(`should add flavorInput to flavor list`, () => {
		expect(appModel.flavors.toString()).toBe("1,grape");
   	});

	it(`should clear flavorInput`, () => {
		expect(appModel.flavorInput).toBe("");
   	});

	it(`should set selectedFlavor to flavorInput`, () => {
		expect(appModel.selectedFlavor).toBe("grape");
   	});

	it(`should should save state`, () => {
		expect(mockData.LastWrittenData).toBe('{"flavors":["1","grape"],"selected":"grape"}');
	});
});

describe("AppModel.setSelectedFlavor", () => {
	const mockData = new MockData();
	mockData.LastWrittenData = '{"flavors": ["1", "2"]}';
	const appModel = new AppModel(mockData);
	appModel.selectedFlavor = "2";

	it(`should should save state`, () => {
		expect(mockData.LastWrittenData).toBe('{"flavors":["1","2"],"selected":"2"}');
	});
});


// would be nice to test UI as well. Without enzume or ReactTestUtils it's impossible
describe("AppModel.flavorTextIsValid", () => {
	const appModel = new AppModel(new MockData());
	it(`should return true if the flawor text not an empty string`, () => {
		appModel.flavorInput = "Dummy Test";
		expect(appModel.flavorTextIsValid).toEqual(true);
	 })
	 
	 it(`should return false if the flawor text is an empty string`, () => {
		appModel.flavorInput = "";
		expect(appModel.flavorTextIsValid).toEqual(false);
   })
});

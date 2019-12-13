import { AppModel, flaworsData } from "../appmodel";

describe("AppModel.setLowerCase", () => {
	const appModel = new AppModel();
	it(`should make the flavorInput text lowercased`, () => {
		appModel.flavorInput = "TEXT";
		appModel.setLowercase();
		expect(appModel.flavorInput).toBe("text");
   })
});

describe("AppModel.setUpperCase", () => {
	const appModel = new AppModel();
	it(`should make the flavorInput text upperCased`, () => {
		appModel.flavorInput = "text";
		appModel.setUppercase();
		expect(appModel.flavorInput).toBe("TEXT");
   })
});

describe("AppModel.chooseStrawberry", () => {
	const appModel = new AppModel();
	it(`should change the selectedFlavor to the "Strawberry"`, () => {
		appModel.selectedFlavor = "Dummy Text";
		expect(appModel.selectedFlavor).toBe("Dummy Text");
		appModel.chooseStrawberry();
		expect(appModel.selectedFlavor).toBe(flaworsData.strawberry);
   })
});

describe("AppModel.addFlavor", () => {
	const appModel = new AppModel();
	appModel.flavors.clear();
	appModel.flavorInput = "grape";
	appModel.addFlavor();
	it(`should add flavorInput to flavor list`, () => {
		expect(appModel.flavors.length).toBe(1);
		expect(appModel.flavors[0]).toBe("grape");
   	});

	it(`should clear flavorInput`, () => {
		expect(appModel.flavorInput).toBe("");
   	});

	it(`should set selectedFlavor to flavorInput`, () => {
		expect(appModel.selectedFlavor).toBe("grape");
   	});
});

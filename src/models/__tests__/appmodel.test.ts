import { AppModel } from "../appmodel";

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

describe("AppModel.addFlavor", () => {
	const appModel = new AppModel();
	appModel.flavors.clear();
	it(`should add flavorInput flavor list and clear flavorInput`, () => {
		appModel.flavorInput = "grape";
		appModel.addFlavor();
		expect(appModel.flavors.length).toBe(1);
		expect(appModel.flavors[0]).toBe("grape");
		expect(appModel.flavorInput).toBe("");
   })
});

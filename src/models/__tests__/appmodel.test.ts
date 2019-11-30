import { AppModel } from "../appmodel";

const appModel = new AppModel();

describe("text transformation suite", () => {

	it(`should make the transformation text lowercased
		 when setLowercase method called`, () => {
			 const initialText = appModel.transformationText;
			 const expectedResult = initialText.toLowerCase();

			 appModel.setLowercase();
			 expect(appModel.transformationText).toBe(expectedResult);
		})

	it(`should make the transformation text uppercased
		 when setUppercase method called`, () => {
			 const initialText = appModel.transformationText;
			 const expectedResult = initialText.toUpperCase();

			 appModel.setUppercase();
			 expect(appModel.transformationText).toBe(expectedResult);
		})

});
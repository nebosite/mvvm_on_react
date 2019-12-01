import { AppModel } from "../appmodel";

const appModel = new AppModel();

describe("text transformation suite", () => {

	it(`should make the textInput text lowercased
		 when setLowercase method called`, () => {
			 const initialText = "TEXT";
			 const expectedResultText = "text";
			 appModel.textInput = initialText;
			 expect(appModel.textInput).toBe(initialText);

			 appModel.setLowercase();

			 expect(appModel.textInput).toBe(expectedResultText);
		})

	it(`should make the transformation text uppercased
		 when setUppercase method called`, () => {
			const initialText = "text";
			const expectedResultText = "TEXT";
			appModel.textInput = initialText;
			expect(appModel.textInput).toBe(initialText);

			appModel.setUppercase();

			expect(appModel.textInput).toBe(expectedResultText);
		})

});
import { AppModel } from "../AppModel";

// -------------------------------------------------------------------
// Note about test names:  
// 
// I use the following convention: 
//
//		describe("functionName"){ it('should do x [when y]'...)}
//
// This has the advantage of producing readable output like this:
// 		AppModel.constructor
// 			√ should contain a test data (4ms)
// -------------------------------------------------------------------



describe("AppModel data", () => {

  const appModel = new AppModel()

  it(`should contain a test data`, () => {
    expect(appModel.docTitle).toEqual("Main Document Title");
  })


});

import * as React from "react";

import { observer, inject } from "mobx-react";
import { IAppModel } from "models/i_appmodel";
// import _throttle from "lodash/throttle";

// import { TextInpRealLn, Combobox, MousePositionView } from "shared";
// import { StoresEnum } from "stores";

// type Props = {
//   comboboxStore?: I_ComboboxStore;
//   mousePositionStore?: I_MousePositionStore;
// };
type HomeProperties = {
  appModel: IAppModel
};

// @inject(StoresEnum.comboboxStore, StoresEnum.mousePositionStore)
@observer
export default class Home extends React.Component<HomeProperties> {
  /*
   * it's specially for you to demostrate how the component trigger Model
   * the Model makes other View re-render and show the updated data. MVVM
   */
  //throttledEvtHandler: (e: MouseEvent) => void;

  constructor(props: HomeProperties) {
    super(props);
    //this.throttledEvtHandler = _throttle(this.mouseEvtHandler, 17);
  }

  // componentDidMount() {
  //   window.addEventListener("mousemove", this.throttledEvtHandler);
  // }

  // componentWillUnmount() {
  //   // avoid memory leak
  //   window.removeEventListener("mousemove", this.throttledEvtHandler);
  // }

  // mouseEvtHandler = (e: MouseEvent) => {
  //   this.props.mousePositionStore.setPosition({ x: e.clientX, y: e.clientY });
  // };

  render() {
    //const { comboboxStore } = this.props;

    //const { query, items, selectedItem } = comboboxStore;
    // MousePositionView

    return (
        <div className="home">
          <h2>Home Page</h2>
          <h3>Mouse Position: 
            {this.props.appModel.mousePosition.x}, 
            {this.props.appModel.mousePosition.y}</h3>
        </div>
    );
    // return (
    //   <div className="home">
    //     <h2 className="page-title">Home</h2>
    //     <div className="container">
    //       <div className="row">
    //         <MousePositionView />
    //         <div className="col-6">
    //           <div className="st-container">
    //             <h5>Text Input length life-track</h5>
    //             <TextInpRealLn />
    //           </div>
    //         </div>
    //         <div className="col-12">
    //           <div className="alert alert-primary">
    //             <span>Combobox saved query: </span>
    //             <b className="attention-msg">{query}</b>
    //           </div>
    //         </div>
    //       </div>
    //       <div className="row">
    //         <div className="col-12">
    //           <div className="alert alert-primary">
    //             <span>Selected Combobox Item:</span>
    //             {selectedItem && (
    //               <b className="attention-msg">{selectedItem.label}</b>
    //             )}
    //           </div>
    //         </div>
    //       </div>
    //       <div className="row">
    //         <div className="col-6">
    //           <div className="st-container">
    //             <h5>Combobox Items</h5>
    //             <ul className="list-group">
    //               {items.map((item: ComboboxItem) => (
    //                 <li className="list-group-item" key={item.label}>
    //                   {item.label}
    //                 </li>
    //               ))}
    //             </ul>
    //           </div>
    //         </div>
    //         <div className="col-6">
    //           <div className="st-container">
    //             <h5>Combobox</h5>
    //             <Combobox
    //               options={items}
    //               selectedItem={selectedItem}
    //               // the query should live only when combobox is open
    //               onHide={comboboxStore.resetQuery}
    //               onSelectValue={item => {
    //                 comboboxStore.setSelectedItem(item);
    //               }}
    //               onInputChange={(val: string) => {
    //                 comboboxStore.setQuery(val);
    //               }}
    //               onInputEnter={() => {
    //                 /* as the ReactCreatable doesn't pass
    //                  * an input value on set-value we can use our store-query
    //                  */
    //                 if (query.length) {
    //                   comboboxStore.addNewItem(query);
    //                 }
    //               }}
    //             />
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // );
  }
}

import * as React from "react"

export default function MainDocumentPageToolbar() {
  return (
    <div className="main-document-page-toolbar">
      <button onClick={() => alert("The Add functionality is coming soon")}>Add</button>
      <button onClick={() => alert("The Save functionality is coming soon")}>Save</button>
      <button onClick={() => alert("The Load functionality is coming soon")}>Load</button>
      <button onClick={() => alert("The New functionality is coming soon")}>New</button>
    </div>
  )
}
import React from "react";
import DataTableWithPagination from "./components/DataTableWithPagination.tsx";

const App: React.FC = () => {
  return (
    <div className="App">
      <h1>PrimeReact DataTable with Server Pagination</h1>
      <DataTableWithPagination />
    </div>
  );
};

export default App;

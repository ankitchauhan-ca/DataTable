import React, { useEffect, useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Paginator } from "primereact/paginator";
import { Button } from "primereact/button";
import { OverlayPanel } from "primereact/overlaypanel";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import axios from "axios";

interface DataItem {
  id: number;
  name: string;
  email: string;
}

const DataTableWithPagination: React.FC = () => {
  const [data, setData] = useState<DataItem[]>([]);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [first, setFirst] = useState<number>(0);
  const [rows, setRows] = useState<number>(10);
  const [page, setPage] = useState<number>(1); // For tracking the current page
  const [totalPages, setTotalPages] = useState<number>(0);
  const [selectedRows, setSelectedRows] = useState<DataItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredData, setFilteredData] = useState<DataItem[]>([]);

  const toast = useRef<Toast>(null);
  const op = useRef<OverlayPanel>(null);

  useEffect(() => {
    axios
      .get(`https://api-data-nlq6.onrender.com/api/data/page/${page}`)
      .then((response) => {
        setData(response.data.items);
        setTotalRecords(response.data.total);
        setTotalPages(response.data.totalPages);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [page]);

  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    setFilteredData(
      data.filter(
        (item) =>
          item.name.toLowerCase().includes(lowercasedQuery) ||
          item.email.toLowerCase().includes(lowercasedQuery)
      )
    );
  }, [searchQuery, data]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const onPageChange = (event: any) => {
    setFirst(event.first);
    setRows(event.rows);
    setPage(event.page + 1);
  };

  const onSelectionChange = (e: any) => {
    const selectedItems = e.value;
    setSelectedRows(selectedItems);
  };

  const header = (
    <div className="table-header">
      <div className="header-content ">
        <Button
          type="button"
          icon="pi pi-check"
          className="custom-button"
          onClick={(e) => op.current?.toggle(e)}
        />
        <OverlayPanel
          ref={op}
          closeOnEscape
          dismissable={false}
          className="custom-overlay card"
        >
          <InputText
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search by name or email"
            className="p-mb-2"
            required
          />
          <Button
            type="button"
            label="Select"
            className="p-mt-2 m mt-4 bg-primary items-center flex h-100"
            onClick={() => {
              const searchedData = filteredData.filter(
                (item) =>
                  item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  item.email.toLowerCase().includes(searchQuery.toLowerCase())
              );
              setSelectedRows(searchedData);
              op.current?.hide();
            }}
          />
        </OverlayPanel>
      </div>
      <Toast ref={toast} />
    </div>
  );

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  return (
    <div>
      <DataTable
        value={filteredData}
        selection={selectedRows}
        onSelectionChange={onSelectionChange}
        dataKey="id"
        header={header}
        paginator={false}
        className="responsive-datatable"
        selectionMode="multiple"
      >
        <Column
          selectionMode="multiple"
          headerStyle={{ width: "3em" }}
        ></Column>
        <Column field="id" header="ID"></Column>
        <Column field="name" header="Name"></Column>
        <Column field="email" header="Email"></Column>
      </DataTable>

      <Paginator
        first={first}
        rows={rows}
        totalRecords={totalRecords}
        onPageChange={onPageChange}
      />
      <div className="pagination-controls">
        <button onClick={handlePreviousPage} disabled={page === 1}>
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button onClick={handleNextPage} disabled={page === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default DataTableWithPagination;

import { useState } from 'react'
import Table from '@/shared/components/Table'
import { useGlobalState } from '../../../../shared/context/GlobalState';
import useTableContent from './hook/useTableContent';

export const TableContent = () => {
  const {
    activeTab,currentPage,dataTable,
    selectView,setActiveTab,setCurrentPage,
    columns
  }= useTableContent()

  const {layersTableDown, setLayersTableDown } = useGlobalState();


  const handleCloseTab = (key) => {
    setLayersTableDown((prev) => {
      const newTabs = { ...prev };
      delete newTabs[key];
      return newTabs;
    });
  };

  if (!dataTable) return <></>;
  
  return (
   
    <Table
        tabs={layersTableDown}
        activeTabKey={activeTab}
        onTabChange={setActiveTab}
        onCloseTab={handleCloseTab}
        data={dataTable}
        columns={columns}
        currentPage={currentPage}
        itemsPerPage={50}
        onPageChange={setCurrentPage}
        sortable={true}
        filterable={false}
        resizable={false}
        stickyHeader={true}
        selectable={false}
        exportable={true}
      />
  )
}

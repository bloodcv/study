import React from "react";
import { Table } from "antd";
import SearchPanel from './SearchPanel';

// 无状态组件，用函数实现更加简洁
export default function PageCommon({ query, dataSource, onChange, columns }) {
  console.log('cl:', { query, dataSource, onChange, columns })
  return (
    <>
      <SearchPanel value={query} onChange={onChange} />
      <Table columns={columns} dataSource={dataSource} />
    </>
  );
}

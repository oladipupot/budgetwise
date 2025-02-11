import { Table, Select, Radio } from 'antd';
import dayjs from 'dayjs';
import React, { useState } from 'react'
import searchImg from "../../assets/search.svg"




function TransactionsTable({ transactions }) {
    const { Option } = Select;
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [ sortKey, setSortKey] = useState("");
    const columns = [
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: 'Amount',
          dataIndex: 'amount',
          key: 'amount',
        },
        {
          title: 'Tag',
          dataIndex: 'tag',
          key: 'tag',
        },
        {
          title: 'Type',
          dataIndex: 'type',
          key: 'type',
        },
        {
          title: 'Date',
          dataIndex: 'date',
          key: 'date',
          render: (date) => date ? dayjs(date).format('YYYY-MM-DD') : "Invalid Date",
        },
      ];


      let filteredTransactions = transactions.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase()) &&
        (typeFilter === "" || item.type.includes(typeFilter))
      );


    let sortedTransactions = filteredTransactions.sort((a, b) => {
        if (sortKey === "date") {
          return new Date(a.date) - new Date(b.date);
        } else if (sortKey === "amount") {
          return a.amount - b.amount;
        } else {
          return 0;
        }
      });
    
  return (
    <>
     <div className="input-flex">
          <img src={searchImg} width="16" />
          <input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder='search by name'/>
        </div>
        
        <Select
          className="select-input"
          onChange={(value) => setTypeFilter(value)}
          value={typeFilter}
          placeholder="Filter"
          allowClear
        >
          <Option value="">All</Option>
          <Option value="income">Income</Option>
          <Option value="expense">Expense</Option>
        </Select>

        <Radio.Group
            className="input-radio"
            onChange={(e) => setSortKey(e.target.value)}
            value={sortKey}
          >
            <Radio.Button value="">No Sort</Radio.Button>
            <Radio.Button value="date">Sort by Date</Radio.Button>
            <Radio.Button value="amount">Sort by Amount</Radio.Button>
          </Radio.Group>
        <Table dataSource={filteredTransactions} columns={columns} />;
    </>
  );
}

export default TransactionsTable
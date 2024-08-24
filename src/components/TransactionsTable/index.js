import React, { useState } from 'react';
import { Select, Table, Radio } from "antd";
import searchImg from "../../assets/search.svg";
import "./styles.css";

const { Option } = Select; // Correct way to get Option from Select

function TransactionsTable({ transactions }) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [sortKey, setSortKey] = useState("");

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
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Tag',
      dataIndex: 'tag',
      key: 'tag',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
  ];

  // Filters and sorts the transactions based on the search, filter, and sort criteria
  let filteredTransactions = transactions.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()) &&
    item.type.includes(typeFilter)
  );

  //Date Sorting: Converts the date strings into Date objects and sorts transactions in ascending order by date.
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
     
    <div className='wrapper'>
        <div className='top-row'>
            <div className='input-flex'>
                <img src={searchImg} width="16" />
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name"
                />
            </div>
            {/* Render a dropdown */}
            <Select
                className="select-input"
                onChange={(value) => setTypeFilter(value)}
                value={typeFilter}
                placeholder="Filter by type"
                allowClear
            >
                <Option value="">All</Option>
                <Option value="income">Income</Option>
                <Option value="expense">Expense</Option>
            </Select>
        </div>
        <div className='my-table'>
            <div className='my-table-headings'>
                <h2>My Transactions</h2>
                <Radio.Group
                className="input-radio"
                onChange={(e) => setSortKey(e.target.value)}
                value={sortKey}
                >
                    <Radio.Button value="">No Sort</Radio.Button>
                    <Radio.Button value="date">Sort by Date</Radio.Button>
                    <Radio.Button value="amount">Sort by Amount</Radio.Button>
                </Radio.Group>
                <div className='my-table-csv'>
                    <button className="btn">Export to CSV</button>
                    <label for='file-csv' className='btn btn-blue' >
                    Import from CSV
                    </label>
                    <input
                        id='file-csv'
                        type='file'
                        accept='.csv'
                        required 
                    />

                    
                </div>
            </div>
            <Table dataSource={sortedTransactions} columns={columns} />
        </div>
    </div>

   
  );


}

export default TransactionsTable;
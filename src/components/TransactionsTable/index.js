import React, { useState } from 'react';
import { Select, Table, Radio } from "antd";
import searchImg from "../../assets/search.svg";
import "./styles.css";
import Papa from "papaparse";
import { toast} from 'react-toastify';


const { Option } = Select; // Correct way to get Option from Select

function TransactionsTable({ transactions, addTransaction, fetchTransactions }) {
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

  function exportCSV(){
    var csv = Papa.unparse({
        fields: ["name", "type", "tag", "date", "amount"],
        data: transactions,
    });

    const blob =new Blob([csv], {type: "text/csv; charset=utf-8;"});
    const url = window.URL.createObjectURL(blob);  // Use the blob to create a URL
    const link = document.createElement("a");  // Create an anchor tag
    link.href = url;     // Set the href to the URL created from the blob
    link.download = "transactions.csv";   // Set the download attribute with the desired filename
    document.body.appendChild(link);   // Append the link to the document
    link.click();   // Trigger a click on the link to start the download
    document.body.removeChild(link);  // Remove the link from the document

  }
    
  function importFromCsv(event) {
    event.preventDefault();   //this runs on the change of the file
    try {
      Papa.parse(event.target.files[0], {
        header: true,
        complete: async function (results) {
          // Now results.data is an array of objects representing your CSV rows
          for (const transaction of results.data) {
            // Write each transaction to Firebase, you can use the addTransaction function here
            console.log("Transactions", transaction);
            const newTransaction = {
              ...transaction,
              amount: parseFloat(transaction.amount),
            };
            await addTransaction(newTransaction, true);
          }
        },
      });
      toast.success("All Transactions Added");
      fetchTransactions();
      event.target.files = null;
    } catch (e) {
      toast.error(e.message);
    }
  }

  return (
     
    <div className='parent'>
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
                    <button className="btn" onClick={exportCSV} >Export to CSV</button>
                    <label for='file-csv' className='btn btn-blue' >
                    Import from CSV
                    </label>
                    <input
                        id='file-csv'
                        type='file'
                        accept='.csv'
                        onChange={importFromCsv}
                        required 
                        style={{display: "none"}}
                    />

                    
                </div>
            </div>
            <Table dataSource={sortedTransactions} columns={columns} />
        </div>
    </div>

   
  );


}

export default TransactionsTable;
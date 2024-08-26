import React from 'react';
import {Line, Pie} from "@ant-design/charts";
import "./styles.css"


function Chart({sortedTransactions}) {
  const data = sortedTransactions.map((item) => {
    return {date: item.date, amount:item.amount}
  }) ;

  const spendingData= sortedTransactions.filter((transaction) => {
    if(transaction.type == "expense"){
      return { tag:transaction.tag, amount:transaction.amount};
    }
  })

  let finalSpendings = [{tag:"food", amount:0},
    {tag:"office", amount:0},
    { tag:"education", amount:0 },
  ];

  spendingData.forEach(item => {
    if(item.tag=="food"){
      finalSpendings[0].amount += item.amount;
    } else if(item.tag=="office"){
      finalSpendings[1].amount += item.amount;
    } else {
      finalSpendings[2].amount += item.amount;
    } 
    
  });

  const config = {
    data: data, 
    
    xField : "date",
    yField: "amount"
  } ;
  const spendingConfig = {
    data: finalSpendings, 
    
    angleField: "amount",
    colorField: "tag",
  } ;

  return (
    <div className="charts-wrapper">
      <div className="chart-container">
        <h2 style={{marginTop: 0}} >Your Analytics</h2>
        <Line {...config} />
      </div>  
      <div className="chart-container">
        <h2 style={{marginTop: "3rem"}} >Your Spendings</h2>
        <Pie {...spendingConfig}
        />
      </div> 
    </div>
  )
}

export default Chart
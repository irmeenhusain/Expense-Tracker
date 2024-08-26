import React, { useEffect, useState } from 'react';
import Header from "../components/Header";
import Cards from '../components/Cards';
import AddExpense from '../components/Modals/addExpense';
import AddIncome from '../components/Modals/addIncome';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { addDoc, collection, getDocs, query } from 'firebase/firestore';
import { toast } from 'react-toastify';
import TransactionsTable from '../components/TransactionsTable';
import Chart from '../components/Charts';
import NoTransactions from '../components/NoTranscations';
import Loader from '../components/Loader';

function Dashboard() {

  const [loading, setLoading]= useState(false);
  const [user] = useAuthState(auth);
  const [transactions, setTransactions]= useState([]);
  const [isExpenseModalVisible, setIsExpenseModalVisible]= useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
  const [income,setIncome] = useState(0);
  const [expense, setExpense] =useState(0);
  const [totalBalance, setTotalBalance] = useState(0);

  const showExpenseModal = () => {
    setIsExpenseModalVisible(true);
  }

  const showIncomeModal = () => {
    setIsIncomeModalVisible(true);
  }

  const handleExpenseCancel = () => {
    setIsExpenseModalVisible(false);
  }

  const handleIncomeCancel = () => {
    setIsIncomeModalVisible(false);
  }

  const onFinish = (values, type) => {
    const newTransaction = {
      type: type,
      date: values.date.format("YYYY-MM-DD"),
      amount: parseFloat(values.amount),
      tag: values.tag,
      name: values.name, 
    };
   // setTransactions([...transactions, newTransaction]);
   // setIsExpenseModalVisible(false);
   // setIsIncomeModalVisible(false);
    addTransaction(newTransaction);
   // calculateBalance();
  };
  useEffect( () => {
    calculateBalance();
  }, [transactions]);

  const calculateBalance = () => {
    let incomeTotal = 0;
    let expensesTotal = 0;

    transactions.forEach((transaction) => {
      if(transaction.type === "income"){
        incomeTotal += transaction.amount;
      } else {
        expensesTotal += transaction.amount;
      }
    } );
    setIncome(incomeTotal);
    setExpense(expensesTotal);
    setTotalBalance(incomeTotal - expensesTotal);
  }

  async function addTransaction(transaction, many){
    try{
      const docRef = await addDoc(
        collection(db, `users/${user.uid}/transactions`), transaction);
        console.log("document written with ID:", docRef.id);

        if(!many) toast.success("Transaction Added!");

        let newArr = transactions;
        newArr.push(transaction);
        setTransactions(newArr);
        calculateBalance();
      
    }catch(e){
      if(!many) toast.error("Couldn't add transaction");
    }
  }

  useEffect( () => {
    //get all docs from a collection
    fetchTransactions();
  }, [user]);

  async function fetchTransactions(){
    setLoading(true);
    if(user){
     // const q = query(collection(db, `users${user.uid}/transactions`));
      const querySnapshot = await getDocs(collection(db, `users/${user.uid}/transactions`));
      let transactionsArray = [];
      querySnapshot.forEach( doc => {
        transactionsArray.push(doc.data());
      });

      setTransactions(transactionsArray);
      toast.success("Transactions Fetched")
    }
    setLoading(false);
  }

let sortedTransactions = transactions.sort((a,b) => {
  return new Date(a.date) - new Date(b.date);
})

  return (
    <div> 
      <Header />
      {loading ? <Loader/> :<> 
      <Cards 
        income={income}
        expense={expense}
        totalBalance={totalBalance}
        showExpenseModal={showExpenseModal} 
        showIncomeModal={showIncomeModal}
      />  
      {transactions.length!=0 ? <Chart sortedTransactions={sortedTransactions} /> : <NoTransactions />}
      <AddExpense 
        isExpenseModalVisible={isExpenseModalVisible}
        handleExpenseCancel={handleExpenseCancel}
        onFinish={onFinish}
      />
      <AddIncome 
        isIncomeModalVisible={isIncomeModalVisible}
        handleIncomeCancel={handleIncomeCancel}
        onFinish={onFinish}      
      />
      <TransactionsTable transactions={transactions} addTransaction={addTransaction} fetchTransactions={fetchTransactions} />
      </>}
    </div>
  )
}

export default Dashboard
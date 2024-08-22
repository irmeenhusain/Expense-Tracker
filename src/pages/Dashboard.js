import React, { useEffect, useState } from 'react';
import Header from "../components/Header";
import Cards from '../components/Cards';
import AddExpense from '../components/Modals/addExpense';
import AddIncome from '../components/Modals/addIncome';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { addDoc, collection, getDocs, query } from 'firebase/firestore';
import { toast } from 'react-toastify';
import moment from "moment";

function Dashboard() {

  const [loading, setLoading]= useState(false);
  const [user] = useAuthState(auth);
  const [transactions, setTransactions]= useState([]);
  const [isExpenseModalVisible, setIsExpenseModalVisible]= useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);

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
      date: moment(values.date).format("YYYY-MM-DD"),
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

  // const calculateBalance = () => {
  //   let incomeTotal = 0;
  //   let expensesTotal = 0;

  //   transactions.forEach((transaction) => {
  //     if(transaction.type === "income"){
  //       incomeTotal += transaction.amount;
  //     } else {
  //       expensesTotal += transaction.amount;
  //     }
  //   } );
  //   setIncome(incomeTotal);
  //   setExpenses(expenseTotal);
  // }

  async function addTransaction(transaction){
    try{
      const docRef = await addDoc(
        collection(db, `users/${user.uid}/transactions`), transaction);
        console.log("document written with ID:", docRef.id);

        toast.success("Transaction Added!");
      
    }catch(e){
      toast.error("Couldn't add transaction");
    }
  }

  useEffect( () => {
    //get all docs from a collection
    fetchTransactions();
  }, []);

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
  return (
    <div> 
      <Header />
      {loading ?<p>Loading..</p> :<> 
      <Cards 
        showExpenseModal={showExpenseModal} 
        showIncomeModal={showIncomeModal}
      />  
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
      </>}
    </div>
  )
}

export default Dashboard
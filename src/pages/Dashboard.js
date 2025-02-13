// import React, { useEffect, useState } from 'react'
// import Header from '../components/Header'
// import Cards from '../components/Cards'
// import AddExpenseModal from '../components/Modals/addExpense';
// import AddIncomeModal from '../components/Modals/addIncome';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { toast } from 'react-toastify';
// import { auth, db } from '../firebase';
// import { addDoc, collection, getDocs, query } from 'firebase/firestore';
// import moment from "moment";


// function Dashboard () {
//   // const sampleTransactions = [
//   // {
//   //   name: "Pay day",
//   //   type: "income",
//   //   date: "2023-01-15",
//   //   amount: 2000,
//   //   tag: "salary",
//   // },
//   // {
//   //   name: "Dinner",
//   //   type: "expense",
//   //   date: "2023-01-20",
//   //   amount: 500,
//   //   tag: "food",
//   // },
//   // {
//   //   name: "Books",
//   //   type: "expense",
//   //   date: "2023-01-25",
//   //   amount: 300,
//   //   tag: "education",
//   // },
//   // ];
//   const [transactions, setTransactions] = useState([]);
//   const [loading, setLoading] = useState(false)
//   const [user] = useAuthState(auth);
//   const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
//   const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
//   const [income, setIncome] = useState(0);
//   const [expense, setExpense] = useState(0);
//   const [totalBalance, setTotalBalance] = useState(0);
//   const showExpenseModal = () => {
//     setIsExpenseModalVisible(true);
//   };

//   const showIncomeModal = () => {
//     setIsIncomeModalVisible(true);
//   };

//   const handleExpenseCancel = () => {
//     setIsExpenseModalVisible(false);
//   };

//   const handleIncomeCancel = () => {
//     setIsIncomeModalVisible(false);
//   };

  
//   const onFinish = (values, type) => {
//     const newTransaction = {
//       type: type,
//       date: moment(values.date).format("YYYY-MM-DD"),
//       amount: parseFloat(values.amount),
//       tag: values.tag,
//       name: values.name,
//     };
//     addTransaction(newTransaction);
//   };


//   async function addTransaction(transaction) {
//     try {
//       const docRef = await addDoc(
//         collection(db, `users/${user.uid}/transactions`),
//         transaction
//       );
//       console.log("Document written with ID: ", docRef.id);
//       toast.success("Transaction Added!");
//       let newArr = transactions;
//       newArr.push(transaction);
//       setTransactions(newArr)
//     } catch (e) {
//       console.error("Error adding document: ", e);
//       toast.error("Couldn't add transaction");
//     }
//   }


//   useEffect(() => {
//   // get all docs from a collection
//   fetchTransactions();
//   }, []);

//   useEffect(() => {
//   }, [transactions])
  

//   const calculateBalance = () => {
//     let incomeTotal = 0;
//     let expensesTotal = 0;

//     transactions.forEach((transaction) => {
//       if (transaction.type === "income") {
//         incomeTotal += transaction.amount;
//       } else {
//         expensesTotal += transaction.amount;
//       }
//     });

//     setIncome(incomeTotal);
//     setExpense(expensesTotal);
//     setTotalBalance(incomeTotal - expensesTotal);
//   };


//   async function fetchTransactions() {
//     setLoading(true);
//     if (user) {
//       const q = query(collection(db, `users/${user.uid}/transactions`));
//       const querySnapshot = await getDocs(q);
//       let transactionsArray = [];
//       querySnapshot.forEach((doc) => {
//         // doc.data() is never undefined for query doc snapshots
//         transactionsArray.push(doc.data());
//       });
//       setTransactions(transactionsArray);
//       console.log("Transaction Array")
//       toast.success("Transactions Fetched!");
//     }
//     setLoading(false);
//   }
   

//   return (
//     <div>
//       <Header />

//       {loading? (
//         <p>Loading...</p>
//       ) : (
//         <>

//       <Cards
//        income={income}
//        expense={expense}
//        totalBalance={totalBalance}
//        showExpenseModal={showExpenseModal}
//        showIncomeModal={showIncomeModal}
//        />
//        <AddExpenseModal
//             isExpenseModalVisible={isExpenseModalVisible}
//             handleExpenseCancel={handleExpenseCancel}
//             onFinish={onFinish}
//           />
//           <AddIncomeModal
//             isIncomeModalVisible={isIncomeModalVisible}
//             handleIncomeCancel={handleIncomeCancel}
//             onFinish={onFinish}
//           />
//           </>)}
//     </div>
//   )
// }

// export default Dashboard

import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import Cards from '../components/Cards'
import AddExpenseModal from '../components/Modals/addExpense';
import AddIncomeModal from '../components/Modals/addIncome';
import { useAuthState } from 'react-firebase-hooks/auth';
import { toast } from 'react-toastify';
import { auth, db } from '../firebase';
import { addDoc, collection, getDocs, query } from 'firebase/firestore';
import moment from "moment";
import TransactionsTable from '../components/TransactionsTable';

function Dashboard () {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user] = useAuthState(auth);
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);

  const showExpenseModal = () => {
    setIsExpenseModalVisible(true);
  };

  const showIncomeModal = () => {
    setIsIncomeModalVisible(true);
  };

  const handleExpenseCancel = () => {
    setIsExpenseModalVisible(false);
  };

  const handleIncomeCancel = () => {
    setIsIncomeModalVisible(false);
  };

  const onFinish = (values, type) => {
    const newTransaction = {
      type: type,
      date: values.date.format("YYYY-MM-DD"),
      amount: parseFloat(values.amount),
      tag: values.tag,
      name: values.name,
    };
    addTransaction(newTransaction);
  };

  async function addTransaction(transaction) {
    try {
      const docRef = await addDoc(
        collection(db, `users/${user.uid}/transactions`),
        transaction
      );
      console.log("Document written with ID: ", docRef.id);
      toast.success("Transaction Added!");

      let newArr = [...transactions, transaction]; // Corrected mutation issue
      setTransactions(newArr);

      calculateBalance(newArr); // Corrected: Recalculate balance with the new transactions
    } catch (e) {
      console.error("Error adding document: ", e);
      toast.error("Couldn't add transaction");
    }
  }

  async function fetchTransactions() {
    setLoading(true);
    if (user) {
      const q = query(collection(db, `users/${user.uid}/transactions`));
      const querySnapshot = await getDocs(q);
      let transactionsArray = [];
      querySnapshot.forEach((doc) => {
        transactionsArray.push(doc.data());
      });
      setTransactions(transactionsArray);
      calculateBalance(transactionsArray); // Corrected: Recalculate balance after fetching transactions
      toast.success("Transactions Fetched!");
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchTransactions();
  }, [user]);

  const calculateBalance = (transactionsArray) => {
    let incomeTotal = 0;
    let expensesTotal = 0;

    transactionsArray.forEach((transaction) => {
      if (transaction.type === "income") {
        incomeTotal += transaction.amount;
      } else {
        expensesTotal += transaction.amount;
      }
    });

    setIncome(incomeTotal);
    setExpense(expensesTotal);
    setTotalBalance(incomeTotal - expensesTotal);
  };

  return (
    <div>
      <Header />

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <Cards
            income={income}
            expense={expense}
            totalBalance={totalBalance}
            showExpenseModal={showExpenseModal}
            showIncomeModal={showIncomeModal}
          />
          <AddExpenseModal
            isExpenseModalVisible={isExpenseModalVisible}
            handleExpenseCancel={handleExpenseCancel}
            onFinish={onFinish}
          />
          <AddIncomeModal
            isIncomeModalVisible={isIncomeModalVisible}
            handleIncomeCancel={handleIncomeCancel}
            onFinish={onFinish}
          />
          <TransactionsTable transactions={transactions} />
        </>
      )}
    </div>
  );
}

export default Dashboard;

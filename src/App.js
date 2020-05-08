import React, { useState, useEffect } from "react";

import "./App.css";
import Alert from "./component/Alert";
import ExpenseList from "./component/ExpenseList";
import ExpenseForm from "./component/ExpenseForm";
import { v4 as uuidv4 } from "uuid";

// const initialExpenses = [
//   { id: uuidv4(), charge: "rent", amount: 1600 },
//   { id: uuidv4(), charge: "car payment", amount: 600 },
//   { id: uuidv4(), charge: "credit card bill", amount: 1200 },
// ];

const initialExpenses = localStorage.getItem("expenses")
  ? JSON.parse(localStorage.getItem("expenses"))
  : [];

function App() {
  //************** state values *****************
  // all expenses add expense
  const [expenses, setExpenses] = useState(initialExpenses);
  //single charge
  const [charge, setCharge] = useState("");
  // single amount
  const [amount, setAmount] = useState("");
  // edit
  const [edit, setEdit] = useState(false);
  // item edit
  const [id, setId] = useState(0);
  // alert
  const [alert, setAlert] = useState({ show: false });
  //************** useEffect *****************
  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);
  //************** functionlity *****************
  // handle charge
  const handleCharge = (e) => {
    setCharge(e.target.value);
  };
  // handle amount
  const handleAmount = (e) => {
    setAmount(e.target.value);
  };
  // handle alert
  const handleAlert = ({ type, text }) => {
    setAlert({ show: true, type, text });
    setTimeout(() => {
      setAlert({ show: false });
    }, 4000);
  };
  // handle submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (charge !== "" && amount > 0) {
      if (edit) {
        let tempexpenses = expenses.map((item) => {
          return item.id === id ? { ...item, charge, amount } : item;
        });
        setExpenses(tempexpenses);
        setEdit(false);
        handleAlert({ type: "success", text: "item edited" });
      } else {
        const singleExpense = { id: uuidv4(), charge, amount };
        setExpenses([...expenses, singleExpense]);
        handleAlert({ type: "success", text: "item added" });
      }

      setCharge("");
      setAmount("");
    } else {
      handleAlert({
        type: "danger",
        text: `charge can't be emty value and amount value has to be bigger then zero`,
      });
    }
  };
  // clear list
  const clearList = () => {
    setExpenses([]);
    handleAlert({ type: "danger", text: "all items deleted" });
  };
  // handle Delete
  const handleDelete = (id) => {
    let tempexpenses = expenses.filter((item) => item.id !== id);
    setExpenses(tempexpenses);
    handleAlert({
      type: "danger",
      text: "item deleted",
    });
  };
  // handle edit
  const handleEdit = (id) => {
    let expense = expenses.find((item) => item.id === id);
    let { charge, amount } = expense;
    setCharge(charge);
    setAmount(amount);
    setEdit(true);
    setId(id);
  };

  return (
    <>
      {alert.show && <Alert type={alert.type} text={alert.text} />}

      <h1>budget calculator</h1>
      <main className="App">
        <ExpenseForm
          charge={charge}
          amount={amount}
          handleCharge={handleCharge}
          handleAmount={handleAmount}
          handleSubmit={handleSubmit}
          edit={edit}
        />
        <ExpenseList
          expenses={expenses}
          clearList={clearList}
          handleDelete={handleDelete}
          handleEdit={handleEdit}
        />
      </main>
      <h1>
        total spending :{" "}
        <span className="total">
          $
          {expenses.reduce((acc, curr) => {
            return (acc += parseInt(curr.amount));
          }, 0)}
        </span>
      </h1>
    </>
  );
}

export default App;

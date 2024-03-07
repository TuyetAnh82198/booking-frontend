import { Container, Table } from "react-bootstrap";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./transaction.module.css";

const Transaction = () => {
  //state danh sách giao dịch
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate();
  //Hàm lấy danh sách các giao dịch
  const fetchTransactions = useCallback(() => {
    fetch(`${process.env.REACT_APP_BACKEND}/transactions/get`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "have not been logged in yet") {
          navigate("/user/login", {
            state: {
              prevUrl: "/transaction",
            },
          });
        } else if (data.result) {
          setTransactions(data.result);
        }
      })
      .catch((err) => console.log(err));
  }, []);
  useEffect(() => fetchTransactions(), []);
  return (
    <Container className="my-4">
      <h4 style={{ fontWeight: "bold" }}>Your Transactions</h4>
      <Table striped bordered hover responsive>
        <thead>
          <tr className={styles.tHeader}>
            <th>#</th>
            <th>Hotel</th>
            <th>Room</th>
            <th>Date</th>
            <th>Price</th>
            <th>Payment Method</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, i) => (
            <tr key={transaction._id}>
              <td>{i + 1 > 9 ? i + 1 : `0${i + 1}`}</td>
              <td>{transaction.hotel.name}</td>
              <td>
                {transaction.room.map((item) => item.roomNumber).join(", ")}
              </td>
              <td>{`${
                transaction.startDate.split("-")[1]
              }/${transaction.startDate.split("-")[2].slice(0, 2)}/${
                transaction.startDate.split("-")[0]
              } - ${transaction.endDate.split("-")[1]}/${transaction.endDate
                .split("-")[2]
                .slice(0, 2)}/${transaction.endDate.split("-")[0]}`}</td>
              <td>${transaction.price}</td>
              <td>{transaction.payment}</td>
              <td>
                <button
                  className="border-0 rounded-2"
                  style={{
                    backgroundColor: "#f69584",
                    fontWeight: "500",
                    color: "green",
                  }}
                >
                  {transaction.status}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Transaction;

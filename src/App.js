import React, { useState, useEffect, useMemo } from 'react';

const mockTransactionData = [
  { id: 1, description: 'Payment for Product A', amount: 50.0 },
  { id: 2, description: 'Payment for Service B', amount: 75.0 },
  { id: 3, description: 'Payment for Service C', amount: 5.0 },
];
const fetchTransactionData = searchValue =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if(!searchValue) {
        resolve(mockTransactionData);
        return
      }
      for (let i = 0; i < mockTransactionData.length-1; i++) {
        const element = mockTransactionData[i];
        for (let j = i+1; j < mockTransactionData.length; j++) {
          const secondElement = mockTransactionData[j];
          if(element.amount + secondElement.amount === searchValue){
            resolve([element, secondElement]);
            return
          }
        }
      }
      if(searchValue){
        reject(new Error("No Transactions Available"))
      }
    }, 1000);
  });

const PaymentDashboard = () => {
  const [transactionData, setTransactionData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTransactionData().then(setTransactionData);
  }, []);

  const handleSearchInput = e => {
    const newSearchValue = e.target.value;
    fetchTransactionData(parseInt(newSearchValue))
      .then((newTransactions) => {
        setTransactionData(newTransactions)
        setError(null)
      })
      .catch((err) => {
        console.log(err)
        setError(err.message)
        setTransactionData([])
      });
  };

  const transactionListBody = useMemo(() => {
    return transactionData.map(transaction => {
      const { id, date, description, amount } = transaction;
      return (
        <li key={id}>
          <p>Transaction ID: {id}</p>
          <p>Date: {date}</p>
          <p>Description: {description}</p>
          <p>Amount: {amount.toFixed(2)}</p>
        </li>
      );
    })
  }, [transactionData])

  return (
    <div className='payment-dashboard'>
      <h1>Payment Transaction Dashboard</h1>
      <div className='search-container'>
        <h4>Search</h4>
        <input type='number' onChange={handleSearchInput} />
      </div>
      {error && <p className='error-message'>{error}</p>}
      <ul className='transaction-list'>
        {transactionListBody}
      </ul>
    </div>
  );
};

const App = (props) => {
  return <PaymentDashboard />;
}

export default App

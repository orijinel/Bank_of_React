/*==================================================
src/App.js

This is the top-level component of the app.
It contains the top-level state.
==================================================*/
import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';

// Import other components
import Home from './components/Home';
import UserProfile from './components/UserProfile';
import LogIn from './components/Login';
import Credits from './components/Credits';
import Debits from './components/Debits';

class App extends Component {
  constructor() {  // Create and initialize state
    super(); 
    this.state = {
      accountBalance: 1234567.89,
      creditList: [],
      debitList: [],
      currentUser: {
        userName: 'Joe Smith',
        memberSince: '11/22/99',
      }
    };
  }
  // Fetch Credits and Debits data when the component mounts
  async componentDidMount() {
    try {
      // Fetch credits
      const creditsResponse = await fetch('https://johnnylaicode.github.io/api/credits.json');
      const creditList = await creditsResponse.json();
      
      // Fetch debits
      const debitsResponse = await fetch('https://johnnylaicode.github.io/api/debits.json');
      const debitList = await debitsResponse.json();
      
      // Calculate total credits and debits
      const totalCredits = creditList.reduce((total, credit) => total + credit.amount, 0);
      const totalDebits = debitList.reduce((total, debit) => total + debit.amount, 0);
      
      // Update state with new data and adjusted balance
      this.setState({
        creditList,
        debitList,
        accountBalance: 1234567.89 + totalCredits - totalDebits
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  // Update state's currentUser (userName) after "Log In" button is clicked
  mockLogIn = (logInInfo) => {  
    const newUser = {...this.state.currentUser};
    newUser.userName = logInInfo.userName;
    this.setState({currentUser: newUser})
  }

  // Add new credit entry and update balance
  addCredit = (event) => {
    event.preventDefault();
    const description = event.target.description.value;
    const amount = Number(event.target.amount.value);
    
    const newCredit = {
      id: this.state.creditList.length + 1,
      description: description,
      amount: Number(amount.toFixed(2)),
      date: new Date().toISOString()
    };

    this.setState(prevState => ({
      creditList: [...prevState.creditList, newCredit],
      accountBalance: Number((prevState.accountBalance + amount).toFixed(2))
    }));

    // Reset form
    event.target.reset();
  }

  // Add new debit entry and update balance
  addDebit = (event) => {
    event.preventDefault();
    const description = event.target.description.value;
    const amount = Number(event.target.amount.value);
    
    const newDebit = {
      id: this.state.debitList.length + 1,
      description: description,
      amount: Number(amount.toFixed(2)),
      date: new Date().toISOString()
    };

    this.setState(prevState => ({
      debitList: [...prevState.debitList, newDebit],
      accountBalance: Number((prevState.accountBalance - amount).toFixed(2))
    }));

    // Reset form
    event.target.reset();
  }

  // Create Routes and React elements to be rendered using React components
  render() {  
    // Create React elements and pass input props to components
    const HomeComponent = () => (<Home accountBalance={this.state.accountBalance} />)
    const UserProfileComponent = () => (
      <UserProfile userName={this.state.currentUser.userName} memberSince={this.state.currentUser.memberSince} />
    )
    const LogInComponent = () => (<LogIn user={this.state.currentUser} mockLogIn={this.mockLogIn} />)
    const CreditsComponent = () => (
      <Credits 
        credits={this.state.creditList} 
        addCredit={this.addCredit}
        balance={this.state.accountBalance}
      />
    ) 
    const DebitsComponent = () => (
      <Debits 
        debits={this.state.debitList} 
        addDebit={this.addDebit}
        balance={this.state.accountBalance}
      />
    )

    // Important: Include the "basename" in Router, which is needed for deploying the React app to GitHub Pages
    return (
      <Router basename="/bank-of-react-starter-code">
        <div>
          <Route exact path="/" render={HomeComponent}/>
          <Route exact path="/userProfile" render={UserProfileComponent}/>
          <Route exact path="/login" render={LogInComponent}/>
          <Route exact path="/credits" render={CreditsComponent}/>
          <Route exact path="/debits" render={DebitsComponent}/>
        </div>
      </Router>
    );
  }
}

export default App;
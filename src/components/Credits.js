/*==================================================
src/components/Credits.js

The Credits component contains information for Credits page view.
Note: You need to work on this file for the Assignment.
==================================================*/
import {Link} from 'react-router-dom';

const Credits = (props) => {
  // Create the list of Credit items
  let creditsView = () => {
    const { credits } = props;
    return credits.map((credit) => {  // Extract "id", "amount", "description" and "date" properties of each credit JSON array element
      let date = credit.date.slice(0,10);
      // Format amount to 2 decimal places
      let amount = Number(credit.amount).toFixed(2);
      return <li key={credit.id}>{amount} {credit.description} {date}</li>
    });
  }
  // Render the list of Credit items and a form to input new Credit item
  return (
    <div>
      <h1>Credits</h1>

      {creditsView()}

      <form onSubmit={props.addCredit}>
        <input type="text" name="description" required />
        <input type="number" name="amount" min="0" step="0.01" required />
        <button type="submit">Add Credit</button>
      </form>
      <br/>
      <Link to="/">Return to Home</Link>
    </div>
  );
}

export default Credits;
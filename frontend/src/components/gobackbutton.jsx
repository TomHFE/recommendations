
import './gobackbutton.css'

function GoBack() {
    return (
      <>
        <button className="logout-button" onClick={() => window.history.back()}>
          Go Back
        </button>
      </>
    );
  }
  
  export default GoBack;
  
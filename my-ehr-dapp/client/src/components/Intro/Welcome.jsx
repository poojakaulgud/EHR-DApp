import './Welcome.css';

function Welcome() {
  return (
    // <div className='bc'>
    <div className="welcome">
      <h1 className='txt_color'>👋 Welcome To Our CSCI 531 Semester Project!</h1>
      <p>
        <img src = './blockchain.jpg' className="img_align"></img>
      </p>
    </div>
    // </div>
  );
}

export default Welcome;

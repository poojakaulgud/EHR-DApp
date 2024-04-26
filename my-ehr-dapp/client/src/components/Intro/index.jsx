import Welcome from "./Welcome";
import Tree from "./Tree";
import Desc from "./Desc";
import './Welcome.css';

function Intro() {
  return (
    <div className="bc">
    <>
      <Welcome />
      {/* <Tree /> */}
      <Desc />
    </>
    </div>
  );
}

export default Intro;

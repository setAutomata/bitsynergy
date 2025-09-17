import "./About.css";
import { Link } from "react-router-dom";

function About() {
  return (
    <div className="about">
      <div className="__top">
        <div>Terms of Use</div>
        <Link
          target="_blank"
          to=""
          className="view-btn"
        >
          View
        </Link>
      </div>

      <div className="insetLine"></div>
      <div className="__bottom">
        <div>Privacy Policy</div>
        <Link
          target="_blank"
          to=""
          className="view-btn"
        >
          View
        </Link>
      </div>
    </div>
  );
}

export default About;

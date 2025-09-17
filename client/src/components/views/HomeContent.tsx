import { Link } from "react-router-dom";
import "./HomeContent.css";
import Send from "../../assets/images/send.svg";
import Link_icn from "../../assets/images/link.svg";

function HomeContent() {
  return (
    <>
      <section className="contact__title">
        <h2>
          <strong className="grayTxt">Hi 👋</strong>
        </h2>
        <h2>
          <strong>How can we help?</strong>
        </h2>
      </section>
      <section className="contact__links__container">
        <Link to="_blank" className="underline">
          Check bitSynergy service status
          <img src={Link_icn} alt="check status" />
        </Link>
        <Link to="_blank" className="underline">
          Chat with LLM model <img src={Link_icn} alt="check model" />
        </Link>
        <Link to="_blank" className="underline">
          FAQ <img src={Link_icn} alt="FAQ" />
        </Link>
        <Link to="_blank">
          Complaint/Suggestion
          <img src={Link_icn} alt="complaint" />
        </Link>
      </section>
      <section>
        <Link to="_blank" className={"contact__support"}>
          <strong>Contact Support</strong>
          <img src={Send} alt="send" />
        </Link>
      </section>
    </>
  );
}

export default HomeContent;

import { Link } from "react-router-dom";
import "./MsgContent.css";
import Send from "../../assets/images/send.svg?react";
import MessageActive from "../../assets/images/messageActive.svg";

function MsgContent() {
  return (
    <>
      <section className="msg__content">
        <img src={MessageActive} alt="message" width="37" />
        <div>
          <strong>No messages</strong>
        </div>
        <div className="fnt-small">
          Messages from the team will be shown here
        </div>
      </section>
      <section className="msg__contact__container">
        <Link to="_blank" className={"msg__support"}>
          <strong className="fnt-small">Contact Support</strong>
          <Send/>
        </Link>
      </section>
    </>
  );
}

export default MsgContent;

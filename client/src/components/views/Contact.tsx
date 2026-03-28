import { useState, type RefObject } from "react";
import HomeContent from "./HomeContent";
import MsgContent from "./MsgContent";
import "./Contact.css";
import Logo from "../../assets/images/logo.svg?react";
import Close from "../../assets/images/close.svg?react";
import Home from "../../assets/images/home.svg?react";
import HomeActive from "../../assets/images/homeActive.svg?react";
import Message from "../../assets/images/message.svg?react";
import MessageActive from "../../assets/images/messageActive.svg?react";

function Contact({
  contactRef,
}: {
  contactRef: RefObject<HTMLDivElement | null>;
}) {
  const [tab, setTab] = useState({ home: true });
  return (
    <div className="contact__container" ref={contactRef}>
      <section
        className="contact__header"
        style={
          !tab.home
            ? { borderBottom: "1px solid #d9d9d9" }
            : { padding: "2rem 1.5rem" }
        }
      >
        {tab.home ? (
          <div className="contact__logo">
            <Logo style={{ color: "black" }} />
          </div>
        ) : (
          <strong className="messages__header">Messages</strong>
        )}
        {/* ------- close btn ---------- */}
        <div
          className="contact__closeBtn curs-ptr"
          onClick={() => {
            if (contactRef.current) contactRef.current.style.display = "none";
          }}
        >
          <Close />
        </div>
      </section>

      <section className="contact__content">
        {tab.home ? <HomeContent /> : <MsgContent />}
      </section>

      <section className="contact__tabs">
        <div
          className="contact__tab curs-ptr"
          onClick={() => setTab({ home: true })}
        >
          {tab.home ? <HomeActive width="25" /> : <Home width="25" />}
          {tab.home ? <strong>Home</strong> : <>Home</>}
        </div>
        <div
          className="contact__tab curs-ptr"
          onClick={() => setTab({ home: false })}
        >
          {tab.home ? <Message width="25" /> : <MessageActive width="25" />}
          {!tab.home ? <strong>Messages</strong> : <>Messages</>}
        </div>
      </section>
    </div>
  );
}

export default Contact;

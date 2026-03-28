import "./MobileHeader.css";
import Menu from "../../assets/images/menu.svg?react";
import NewChat from "../../assets/images/newChat.svg?react";
import { useLayoutEffect } from "react";

type MobileHeaderPropsT = {
  handleOpen: () => void;
  handleClose: () => void;
  newChat: () => void;
  setScreen: React.Dispatch<
    React.SetStateAction<{
      mobile: boolean;
      desktop: boolean;
    }>
  >;
};

function MobileHeader({
  handleOpen,
  handleClose,
  newChat,
  setScreen,
}: MobileHeaderPropsT) {

  useLayoutEffect(() => {
    const handleScreenResize = () => {
      const isMobile = window.innerWidth < 760;
      setScreen((prev) => ({ ...prev, mobile: isMobile, desktop: !isMobile }));
      if (isMobile) handleClose();
    };
    handleScreenResize();
    window.addEventListener("resize", handleScreenResize);
    return () => window.removeEventListener("resize", handleScreenResize);
  }, [window.innerWidth]);

  return (
    <section className="mobileHeader">
      <div
        className="mobileHeader_btn__container"
        role="button"
        onClick={handleOpen}
      >
        <Menu width="25" />
      </div>
      <div
        className="mobileHeader_btn__container"
        role="button"
        onClick={newChat}
      >
        <NewChat style={{ transform: "scale(1.1)" }} />
      </div>
    </section>
  );
}

export default MobileHeader;

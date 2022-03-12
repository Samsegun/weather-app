import { useRef } from "react";
import styles from "../../App.module.css";
import search from "../../images/magnifying-glass.png";

const MobileForm = props => {
  const readUserInputMobile = useRef("");

  return (
    <form
      className={styles["mobile-form"]}
      onSubmit={e => props.submitHandler(e, readUserInputMobile)}
    >
      <input
        type="text"
        placeholder="Another Location..."
        ref={readUserInputMobile}
        className={styles["mobile-form_input"]}
      />
      <img
        className={styles["search-icon"]}
        src={search}
        alt="search icon"
        onClick={e => props.submitHandler(e, readUserInputMobile)}
      />
    </form>
  );
};

export default MobileForm;

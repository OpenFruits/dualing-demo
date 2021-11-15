import { VFC, useContext } from "react";
import { AuthContext } from "src/firebase/Auth";
import { Header } from "src/components/LP/Header";
import { Header as LoginHeader } from "src/layout/application/Header";
import { Terms as TermsComponent } from "src/components/separate/support/Terms";

const Terms: VFC = () => {
  const { currentUser } = useContext(AuthContext);

  return (
    <>
      {currentUser?.uid !== "" ? (
        <LoginHeader href={`/${currentUser?.uid}`} pageTitle="" />
      ) : (
        <Header />
      )}
      {currentUser?.uid === "" && <div className="pt-14" />}
      <TermsComponent />
    </>
  );
};

export default Terms;

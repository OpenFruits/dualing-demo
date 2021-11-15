import { VFC, useContext } from "react";
import { AuthContext } from "src/firebase/Auth";
import { Header } from "src/components/LP/Header";
import { Header as LoginHeader } from "src/layout/application/Header";
import { PrivacyPolicy as PrivacyPolisyComponent } from "src/components/separate/support/PrivacyPolicy";

const PrivacyPolicy: VFC = () => {
  const { currentUser } = useContext(AuthContext);

  return (
    <>
      {currentUser?.uid !== "" ? (
        <LoginHeader href={`/${currentUser?.uid}`} pageTitle="" />
      ) : (
        <Header />
      )}
      {currentUser?.uid === "" && <div className="pt-14" />}
      <PrivacyPolisyComponent />
    </>
  );
};

export default PrivacyPolicy;

import { useContext, VFC } from "react";
import { AuthContext } from "src/firebase/Auth";

export const OpeningMessage: VFC = () => {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="mx-2 my-4 font-bold">
      <p className="mb-4">{currentUser?.firstName}さん、はじめまして。</p>
      <p className="mb-4">
        Dualingは、あなたの部活と就活の両立を
        <br />
        全力でサポートさせていただきます。
      </p>
      <p className="mb-4">
        企業とマッチングするためには、
        <br />
        あなたの自己PR動画が必要です。
        <br />
        ビデオ通話サービス「ZOOM」を使い、
        <br />
        自己PRのブラッシュアップと
        <br />
        印象の良い動画を撮影します。
      </p>
      <p>
        以下のフォームから
        <br />
        ZOOM希望日時の選択をお願いいたします。
        <br />
        （面談は60分程度の予定です。）
      </p>
    </div>
  );
};

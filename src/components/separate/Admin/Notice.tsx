import { useState, useCallback, VFC } from "react";

export const Notice: VFC = () => {
  const [address, setAddress] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const inputAddress = useCallback(
    (event) => {
      setAddress(event.target.value);
    },
    [setAddress]
  );
  const inputTitle = useCallback(
    (event) => {
      setTitle(event.target.value);
    },
    [setTitle]
  );
  const inputBody = useCallback(
    (event) => {
      setBody(event.target.value);
    },
    [setBody]
  );

  return (
    <div>
      <input
        type="text"
        id="address"
        value={address}
        placeholder="宛先"
        className="bg-white rounded border border-gray-300 p-1 my-1 w-60 h-12"
        onChange={inputAddress}
      />
      <input
        type="text"
        id="title"
        value={title}
        placeholder="題名"
        className="bg-white rounded border border-gray-300 p-1 my-1 w-60 h-12"
        onChange={inputTitle}
      />
      <input
        type="text"
        id="body"
        value={body}
        placeholder="本文"
        className="bg-white rounded border border-gray-300 p-1 my-1 w-60 h-12"
        onChange={inputBody}
      />
    </div>
  );
};

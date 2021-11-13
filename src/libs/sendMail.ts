import emailjs from "emailjs-com";

type Params = {
  to_email: string;
  title: string;
  to_name: string;
  message: string;
};

export const sendMail = (templateParams: Params) => {
  const emailjsServiceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "";
  const emailjsTemplateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "";
  const emailjsUserId = process.env.NEXT_PUBLIC_EMAILJS_USER_ID;

  emailjs.send(
    emailjsServiceId,
    emailjsTemplateId,
    templateParams,
    emailjsUserId
  );
};

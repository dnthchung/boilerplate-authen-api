import resend from "../config/resend";
import { EMAIL_SENDER, NODE_ENV } from "../constants/env";

type Params = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

const getFromEmail = () => (NODE_ENV === "development" ? "onboarding@resend.dev" : EMAIL_SENDER);

//Nếu môi trường đang là phát triển (development), thì không sử dụng địa chỉ email thật (to) mà thay bằng một địa chỉ giả định hoặc địa chỉ test "delivered@resend.dev".
const getToEmail = (to: string) => (NODE_ENV === "development" ? "delivered@resend.dev" : to);

export const sendMail = async ({ to, subject, text, html }: Params) =>
  await resend.emails.send({
    from: getFromEmail(),
    to: getToEmail(to),
    subject,
    text,
    html,
  });

import axios from "axios";

export const signin = async (
  identifier: string,
  password: string,
  captchaToken: string
) => {
  const response = await axios.post("/api/v1/signin", {
    identifier,
    password,
    captchaToken,
  });

  return response.data;
};

const backend_url = process.env.NEXT_PUBLIC_API_URL!;

export const authLogin = async (authInfo: {
  user_name: string;
  password: string;
}) => {
  return await fetch(`${backend_url}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN!}`,
    },
    body: JSON.stringify(authInfo),
  });
};

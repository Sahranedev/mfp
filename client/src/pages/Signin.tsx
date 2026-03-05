import { Button } from "../components/Button";
import { Form } from "../components/Form";
import { Input } from "../components/Input";
import { Layout } from "../components/Layout";
import { toast } from "react-hot-toast";

export function SigninPage() {
  async function onSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const form = new FormData(e.target);
      const json = { email: form.get("email"), password: form.get("password") };
      const response = await fetch("/api/users/tokens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(json),
      });
      if (!response.ok) {
        toast.error("Unable to sign in");
        return;
      }
      const data = (await response.json()) as { token: string };

      if (data?.token) {
        const meResponse = await fetch("/api/users/me", {
          headers: { Authorization: `Bearer ${data.token}` },
        });
        if (!meResponse.ok) {
          toast.error("Unable to sign in");
          return;
        }
        const meResult = await meResponse.json();

        if (meResult?.item?.id) {
          localStorage.setItem("token", data?.token);
          sessionStorage.setItem("user", meResult?.item);
          toast.success("You are connected");
          location.href = "/";
        } else {
          toast.error("Unable to sign in");
        }
      } else {
        toast.error("Unable to sign in");
      }
    } catch (err) {
      console.error("Sign in error:", err);
      toast.error("Unable to sign in");
    }
  }

  return (
    <Layout title="Home page">
      <p>Sign in on the App</p>
      <Form onSubmit={onSubmit}>
        <Input name="email" type="email" placeholder="User email" />
        <Input name="password" type="password" placeholder="Password" />
        <Button type="submit">Signin</Button>
      </Form>
    </Layout>
  );
}

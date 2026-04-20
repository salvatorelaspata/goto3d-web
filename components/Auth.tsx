import AuthForm from "@/components/AuthForm";

export default function Auth({ message }: { message?: string }) {
  return <AuthForm message={message} />;
}

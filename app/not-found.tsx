import BaseLayout from "@/components/layout/BaseLayout";
import Link from "next/link";

const fourOhFour = () => {
  return (
    <>
      <p>Page not found</p>
      <Link href={"/"}>Go back home</Link>
    </>
  );
};

export default fourOhFour;

import BaseLayout from "@/components/layout/BaseLayout"
import Link from "next/link"

const fourOhFour = () => {
  return (
    <BaseLayout title="404">
      <p>Page not found</p>
      <Link href={"/"}>
        Go back home
      </Link>
    </BaseLayout>
  )
}

export default fourOhFour
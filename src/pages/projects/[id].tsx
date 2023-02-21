import BaseLayout from "@/components/layout/BaseLayout"
import { useRouter } from "next/router"

const Project: React.FC<{
  project: any
}> = ({ project }) => {
  const { query: { id } } = useRouter()
  return (
    <BaseLayout title="Project">
      <h1>Project {id}</h1>
      <pre>{JSON.stringify(project, null, 2)}</pre>
    </BaseLayout>
  )
}

export default Project

// export const getServerSideProps: GetServerSideProps = async (context) => { }
import Form from "@/components/Form";
import BaseLayout from "@/components/layout/BaseLayout";

const NewProject: React.FC = () => {
  return (
    <BaseLayout title="New Project">
      <Form fields={['title']} onSubmit={console.log} />
    </BaseLayout>
  );
};


export default NewProject;
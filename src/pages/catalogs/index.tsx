import BaseLayout from "@/components/layout/BaseLayout";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSideProps } from "next";

const Catalogs: React.FC<{
  catalogs: any
}> = ({ catalogs }) => {
  return (
    <BaseLayout title="Catalogs">
      <ul>
        {catalogs.map((c: any) => (
          <li key={c.id}>
            <p>{c.id}</p>
            <pre>{JSON.stringify(c, null, 2)}</pre>
          </li>
        ))}
      </ul>
    </BaseLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const supabase = createServerSupabaseClient(context)
  const { data, error } = await supabase
    .from('catalogs')
    .select('*')
  if (error) {
    return {
      props: {
        catalogs: [],
      },
    }
  }
  return {
    props: {
      catalogs: data,
    },
  }
}

export default Catalogs;
import { Database } from "@/types/supabase";
import BaseLayout from "@/components/layout/BaseLayout";
import { User } from "@supabase/supabase-js";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";

interface Props {
  user: User | null;
}

const Profile: React.FC<Props> = ({ user }) => {
  return (
    <BaseLayout title="Profile">
      <p>
        <span className="font-mono">User:</span> {user?.email}
      </p>
      <p>
        <span className="font-mono">Provider:</span>{" "}
        {user?.app_metadata.provider}
      </p>
    </BaseLayout>
  );
};

export const getServerSideProps = async (context) => {
  const supabase = createPagesServerClient(context);
  const { data } = await supabase.auth.getUser(
    context.req.cookies["sb_access_token"]
  );
  const user = data || null;

  return {
    props: {
      user,
    },
  };
};

export default Profile;

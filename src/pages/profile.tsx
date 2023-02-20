import { useEffect, useState } from 'react'
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import { Database } from '@/types/supabase'

interface Props {
  user: any
}

const Profile: React.FC<Props> = () => {
  const supabase = useSupabaseClient<Database>()
  const user = useUser()
  const [count, setCount] = useState<number>(0)
  useEffect(() => {
    const fetch = async (id: string) => {
      const { data, error } = await supabase
        .from('viewer-3d-dev')
        .select("*")
      // .eq("userId", id);
      if (error) {
        console.log("error", error);
      } else {
        console.log(data, id)
        setCount(data.length);
      }

    }
    if (user) fetch(user.id)
  }, [supabase, user])
  return (
    <div>
      <div>
        <p>{`You're signed in`}</p>
        <pre>{JSON.stringify(user, null, 2)}</pre>
        <p>Project {JSON.stringify(count)}</p>
      </div>
    </div>
  )
}

export default Profile
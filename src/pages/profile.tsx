import { useEffect, useState } from 'react'
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import { Database } from '@/types/supabase'

interface Props {
  user: any
}

const Profile: React.FC<Props> = () => {
  const supabase = useSupabaseClient<Database>()
  const user = useUser()
  useEffect(() => {
    if (user) fetch(user.id)
  }, [supabase, user])
  return (
    <div>
      <div>
        <p>{`You're signed in`}</p>
        <pre>{JSON.stringify(user, null, 2)}</pre>
      </div>
    </div>
  )
}

export default Profile
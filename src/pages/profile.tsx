import { useEffect, useState } from 'react'
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import { Database } from '@/types/supabase'
import BaseLayout from '@/components/layout/BaseLayout'

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
    <BaseLayout title='Profile'>
      <p><span className='font-mono'>User:</span> {user?.email}</p>
      <p><span className='font-mono'>Provider:</span> {user?.app_metadata.provider}</p>
    </BaseLayout>
  )
}

export default Profile
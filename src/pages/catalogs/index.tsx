import BaseLayout from "@/components/layout/BaseLayout";
import Table from "@/components/Table";
import { Database } from "@/types/supabase";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";

const Catalogs: React.FC<{
    catalogs: Database['public']['Tables']['Catalog']['Row'][],
    count: number
}> = ({ catalogs, count }) => {
    const router = useRouter()
    return (
        <BaseLayout title={`Catalogs(${count})`}>
            <Link href="/catalogs/new" className='bg-violet-500 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded'>
                New Catalogs
            </Link>
            <Table data={catalogs} onRowClick={
                (row: Database['public']['Tables']['Catalog']['Row']) => {
                    router.push(`/projects/${row.id}`)
                }
            } />
        </BaseLayout>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const supabase = createServerSupabaseClient<Database>(context)
    const { data, error, count } = await supabase
        .from('Catalog')
        .select('*', { count: 'exact' })
    if (error) {
        return {
            props: {
                catalogs: [],
                count: 0
            },
        }
    }
    return {
        props: {
            catalogs: data,
            count
        },
    }
}

export default Catalogs;
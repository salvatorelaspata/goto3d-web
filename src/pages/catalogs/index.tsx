import BaseLayout from "@/components/layout/BaseLayout";
import Table from "@/components/Table";
import { Constants } from '@/constants';
import { Database } from "@/types/supabase";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSideProps } from "next";
import Link from "next/link";

const Catalogs: React.FC<{
    catalogs: Database['public']['Tables']['Catalog']['Row'][]
}> = ({ catalogs }) => {
    return (
        <BaseLayout title="Catalogs">
            <Link href="/catalogs/new" className='bg-violet-500 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded'>
                New Catalogs
            </Link>
            <Table data={catalogs} />
        </BaseLayout>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const supabase = createServerSupabaseClient<Database>(context)
    const { data, error } = await supabase
        .from('Catalog')
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
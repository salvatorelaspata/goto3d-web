import BaseLayout from "@/components/layout/BaseLayout";
import { Database } from "@/types/supabase";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { CatalogCard } from "@/components/CatalogCard";

const Catalogs: React.FC<{
    catalogs: Database['public']['Tables']['Catalog']['Row'][],
    count: number
}> = ({ catalogs, count }) => {
    return (
        <BaseLayout title={`Catalogs(${count})`}>
            <Link href="/catalogs/new" className='bg-violet-500 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded'>
                New Catalogs
            </Link>
            {catalogs.map((catalog) => (
                <CatalogCard key={catalog.id} {...catalog} />
            ))}
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
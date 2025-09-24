
import { getAnalytics } from '@/actions/get-analytics';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { DataCard } from './_components/data-card';
import { Chart } from './_components/chart';



const AnalyticsPage = async () => {

    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    if (!userId) {
        return redirect('/');
    }

    const {
        data,
        totalRevenue,
        totalSales,
    } = await getAnalytics(userId);

    return (
        <div className='p-6'>
            <div className='grid grid-cols-1 gap-4 mb-4 md:grid-cols-2'>

                <DataCard
                    label="Total Revenue"
                    value={totalRevenue}
                    shouldFormat
                />
                <DataCard
                    label="Total Sales"
                    value={totalSales}
                    shouldFormat
                />
            </div>
            <Chart data={data} />
        </div>
    )
}

export default AnalyticsPage;
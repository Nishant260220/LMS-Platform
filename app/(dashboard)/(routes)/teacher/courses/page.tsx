
import { DataTable } from './_components/data-table'
import { columns } from './_components/columns'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import db from '@/lib/db'
import { authOptions } from '@/lib/auth'

 
const CoursesPage = async() => {

  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if(!userId){
    return redirect("/");
  }
 
   const courses = await db.course.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    }
   });


  return (
    <div className='p-6'>
      <DataTable columns={columns} data={courses} />
    </div>
  )
}

export default CoursesPage
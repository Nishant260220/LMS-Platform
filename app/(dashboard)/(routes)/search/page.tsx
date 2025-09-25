import db from '@/lib/db'
import React, { JSX } from 'react'
import { Categories } from './_components/categories';
import { SearchInput } from '@/components/search-input';
import { getCourses } from '@/actions/get-courses';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { CoursesList } from '@/components/courses-list';
import { authOptions } from '@/lib/auth';

interface SearchParams {
  title?: string;
  categoryId?: string;
}

interface SearchPageProps {
  searchParams: Promise<SearchParams>;
}
const Searchpage = async({
  searchParams,
}: SearchPageProps) => {

  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const { title, categoryId } = await searchParams;

  if(!userId){
    return redirect("/")
  }
  const categories = await db.category.findMany({
    orderBy: {
      name: "asc"
    }
  });

  const courses = await getCourses({
    userId,
    title: title,
    categoryId: categoryId,
  })
  return (
    <>
    <div className='px-6 pt-6 md:hidden md:mb-0 block'>
      <SearchInput/>
    </div>
    <div className='p-6 space-y-4'>
      <Categories
      items={categories} 
      />
      <CoursesList items={courses}/>
    </div>
    </>
  )
}

export default Searchpage
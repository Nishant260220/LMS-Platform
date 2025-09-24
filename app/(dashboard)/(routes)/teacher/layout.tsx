import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { isTeacher } from "@/lib/teacher";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

interface TeacherLayoutProps {
  children: React.ReactNode;
} 

const TeacherLayout = async ({ children }: TeacherLayoutProps) => {
    const session =  await getServerSession(authOptions);
    const userId = session?.user?.id;

    if(!isTeacher(userId)) {
        redirect("/")
    }

    return <>{children}</>
}

export default TeacherLayout;

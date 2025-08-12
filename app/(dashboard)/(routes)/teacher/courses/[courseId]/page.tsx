import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { IconBadge } from "@/components/icon-badge";
import db from "@/lib/db";
import { LayoutDashboard } from "lucide-react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import TitleForm from "./_components/title-form";
import DescriptionForm from "./_components/description-form";


const courseIdPage = async ({ params }: { params: { courseId: string } }) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return redirect("/");
  }
  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
    },
  });

  if (!course) {
    return redirect("/");
  }

  const requiredFields = [
    course.title,
    course.description,
    course.imageURL,
    course.price,
    course.categoryId,
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">course setup</h1>
          <span className="text-sm text-slate-700">
            complete all fields {completionText}
          </span>
        </div>
      </div>
      <div className="grid grid-col-1 md:grid-col-2 gap-6 mt-16">
        <div>
          <div className="flex items-center gap-x-2">
            <IconBadge icon={LayoutDashboard} />
            <h2 className="text-2xl">Customise your course</h2>
          </div>
          <TitleForm initialData={course} courseId={course.id} />

          <DescriptionForm initialData={{ description: course.description || "" }} courseId={course.id} />
          {/* initaialData={course} */}
        </div>
      </div>
    </div>
  );
};

export default courseIdPage;

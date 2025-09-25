import { getChapter } from "@/actions/get-chapters";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Banner } from "@/components/banner";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { VideoPlayer } from "./_components/video-player";
import { CourseEnrollButton } from "./_components/course-enroll-button";
import { Separator } from "@/components/ui/separator";
import { Preview } from "@/components/preview";
import { File } from "lucide-react";
import { CourseProgresssButton } from "./_components/course-progress-button";

const ChapterIdPage = async({
  params
}: {
  params: { courseId: string; chapterId: string }
}) => {

  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const { courseId, chapterId } = params;

  if(!userId){
    return redirect("/");
  }

  const {
    chapter,
    course,
    muxData,
    attachments,
    nextChapter,
    userProgress,
    purchase,
  } = await getChapter({
    userId,
    chapterId: chapterId,
    courseId: courseId,
  });

  if(!chapter || !course) {
    return redirect("/");
  }

  const isLocked = !chapter.isFree && !purchase;
  const completeOnEnd = !!purchase && !userProgress?.isCompleted;

  
  return (
    <div>
      {userProgress?.isCompleted && (
        <Banner
          variant="success"
          label="You already completed this chapter"
        />
      )}
      {isLocked && (
        <Banner
          variant="warning"
          label="You need to purchase this course to watch this chapter"
        />
      )}

      <div className="flex flex-col max-w-4xl mx-auto pb-20">
        <div className="p-4">
          <VideoPlayer
           chapterId={chapter.id}
           title={chapter.title}
           courseId={courseId}
           nextChapterId={nextChapter?.id}
           playbackId={muxData?.playbackId!}
           isLocked={isLocked}
           completeOnEnd={completeOnEnd}
          />
        </div>
        <div>
          <div className="p-4 flex flex-col md:flex-row items-center justify-between">
            <h2 className="text-2xl font-semibold mb-2">
              {chapter.title}
            </h2>
            {purchase ? (
             <CourseProgresssButton
              chapterId={chapterId}
              courseId={courseId}
              nextChapterId={nextChapter?.id}
              isCompleted={!!userProgress?.isCompleted}
             />
             
            ): (
              <CourseEnrollButton
                courseId={params.courseId}
                price={course.price!}
              />
            )}
          </div>
          <Separator/>
          <div>
            <Preview value={chapter.description!}/>
          </div>
          {!!attachments.length && !isLocked && (
            <>
            <Separator/>
            <div className="p-4">
              {attachments.map((attachment) => (
                <a 
                 href={attachment.url || undefined}
                 target="_blank"
                 key={attachment.id}
                 className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline"
                 >
                  <File/>
                  <p className="line-clamp-1">
                    {attachment.name}
                  </p>
                  
                 </a>
              ))}
            </div>
            </>
          )}
        </div>
      </div>

    </div>
  )
}


export default ChapterIdPage;

import { getChapter } from "@/actions/get-chapters";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Banner } from "@/components/banner";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { VideoPlayer } from "./_components/video-player";

const ChapterIdPage = async({
  params
}: {
  params: { courseId: string; chapterId: string }
}) => {

  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const { courseId, chapterId } = await params;

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
      </div>

    </div>
  )
}


export default ChapterIdPage;

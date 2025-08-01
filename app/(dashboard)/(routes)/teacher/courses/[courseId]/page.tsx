

const courseIdPage = ({params} : {params: {courseId: string}}) => {
  return (
    <div>
       courseId: {params.courseId }
    </div>
  )
}

export default courseIdPage
import StudentProfile from "@/components/StudentProfile";
import dummyData from '../../../data/dummyData';

export default function Profile ({params}) {
  const { studentId } = params;
  return (
    <div className="min-h-screen flex items-center justify-center">
      <StudentProfile studentId={studentId} />
    </div>
  )
}

export async function generateStaticParams() {
  const students = dummyData;

  return students.map(student=>{
    studentId: student.id;
  })
}




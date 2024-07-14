import StudentProfile from "@/components/StudentProfile";
import dummyData from '../../../data/dummyData';

export async function generateStaticParams() {
  const students = dummyData;

  return students.map(student=>{
    studentId: student.id;
  })
}

export default function Profile () {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <StudentProfile />
    </div>
  )
}



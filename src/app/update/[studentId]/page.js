import UpdateProfile from "@/components/UpdateProfile";

export async function generateStaticParams() {

  return [0].map(student=>({
    studentId: student.toString(),
  }))
}

export default function Page ({params}) {
  const { studentId } = params;
  return (
    <div className="min-h-screen flex items-center justify-center">
      <UpdateProfile studentId={studentId} />
    </div> 
  )
}


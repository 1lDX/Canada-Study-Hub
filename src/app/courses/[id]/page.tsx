import { PublicCourses } from "@/components/public-courses";
export default async function Course({params}:{params:Promise<{id:string}>}){return <PublicCourses id={(await params).id}/>}

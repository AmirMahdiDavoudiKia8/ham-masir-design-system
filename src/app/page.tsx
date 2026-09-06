import { redirect } from "next/navigation";

/** The role-selection screen is gone — students land straight on the home page now. */
export default function RootPage() {
  redirect("/student/home");
}

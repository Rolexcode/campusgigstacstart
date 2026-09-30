import { redirect } from "next/navigation";

export default function StudentVerificationRedirect() {
  redirect("/profile");
}

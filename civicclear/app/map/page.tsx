import { redirect } from "next/navigation";

/** Map view removed — campus reports use a location dropdown instead of GPS. */
export default function MapPage() {
  redirect("/queue");
}

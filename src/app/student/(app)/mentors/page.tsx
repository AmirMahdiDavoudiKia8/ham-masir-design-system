import { redirect } from "next/navigation";

interface MentorsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

/**
 * The mentor list now lives inline on /student/discover (filters + full
 * results on one page). This route is kept only so old links/bookmarks
 * still land somewhere sensible, carrying the same filters forward.
 */
export default async function MentorsPage({ searchParams }: MentorsPageProps) {
  const params = await searchParams;
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    const v = Array.isArray(value) ? value[0] : value;
    if (v) query.set(key, v);
  }
  const queryString = query.toString();
  redirect(`/student/discover${queryString ? `?${queryString}` : ""}`);
}

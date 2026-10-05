import { EmptyState } from "@/design-system";
import { Button } from "@/design-system";
import { SearchIcon } from "@/design-system";
import type { Mentor } from "@/lib/mentors";
import { MentorCard } from "./MentorCard";
import { RequestMentorCard } from "./RequestMentorCard";

interface MentorListProps {
  mentors: Mentor[];
  /** The current filter query string — forwarded into each mentor's profile page as `back`, so its own back button (and the booking flow beyond it) can return to these exact results. */
  queryString: string;
  /** Clears every filter in the caller's own state — shown as the empty-state action since the filters are already right above this list. */
  onResetFilters: () => void;
}

export function MentorList({ mentors, queryString, onResetFilters }: MentorListProps) {
  if (mentors.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        <EmptyState
          icon={<SearchIcon className="h-6 w-6" />}
          title="هم‌مسیری با این فیلترها پیدا نشد"
          description="فیلترهات رو کمی بازتر کن و دوباره امتحان کن، هر روز هم‌مسیرهای بیشتری به هم‌مسیر اضافه می‌شن."
          action={
            <Button variant="outline" size="md" className="mt-1" onClick={onResetFilters}>
              پاک کردن فیلترها
            </Button>
          }
        />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          <RequestMentorCard />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {mentors.map((mentor) => (
        <MentorCard key={mentor.id} mentor={mentor} queryString={queryString} />
      ))}
      <RequestMentorCard />
    </div>
  );
}

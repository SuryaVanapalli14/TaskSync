'use client';

import { useState, useMemo } from "react";
import Link from "next/link";
import { PlusCircle, ArrowDownUp } from "lucide-react";
import { tasks as allTasks } from "@/lib/data";
import type { Task } from "@/lib/types";
import { TaskCard } from "@/components/task-card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type SortOption = "distance" | "pay" | "urgency";

const urgencyOrder = {
  Emergency: 1,
  "Same Day": 2,
  Flexible: 3,
};

export default function TasksPage() {
  const [sortOption, setSortOption] = useState<SortOption>("distance");

  const sortedTasks = useMemo(() => {
    let sorted: Task[] = [...allTasks];
    switch (sortOption) {
      case "distance":
        sorted.sort((a, b) => a.distance - b.distance);
        break;
      case "pay":
        sorted.sort((a, b) => b.budget - a.budget);
        break;
      case "urgency":
        sorted.sort((a, b) => urgencyOrder[a.urgency] - urgencyOrder[b.urgency]);
        break;
      default:
        break;
    }
    return sorted;
  }, [sortOption]);

  return (
    <div className="container py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">
            Task Marketplace
          </h1>
          <p className="text-muted-foreground mt-1">Find your next job. Sorted by {sortOption}.</p>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <ArrowDownUp className="mr-2 h-4 w-4" />
                Sort By
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuRadioGroup value={sortOption} onValueChange={(value) => setSortOption(value as SortOption)}>
                <DropdownMenuRadioItem value="distance">Distance (Nearest)</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="pay">Pay (Highest)</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="urgency">Urgency (Emergency First)</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button asChild>
            <Link href="/tasks/create">
              <PlusCircle className="mr-2 h-4 w-4" />
              Post a New Task
            </Link>
          </Button>
        </div>
      </div>

      {sortedTasks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <h2 className="text-xl font-semibold">No tasks available right now</h2>
          <p className="text-muted-foreground mt-2">
            Check back later or be the first to post a new task!
          </p>
        </div>
      )}
    </div>
  );
}

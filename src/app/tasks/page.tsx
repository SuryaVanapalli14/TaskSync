import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { tasks } from "@/lib/data";
import { TaskCard } from "@/components/task-card";
import { Button } from "@/components/ui/button";

export default function TasksPage() {
  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Task Marketplace
        </h1>
        <Button asChild>
          <Link href="/tasks/create">
            <PlusCircle className="mr-2 h-4 w-4" />
            Post a New Task
          </Link>
        </Button>
      </div>

      {tasks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tasks.map((task) => (
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

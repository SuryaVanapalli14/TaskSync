import { CreateTaskForm } from "./create-task-form";

export default function CreateTaskPage() {
  return (
    <div className="container max-w-3xl mx-auto py-12">
      <div className="space-y-2 mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Post a New Task
        </h1>
        <p className="text-muted-foreground">
          Fill out the details below to find the perfect helper for your job. The more detail you add, the better!
        </p>
      </div>
      <CreateTaskForm />
    </div>
  );
}

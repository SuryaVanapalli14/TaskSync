"use client";

import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Sparkles, AlertCircle, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { handlePriceSuggestion } from "./actions";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { SuggestTaskPriceOutput } from "@/ai/flows/suggest-task-price";

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters long."),
  description: z.string().min(20, "Description must be at least 20 characters long."),
  location: z.string().min(3, "Location is required."),
  date: z.date({
    required_error: "A date for the task is required.",
  }),
  budget: z.coerce.number().min(5, "Budget must be at least $5."),
  workers: z.coerce.number().int().min(1, "At least 1 worker is required."),
});

type FormValues = z.infer<typeof formSchema>;

export function CreateTaskForm() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [suggestion, setSuggestion] = useState<SuggestTaskPriceOutput | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      budget: 50,
      workers: 1,
    },
  });

  function onSubmit(values: FormValues) {
    console.log(values);
    toast({
      title: "Task Posted!",
      description: "Your task has been successfully posted to the marketplace.",
    });
    form.reset();
    setSuggestion(null);
  }

  function onSuggestPrice() {
    startTransition(async () => {
      const description = form.getValues("description");
      const location = form.getValues("location");
      const date = form.getValues("date");

      if (!description || !location || !date) {
        toast({
          variant: "destructive",
          title: "Missing Information",
          description: "Please provide a description, location, and date to get a price suggestion.",
        });
        return;
      }
      
      setSuggestion(null);

      const formData = new FormData();
      formData.append("description", description);
      formData.append("location", location);
      formData.append("dateTime", date.toISOString());
      
      const result = await handlePriceSuggestion(formData);

      if (result.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error,
        });
      } else if (result.data) {
        setSuggestion(result.data);
        form.setValue("budget", result.data.suggestedPrice, { shouldValidate: true });
        toast({
          title: "Price Suggestion Ready!",
          description: "We've suggested a price based on the task details.",
        });
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Task Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Help with moving furniture" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the task in detail..."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                The more detail you provide, the better the price suggestion will be.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Downtown, Seattle" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          <FormField
            control={form.control}
            name="budget"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Budget ($)</FormLabel>
                <div className="flex gap-2">
                    <FormControl>
                      <Input type="number" placeholder="50" {...field} />
                    </FormControl>
                    <Button type="button" variant="outline" onClick={onSuggestPrice} disabled={isPending}>
                        {isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Sparkles className="h-4 w-4" />
                        )}
                        <span className="ml-2 hidden sm:inline">Suggest Price</span>
                    </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="workers"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Workers</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        {suggestion && (
          <Alert>
            <Sparkles className="h-4 w-4" />
            <AlertTitle className="font-headline">AI Price Suggestion</AlertTitle>
            <AlertDescription>
                We suggest a budget of <strong>${suggestion.suggestedPrice}</strong>. {suggestion.explanation}
            </AlertDescription>
          </Alert>
        )}

        <Button type="submit" size="lg" className="w-full">
          Post Task
        </Button>
      </form>
    </Form>
  );
}

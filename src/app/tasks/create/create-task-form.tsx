
"use client";

import { useState, useTransition, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Sparkles, Loader2, Image as ImageIcon, Video, Info, X } from "lucide-react";
import Image from "next/image";

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
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

const MAX_PHOTOS = 5;

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters long.").max(50, "Title must be 50 characters or less."),
  description: z.string().min(20, "Description must be at least 20 characters long."),
  photos: z.any().optional(),
  video: z.any().optional(),
  urgency: z.enum(["emergency", "same-day", "flexible"]),
  datePreference: z.enum(["specific", "range"]),
  specificDate: z.date().optional(),
  dateRangeStart: z.date().optional(),
  dateRangeEnd: z.date().optional(),
  estimatedDuration: z.string().min(1, "Please select an estimated duration."),
  
  // Hidden Address
  flatNumber: z.string().min(1, "Flat/House number is required."),
  street: z.string().min(3, "Street is required."),
  landmark: z.string().optional(),
  
  // Public Location
  approximateLocation: z.string().min(3, "Approximate location is required for public view."),

  budgetType: z.enum(["fixed", "hourly", "bids"]),
  budget: z.coerce.number().optional(),
  paymentMethod: z.enum(["cod", "wallet"]),
});

type FormValues = z.infer<typeof formSchema>;

export function CreateTaskForm() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [suggestion, setSuggestion] = useState<SuggestTaskPriceOutput | null>(null);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      photos: undefined,
      video: undefined,
      urgency: "flexible",
      datePreference: "specific",
      specificDate: undefined,
      dateRangeStart: undefined,
      dateRangeEnd: undefined,
      estimatedDuration: "",
      flatNumber: "",
      street: "",
      landmark: "",
      approximateLocation: "",
      budgetType: "fixed",
      paymentMethod: "wallet",
      budget: undefined,
    },
  });

  const datePreference = form.watch("datePreference");
  const budgetType = form.watch("budgetType");

  // Cleanup object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      photoPreviews.forEach(url => URL.revokeObjectURL(url));
      if (videoPreview) {
        URL.revokeObjectURL(videoPreview);
      }
    };
  }, [photoPreviews, videoPreview]);


  function onSubmit(values: FormValues) {
    console.log(values);
    toast({
      title: "Task Posted!",
      description: "Your task has been successfully posted to the marketplace.",
    });
    form.reset();
    setSuggestion(null);
    setPhotoPreviews([]);
    setVideoPreview(null);
  }

  function onSuggestPrice() {
    startTransition(async () => {
      const description = form.getValues("description");
      const location = form.getValues("approximateLocation");
      const date = form.getValues("specificDate");

      if (!description || !location || !date) {
        toast({
          variant: "destructive",
          title: "Missing Information",
          description: "Please provide a description, approximate location, and a specific date to get a price suggestion.",
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

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>, fieldChange: (files: FileList | null) => void) => {
    const files = event.target.files;
    if (files) {
      if (files.length > MAX_PHOTOS) {
          toast({
              variant: "destructive",
              title: `You can only upload a maximum of ${MAX_PHOTOS} photos.`
          });
          // Reset file input
          event.target.value = '';
          return;
      }

      fieldChange(files);
      const newPreviews = Array.from(files).map(file => URL.createObjectURL(file));
      setPhotoPreviews(prev => {
        prev.forEach(url => URL.revokeObjectURL(url));
        return newPreviews;
      });
    }
  };

  const handleVideoChange = (event: React.ChangeEvent<HTMLInputElement>, fieldChange: (file: File | null) => void) => {
    const file = event.target.files?.[0] || null;
    fieldChange(file);
    setVideoPreview(prev => {
      if (prev) {
        URL.revokeObjectURL(prev);
      }
      return file ? URL.createObjectURL(file) : null;
    });
  };

  const removePhoto = (index: number) => {
    const currentFiles = form.getValues('photos') as FileList | undefined;
    if(currentFiles) {
        const newFiles = new DataTransfer();
        Array.from(currentFiles).forEach((file, i) => {
            if(i !== index) newFiles.items.add(file);
        });
        form.setValue('photos', newFiles.files.length > 0 ? newFiles.files : undefined, { shouldValidate: true });
    }
    setPhotoPreviews(previews => {
        const newPreviews = [...previews];
        URL.revokeObjectURL(newPreviews[index]);
        newPreviews.splice(index, 1);
        return newPreviews;
    });
  }
  
  const removeVideo = () => {
    form.setValue('video', undefined, { shouldValidate: true });
    setVideoPreview(prev => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
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
              <FormLabel>Detailed Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the task in detail. What needs to be done? Any special requirements?"
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator />
        <h3 className="text-lg font-medium font-headline">Visuals & Urgency</h3>
        
        <div className="grid md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="photos"
            render={({ field: { onChange, value, ...fieldProps } }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <ImageIcon /> Photos (Optional)
                </FormLabel>
                <FormControl>
                  <Input type="file" accept="image/*" multiple onChange={(e) => handlePhotoChange(e, onChange)} {...fieldProps} />
                </FormControl>
                <FormDescription>Upload up to 5 images.</FormDescription>
                <FormMessage />
                {photoPreviews.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {photoPreviews.map((src, index) => (
                      <div key={index} className="relative aspect-square">
                        <Image src={src} alt={`Preview ${index + 1}`} fill className="rounded-md object-cover"/>
                         <Button type="button" size="icon" variant="destructive" className="absolute -top-2 -right-2 h-6 w-6 rounded-full" onClick={() => removePhoto(index)}>
                            <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="video"
            render={({ field: { onChange, value, ...fieldProps } }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Video /> Video (Optional)
                </FormLabel>
                <FormControl>
                  <Input type="file" accept="video/mp4,video/quicktime" onChange={(e) => handleVideoChange(e, onChange)} {...fieldProps} />
                </FormControl>
                 <FormDescription>A short 15-second video.</FormDescription>
                <FormMessage />
                 {videoPreview && (
                  <div className="relative aspect-video mt-4">
                    <video src={videoPreview} controls className="w-full h-full rounded-md object-cover" />
                     <Button type="button" size="icon" variant="destructive" className="absolute -top-2 -right-2 h-6 w-6 rounded-full" onClick={removeVideo}>
                        <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="urgency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Urgency Level</FormLabel>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2"
              >
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="emergency" id="emergency" className="border-red-500 text-red-500" />
                  </FormControl>
                  <FormLabel htmlFor="emergency" className="font-normal text-red-600">
                    Emergency (2-4 hours)
                  </FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="same-day" id="same-day" className="border-yellow-500 text-yellow-500" />
                  </FormControl>
                  <FormLabel htmlFor="same-day" className="font-normal text-yellow-600">
                    Same Day (Today)
                  </FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="flexible" id="flexible" className="border-green-500 text-green-500" />
                  </FormControl>
                   <FormLabel htmlFor="flexible" className="font-normal text-green-600">
                    Flexible (Next 3-5 days)
                  </FormLabel>
                </FormItem>
              </RadioGroup>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator />
        <h3 className="text-lg font-medium font-headline">Scheduling & Duration</h3>

        <FormField
          control={form.control}
          name="datePreference"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preferred Date</FormLabel>
               <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a date preference" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="specific">Specific Date & Time</SelectItem>
                    <SelectItem value="range">Date Range</SelectItem>
                  </SelectContent>
                </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {datePreference === "specific" && (
          <FormField
            control={form.control}
            name="specificDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Specific Date</FormLabel>
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
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
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
        )}
        
        {datePreference === "range" && (
          <div className="grid md:grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="dateRangeStart"
              render={({ field }) => (
              <FormItem className="flex flex-col">
                  <FormLabel>Start Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date()} initialFocus />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dateRangeEnd"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>End Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < (form.getValues("dateRangeStart") || new Date())} initialFocus />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        <FormField
          control={form.control}
          name="estimatedDuration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estimated Duration</FormLabel>
               <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="How long will the task take?" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="< 1 hour">&lt; 1 hour</SelectItem>
                    <SelectItem value="1-2 hours">1-2 hours</SelectItem>
                    <SelectItem value="2-4 hours">2-4 hours</SelectItem>
                    <SelectItem value="half-day">Half day (4-6 hours)</SelectItem>
                    <SelectItem value="full-day">Full day (6+ hours)</SelectItem>
                  </SelectContent>
                </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Separator />
        <h3 className="text-lg font-medium font-headline">Location Details</h3>

        <FormField
          control={form.control}
          name="approximateLocation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Approximate Location (Public)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Downtown, Seattle" {...field} />
              </FormControl>
              <FormDescription>This will be shown on the public task post. Be general, like a neighborhood or area.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="space-y-4 rounded-md border p-4 bg-secondary/50">
            <h4 className="font-medium flex items-center gap-2">
                Exact Address (Hidden)
                 <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild><Info className="h-4 w-4 text-muted-foreground"/></TooltipTrigger>
                        <TooltipContent><p>This is only shared with the helper you hire.</p></TooltipContent>
                    </Tooltip>
                 </TooltipProvider>
            </h4>
             <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="flatNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Flat/House No.</FormLabel>
                      <FormControl><Input placeholder="Apt #123" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="street"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street Name</FormLabel>
                      <FormControl><Input placeholder="Main St" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
            <FormField
              control={form.control}
              name="landmark"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Landmark (Optional)</FormLabel>
                  <FormControl><Input placeholder="Near Central Park" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>


        <Separator />
        <h3 className="text-lg font-medium font-headline">Budget & Payment</h3>

        <FormField
          control={form.control}
          name="budgetType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Budget Type</FormLabel>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2"
              >
                <FormItem>
                  <FormControl>
                    <RadioGroupItem value="fixed" id="fixed" hidden/>
                  </FormControl>
                  <FormLabel htmlFor="fixed" className={cn("block p-4 border rounded-md cursor-pointer", budgetType === 'fixed' && "border-primary ring-2 ring-primary")}>
                    <h4 className="font-semibold">Fixed Price</h4>
                    <p className="text-sm text-muted-foreground">"I will pay a set amount for this task."</p>
                  </FormLabel>
                </FormItem>
                 <FormItem>
                  <FormControl>
                    <RadioGroupItem value="hourly" id="hourly" hidden/>
                  </FormControl>
                  <FormLabel htmlFor="hourly" className={cn("block p-4 border rounded-md cursor-pointer", budgetType === 'hourly' && "border-primary ring-2 ring-primary")}>
                    <h4 className="font-semibold">Hourly Rate</h4>
                    <p className="text-sm text-muted-foreground">"I will pay based on hours worked."</p>
                  </FormLabel>
                </FormItem>
                 <FormItem>
                  <FormControl>
                    <RadioGroupItem value="bids" id="bids" hidden/>
                  </FormControl>
                  <FormLabel htmlFor="bids" className={cn("block p-4 border rounded-md cursor-pointer", budgetType === 'bids' && "border-primary ring-2 ring-primary")}>
                    <h4 className="font-semibold">Open for Bids</h4>
                    <p className="text-sm text-muted-foreground">"Helpers can make me an offer."</p>
                  </FormLabel>
                </FormItem>
              </RadioGroup>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {budgetType !== 'bids' && (
           <FormField
            control={form.control}
            name="budget"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{budgetType === 'fixed' ? "Fixed Price ($)" : "Hourly Rate ($/hr)"}</FormLabel>
                <div className="flex gap-2">
                    <FormControl>
                      <Input type="number" placeholder={budgetType === 'fixed' ? 'e.g., 50' : 'e.g., 15'} {...field} />
                    </FormControl>
                    {budgetType === 'fixed' && (
                        <Button type="button" variant="outline" onClick={onSuggestPrice} disabled={isPending}>
                            {isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Sparkles className="h-4 w-4" />
                            )}
                            <span className="ml-2 hidden sm:inline">Suggest Price</span>
                        </Button>
                    )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        {suggestion && (
          <Alert>
            <Sparkles className="h-4 w-4" />
            <AlertTitle className="font-headline">AI Price Suggestion</AlertTitle>
            <AlertDescription>
                We suggest a budget of <strong>${suggestion.suggestedPrice}</strong>. {suggestion.explanation}
            </AlertDescription>
          </Alert>
        )}

        <FormField
          control={form.control}
          name="paymentMethod"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Method</FormLabel>
               <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="How will you pay?" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="wallet">Online Wallet (Recommended)</SelectItem>
                    <SelectItem value="cod">Cash on Delivery (COD)</SelectItem>
                  </SelectContent>
                </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        

        <Button type="submit" size="lg" className="w-full">
          Post Task
        </Button>
      </form>
    </Form>
  );
}

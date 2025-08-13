"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useForm } from "react-hook-form";

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
import { Button } from "@/components/ui/button";
import { ImageIcon, Pencil, PlusCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Course } from "@/lib/generated/prisma";
import Image from "next/image";
import { FileUpload } from "@/app/(dashboard)/_components/file-upload";

const formSchema = z.object({
  imageUrl: z.string().min(1, {
    message: "Image is required",
  }),
});

interface ImageFormProps {
  initialData: Course;
  courseId: string;
}

const ImageForm = ({ initialData, courseId }: ImageFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { imageUrl: initialData?.imageURL || "" },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try{
      await axios.patch(`/api/courses/${courseId}`,values);
      toast.success("Course updated");
      toggleEdit();
      router.refresh();
    }catch{
      toast.error("Something went wrong");
    }
  };
  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        course image
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && (
            <>Cancel</>
          )} 
          {!isEditing && !initialData.imageURL && (
            <>
              <PlusCircle className="h-4 w-4 mr-2"/>
              Add an image
            </>
          )}
          {!isEditing && initialData.imageURL &&(
            <>
              <Pencil className="h-4 w-4" />
              Edit image
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
         !initialData.imageURL ? (
            <div className="flex items-center justify-center h-60
            bg-slate-200 rounded-md">
                <ImageIcon className="h-10 w-10 text-slate-500"/>
            </div>
         ) : (
            <div className="relative aspect-video mt-2000">
               <Image
                  alt="Upload"
                  fill
                  className="object-cover rounded-md"
                  src={initialData?.imageURL}
               />
            </div>
         )
      )}
      {isEditing && (
        <div>
            <FileUpload
             endpoint="courseImage"
             onChange={(url) => {
                if(url){
                    onSubmit({imageUrl: url});
                }
             }}
             />
             <div className="text-xs text-muted-foreground mt-4">
                16:9 aspect ratio recommended
             </div>
        </div>
      )}
    </div>
  );
};

export default ImageForm;

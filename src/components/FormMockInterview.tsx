import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { Interview } from "@/types";
import { CustomBreadCrum } from "./CustomBreadCrum";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { Headings } from "./Headings";
import { Button } from "./ui/button";
import { Loader, Trash2 } from "lucide-react";
import { Separator } from "./ui/separator";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { chatSession } from "@/scripts";
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "@/config/firebase-config";

interface FormMockInterviewProps {
  initialData: Interview | null;
}

interface QAItem {
  question: string;
  answer: string;
}

// Schema for form validation
const formSchema = z.object({
  position: z
    .string()
    .min(1, "Position is required")
    .max(100, "Position must be 100 characters or less"),
  description: z.string().min(10, "Description is required"),
  experience: z.coerce
    .number()
    .min(0, "Experience cannot be empty or negative"),
  techStack: z.string().min(1, "Tech stack must be at least a character"),
});

type FormData = z.infer<typeof formSchema>;

// Keys we'll accept as "this is the question text" / "this is the answer text"
const QUESTION_KEYS = [
  "question",
  "Question",
  "questionText",
  "question_text",
  "interview_question",
  "interviewQuestion",
  "q",
  "prompt",
];

const ANSWER_KEYS = [
  "answer",
  "Answer",
  "answerText",
  "answer_text",
  "a",
  "response",
  "solution",
];

const extractField = (item: any, keys: string[]): string | null => {
  if (!item || typeof item !== "object") return null;
  for (const key of keys) {
    if (item[key] && typeof item[key] === "string") return item[key];
  }
  return null;
};

/**
 * Normalizes whatever shape the AI returned into a strict
 * { question, answer }[] array. Handles:
 *  1. The happy path: every object already has both fields.
 *  2. A "split" response: the model returned question-only and
 *     answer-only objects (e.g. alternating), which we pair up in order.
 * Throws if neither shape matches, so the caller can surface a real error
 * instead of silently saving broken data.
 */
const normalizeQA = (parsed: any[]): QAItem[] => {
  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error("AI response was not a non-empty array");
  }

  // Case 1: every item already has both a question and an answer field
  const hasBoth = parsed.every(
    (item) => extractField(item, QUESTION_KEYS) && extractField(item, ANSWER_KEYS)
  );

  if (hasBoth) {
    return parsed.map((item) => ({
      question: extractField(item, QUESTION_KEYS) as string,
      answer: extractField(item, ANSWER_KEYS) as string,
    }));
  }

  // Case 2: question-only objects and answer-only objects, same count -> pair them
  const questionOnly = parsed.filter(
    (item) => extractField(item, QUESTION_KEYS) && !extractField(item, ANSWER_KEYS)
  );
  const answerOnly = parsed.filter(
    (item) => extractField(item, ANSWER_KEYS) && !extractField(item, QUESTION_KEYS)
  );

  if (questionOnly.length > 0 && questionOnly.length === answerOnly.length) {
    return questionOnly.map((qItem, idx) => ({
      question: extractField(qItem, QUESTION_KEYS) as string,
      answer: extractField(answerOnly[idx], ANSWER_KEYS) as string,
    }));
  }

  // Nothing matched a known shape — fail loudly instead of saving garbage
  console.error("Could not normalize AI response. Raw parsed data:", parsed);
  throw new Error(
    "AI response is missing question text for one or more items. Check console for raw data."
  );
};

export const FormMockInterview = ({ initialData }: FormMockInterviewProps) => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      description: initialData.description || "",
      position: initialData.position || "",
      experience: typeof initialData.experience === 'string'
        ? parseInt(initialData.experience, 10) || 0
        : initialData.experience || 0,
      techStack: initialData.techStack || "",
    } : {
      description: "",
      position: "",
      experience: 0,
      techStack: "",
    },
  });

  const { isValid, isSubmitting } = form.formState;
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { userId } = useAuth();

  const title = initialData?.position
    ? initialData?.position
    : "Create a new Mock Interview";

  const breadCrumbPage = initialData?.position ? "Edit" : "Create";
  const actions = initialData ? "Save Changes" : "Create";
  const toastMessage = initialData
    ? { title: "Updated..!", description: "Changes saved successfully..." }
    : { title: "Created..!", description: "New Mock Interview created..." };

  // Cleans markdown fences, extracts the JSON array, parses it,
  // then normalizes it into a guaranteed { question, answer }[] shape.
  const cleanAiResponse = (responseText: string): QAItem[] => {
    let cleanText = responseText.trim();

    cleanText = cleanText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/, "")
      .replace(/```$/, "")
      .trim();

    const jsonArrayMatch = cleanText.match(/\[.*\]/s);
    if (jsonArrayMatch) {
      cleanText = jsonArrayMatch[0];
    } else {
      throw new Error("No JSON array found in response");
    }

    let parsed: any[];
    try {
      parsed = JSON.parse(cleanText);
    } catch (error) {
      throw new Error("Invalid JSON format: " + (error as Error)?.message);
    }

    return normalizeQA(parsed);
  };

  const generateAiResponse = async (data: FormData): Promise<QAItem[]> => {
    const prompt = `Generate a strict JSON array containing 5 technical interview questions and answers based on:
    - Job Position: ${data?.position}
    - Job Description: ${data?.description}
    - Years of Experience: ${data?.experience}
    - Tech Stack: ${data?.techStack}

    STRICT REQUIREMENT: Output MUST be a valid JSON array of EXACTLY 5 objects.
    Every single object MUST contain BOTH of these two keys, with non-empty string values:
    "question" and "answer".
    Do NOT return an object that has only "answer" without "question", or vice versa.

    Example format:
    [
      {
        "question": "What is the virtual DOM in React?",
        "answer": "The virtual DOM is a lightweight copy of the real DOM..."
      }
    ]
    Do not include any intro, markdown text outside code blocks, or extra keys. Return ONLY the JSON array.`;

    const aiResult = await chatSession.sendMessage(prompt);
    const rawText = aiResult.response.text();

    // Keep this while you're debugging — remove once you trust the pipeline.
    console.log("RAW AI RESPONSE:", rawText);

    const cleanResponse = cleanAiResponse(rawText);
    console.log("NORMALIZED QA:", cleanResponse);

    return cleanResponse;
  };

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      if (initialData) {
        if (isValid) {
          const aiResult = await generateAiResponse(data);

          await updateDoc(doc(db, "interviews", initialData?.id), {
            questions: aiResult,
            ...data,
            updateAt: serverTimestamp(),
          });

          toast.success(toastMessage.title, { description: toastMessage.description });
        }
      } else {
        if (isValid) {
          const aiResult = await generateAiResponse(data);

          await addDoc(collection(db, "interviews"), {
            ...data,
            userId,
            questions: aiResult,
            createdAt: serverTimestamp(),
          });

          toast.success(toastMessage.title, { description: toastMessage.description });
        }
      }

      navigate("/generate", { replace: true });
    } catch (error) {
      console.error("onSubmit error:", error);
      toast.error("Error..", {
        description:
          (error as Error)?.message ||
          "Something went wrong. Please try again later",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialData) {
      form.reset({
        position: initialData.position,
        description: initialData.description,
        experience: initialData.experience,
        techStack: initialData.techStack,
      });
    }
  }, [initialData, form]);

  return (
    <div className="w-full flex-col space-y-4">
      <CustomBreadCrum
        breadCrumbPage={breadCrumbPage}
        breadCrumbItems={[{ label: "Mock Interview", link: "/generate" }]}
      />

      <div className="mt-4 flex items-center justify-between w-full">
        <Headings title={title} isSubHeading />

        {initialData && (
          <Button size={"icon"} variant={"ghost"}>
            <Trash2 className="min-w-4 min-h-4 text-red-500" />
          </Button>
        )}
      </div>

      <Separator className="my-4" />

      <div className="my-6"></div>

      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full p-8 rounded-lg flex-col flex items-start justify-start gap-6 shadow-md"
        >
          <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
              <FormItem className="w-full space-y-4">
                <div className="w-full flex items-center justify-between">
                  <FormLabel>Job Role / Job Position</FormLabel>
                  <FormMessage className="text-sm" />
                </div>
                <FormControl>
                  <Input
                    disabled={loading}
                    className="h-12"
                    placeholder="eg: Full Stack Developer"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="w-full space-y-4">
                <div className="w-full flex items-center justify-between">
                  <FormLabel>Job Description</FormLabel>
                  <FormMessage className="text-sm" />
                </div>
                <FormControl>
                  <Textarea
                    className="h-12"
                    disabled={loading}
                    placeholder="eg:- describe your job role"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Experience */}
          <FormField
            control={form.control}
            name="experience"
            render={({ field }) => (
              <FormItem className="w-full space-y-4">
                <div className="w-full flex items-center justify-between">
                  <FormLabel>Years of Experience</FormLabel>
                  <FormMessage className="text-sm" />
                </div>
                <FormControl>
                  <Input
                    type="number"
                    className="h-12"
                    disabled={loading}
                    placeholder="eg:- 5 Years"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Tech Stacks */}
          <FormField
            control={form.control}
            name="techStack"
            render={({ field }) => (
              <FormItem className="w-full space-y-4">
                <div className="w-full flex items-center justify-between">
                  <FormLabel>Tech Stacks</FormLabel>
                  <FormMessage className="text-sm" />
                </div>
                <FormControl>
                  <Textarea
                    className="h-12"
                    disabled={loading}
                    placeholder="eg:- React, Typescript..."
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Button section */}
          <div className="w-full flex items-center justify-end gap-6">
            <Button
              type="reset"
              size={"sm"}
              variant={"outline"}
              disabled={isSubmitting || loading}
            >
              Reset
            </Button>

            <Button
              type="submit"
              size={"sm"}
              disabled={isSubmitting || !isValid || loading}
            >
              {loading ? (
                <Loader className="text-gray-50 animate-spin" />
              ) : (
                actions
              )}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

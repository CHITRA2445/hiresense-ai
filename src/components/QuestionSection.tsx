import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { TooltipButton } from "./TooltipButton";
import { Volume2, VolumeX } from "lucide-react";
import { RecordAnswer } from "./RecordAnswer";

interface QuestionSectionProps {
  questions: any[];
}

export const QuestionSection = ({ questions }: QuestionSectionProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isWebCam, setIsWebCam] = useState(false);
  const [currentSpeech, setCurrentSpeech] =
    useState<SpeechSynthesisUtterance | null>(null);

  // Only used as a safety net for OLD Firestore docs saved before the
  // generation-side normalization fix. New docs will always have a clean
  // { question, answer } shape and hit the very first check below.
  const getQuestionText = (item: any): string => {
    if (!item) return "No question data";
    if (typeof item === "string") return item;

    if (item.question && typeof item.question === "string") {
      return item.question;
    }

    const standardKeys = [
      "Question",
      "questionText",
      "question_text",
      "interview_question",
      "interviewQuestion",
      "q",
      "prompt",
      "title",
    ];

    for (const key of standardKeys) {
      if (item[key] && typeof item[key] === "string") {
        return item[key];
      }
    }

    // This item only has an "answer" (or similar) — old malformed record.
    console.warn(
      "QuestionSection: item is missing a question field, showing raw data.",
      item
    );
    return JSON.stringify(item);
  };

  const getAnswerText = (item: any): string => {
    if (!item || typeof item === "string") return "";
    if (item.answer && typeof item.answer === "string") return item.answer;

    const answerKeys = ["Answer", "answerText", "answer_text", "a", "response"];
    for (const key of answerKeys) {
      if (item[key] && typeof item[key] === "string") return item[key];
    }
    return "";
  };

  const handlePlayQuestion = (qst: string) => {
    if (isPlaying && currentSpeech) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setCurrentSpeech(null);
    } else {
      if ("speechSynthesis" in window) {
        const speech = new SpeechSynthesisUtterance(qst);
        window.speechSynthesis.speak(speech);
        setIsPlaying(true);
        setCurrentSpeech(speech);

        speech.onend = () => {
          setIsPlaying(false);
          setCurrentSpeech(null);
        };
      }
    }
  };

  if (!questions || questions.length === 0) {
    return (
      <div className="w-full min-h-96 border rounded-md p-4 flex items-center justify-center text-muted-foreground">
        No questions available.
      </div>
    );
  }

  return (
    <div className="w-full min-h-96 border rounded-md p-4">
      <Tabs
        defaultValue="question-0"
        className="w-full space-y-12"
        orientation="vertical"
      >
        <TabsList className="bg-transparent w-full flex flex-wrap items-center justify-start gap-4">
          {questions.map((_, i) => (
            <TabsTrigger
              className={cn(
                "data-[state=active]:bg-emerald-300 data-[state=active]:shadow-md text-xs px-2"
              )}
              key={`trigger-${i}`}
              value={`question-${i}`}
            >
              {`Question #${i + 1}`}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Questions displayed */}
        {questions.map((tab, i) => {
          const qText = getQuestionText(tab);
          const aText = getAnswerText(tab);

          return (
            <TabsContent key={`content-${i}`} value={`question-${i}`}>
              <p className="text-base text-left tracking-wide text-neutral-800 font-medium my-4">
                {qText}
              </p>
              <div className="w-full flex items-center justify-end mb-4">
                <TooltipButton
                  content={isPlaying ? "Stop" : "Start"}
                  icon={
                    isPlaying ? (
                      <VolumeX className="min-w-5 min-h-5 text-muted-foreground" />
                    ) : (
                      <Volume2 className="min-w-5 min-h-5 text-muted-foreground" />
                    )
                  }
                  onClick={() => handlePlayQuestion(qText)}
                />
              </div>

              <RecordAnswer
                question={{ question: qText, answer: aText }}
                isWebCam={isWebCam}
                setIsWebCam={setIsWebCam}
              />
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
};

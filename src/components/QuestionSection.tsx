import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { TooltipButton } from "./TooltipButton";
import { Volume2, VolumeX } from "lucide-react";
import { RecordAnswer } from "./RecordAnswer";

interface QuestionSectionProps {
  questions: { question: string; answer: string }[];
}

export const QuestionSection = ({ questions }: QuestionSectionProps) => {
  // This state is used for whether the questions voice is playing or not
  const [isPlaying, setIsPlaying] = useState(false);
  // This is for whether the webcam is enabled or not
  const [isWebCam, setIsWebCam] = useState(false);

  // For voice recording speech, we have built-in SpeechSynthesisUtterance in JS
  const [currentSpeech, setCurrentSpeech] =
    useState<SpeechSynthesisUtterance | null>(null);

  // This function is used to play the question voice
  const handlePlayQuestion = (qst: string) => {
    // Stop the speech if already playing
    if (isPlaying && currentSpeech) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setCurrentSpeech(null);
    } else {
      if ("speechSynthesis" in window) {
        // get the speech and speak
        const speech = new SpeechSynthesisUtterance(qst);
        window.speechSynthesis.speak(speech);
        setIsPlaying(true);
        setCurrentSpeech(speech);

        // handle the speech end
        speech.onend = () => {
          setIsPlaying(false);
          setCurrentSpeech(null);
        };
      }
    }
  };

  // Safe check if questions are available
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
        {questions.map((tab, i) => (
          <TabsContent key={`content-${i}`} value={`question-${i}`}>
            <p className="text-base text-left tracking-wide text-neutral-800 font-medium my-4">
              {tab?.question || "Question text not available"}
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
                onClick={() => handlePlayQuestion(tab.question)}
              />
            </div>

            <RecordAnswer
              question={tab}
              isWebCam={isWebCam}
              setIsWebCam={setIsWebCam}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
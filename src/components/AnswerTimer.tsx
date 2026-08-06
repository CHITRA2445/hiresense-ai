import { useEffect, useState } from "react";
import { Timer, AlertTriangle, CheckCircle2, Clock } from "lucide-react";

interface AnswerTimerProps {
  isRecording: boolean;
  onTimeUpdate?: (seconds: number) => void;
}

export const AnswerTimer = ({ isRecording, onTimeUpdate }: AnswerTimerProps) => {
  const [seconds, setSeconds] = useState(0);

  // Timer logic: runs only when recording is active
  useEffect(() => {
   let interval: any = null;

    if (isRecording) {
      interval = setInterval(() => {
        setSeconds((prev) => {
          const nextSec = prev + 1;
          if (onTimeUpdate) onTimeUpdate(nextSec);
          return nextSec;
        });
      }, 1000);
    } else {
      // Reset timer when recording stops
      setSeconds(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording, onTimeUpdate]);

  if (!isRecording && seconds === 0) return null;

  // Format seconds into MM:SS
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Helper to determine pace feedback status
  const getPaceStatus = (totalSeconds: number) => {
    if (totalSeconds < 30) {
      return {
        label: "Answer might be too short / missing detail",
        color: "bg-amber-100 text-amber-800 border-amber-300",
        icon: <AlertTriangle className="w-4 h-4 text-amber-600" />,
      };
    } else if (totalSeconds <= 120) {
      return {
        label: "Optimal Answer Length!",
        color: "bg-emerald-100 text-emerald-800 border-emerald-300",
        icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
      };
    } else {
      return {
        label: "Answer getting long, try to wrap up",
        color: "bg-rose-100 text-rose-800 border-rose-300",
        icon: <Clock className="w-4 h-4 text-rose-600" />,
      };
    }
  };

  const status = getPaceStatus(seconds);

  return (
    <div className="flex flex-col items-center gap-2 my-3 w-full animate-in fade-in duration-300">
      {/* Dynamic Timer Badge */}
      <div className="flex items-center gap-2 bg-slate-900 text-white px-4 py-1.5 rounded-full shadow-md text-sm font-mono font-medium">
        <Timer className="w-4 h-4 text-emerald-400 animate-pulse" />
        <span>{formatTime(seconds)}</span>
      </div>

      {/* Dynamic Pace Indicator Tag */}
      <div
        className={`flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-md border ${status.color} transition-all duration-300`}
      >
        {status.icon}
        <span>{status.label}</span>
      </div>
    </div>
  );
};
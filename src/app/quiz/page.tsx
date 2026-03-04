import type { Metadata } from 'next';
import { QuizComponent } from '@/components/quiz/QuizComponent';

export const metadata: Metadata = {
  title: 'Cybersecurity Career Quiz',
  description:
    'Take our 3-minute cybersecurity career quiz to get a personalised confidence score, role recommendations, and tailored coaching recommendations.',
};

export default function QuizPage() {
  return (
    <div className="bg-white dark:bg-[#0A0A0A] min-h-screen">
      <QuizComponent />
    </div>
  );
}

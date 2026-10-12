import {
  CircuitBoard,
  Cpu,
  FlaskConical,
  GraduationCap,
  Handshake,
  type LucideIcon,
} from "lucide-react";

export const BOOKING_MINUTES = 30;

export interface BookingTopic {
  readonly key: string;
  readonly title: string;
  readonly line: string;
  readonly minutes: number;
  readonly icon: LucideIcon;
  readonly color: string;
}

export const BOOKING_TOPICS: readonly BookingTopic[] = [
  {
    key: "platform-demo",
    title: "Platform demo",
    line: "A walk through the EoS kernel, eBoot and the tools, on your use case.",
    minutes: BOOKING_MINUTES,
    icon: Cpu,
    color: "#F97316",
  },
  {
    key: "partnership",
    title: "Partnership or OEM",
    line: "Running EmbeddedOS on your hardware, or building it into your product.",
    minutes: BOOKING_MINUTES,
    icon: Handshake,
    color: "#22D3EE",
  },
  {
    key: "research",
    title: "Research collaboration",
    line: "Joint projects, grant proposals and papers on embedded systems.",
    minutes: BOOKING_MINUTES,
    icon: FlaskConical,
    color: "#A78BFA",
  },
  {
    key: "education",
    title: "University or education",
    line: "Course labs, student projects and teaching with EmbeddedOS.",
    minutes: BOOKING_MINUTES,
    icon: GraduationCap,
    color: "#34D399",
  },
  {
    key: "boards",
    title: "EoS boards and hardware",
    line: "Evaluating, licensing or manufacturing an EmbeddedOS board.",
    minutes: BOOKING_MINUTES,
    icon: CircuitBoard,
    color: "#FB923C",
  },
];

export const BOOKING_EXPECT = [
  `A ${BOOKING_MINUTES}-minute video call, with a link in your confirmation email.`,
  "Bring your use case, board or question; we come ready to go through it with you.",
  "You leave with next steps: a repository to start from, a person to follow up with, or both.",
] as const;

export const BOOKING_FAQ = [
  {
    question: "How long is the call?",
    answer: `${BOOKING_MINUTES} minutes. If the topic needs longer, we will arrange a follow-up.`,
  },
  {
    question: "Is it free?",
    answer:
      "Yes. There is no charge for the call, and booking does not commit you to anything.",
  },
  {
    question: "Can I reschedule or cancel?",
    answer:
      "Yes. Calendly's confirmation email has links to reschedule or cancel the booking.",
  },
  {
    question: "Who will be there?",
    answer:
      "One or two people from the EmbeddedOS team, chosen for your topic. Your confirmation names your host.",
  },
] as const;

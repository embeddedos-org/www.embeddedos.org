import BookingCalendar from "@/components/BookingCalendar";
import { BpPage, PageHero } from "@/components/bp";
import {
  BOOKING_EXPECT,
  BOOKING_EXPECT_BY_EMAIL,
  BOOKING_FAQ,
  BOOKING_FAQ_BY_EMAIL,
  BOOKING_MINUTES,
  BOOKING_TIME_ZONE_NOTE,
  BOOKING_TIME_ZONE_NOTE_BY_EMAIL,
  BOOKING_TOPICS,
  type BookingTopic,
} from "@/data/booking";
import {
  BOOKING_STEPS,
  BOOKING_STEPS_BY_EMAIL,
  bookingCalendarReady,
} from "@/lib/booking";
import { openContactForm } from "@/lib/contact-form";
import "./Book.css";

function Steps({ steps }: { steps: typeof BOOKING_STEPS }) {
  return (
    <ol aria-label="How booking works" className="bk-steps">
      {steps.map((s, i) => (
        <li key={s.step}>
          <span className="n">{i + 1}</span>
          <span className="bk-sl">{s.label}</span>
        </li>
      ))}
    </ol>
  );
}

function TopicRow({ topic }: { topic: BookingTopic }) {
  return (
    <li>
      <span className="bk-tt">{topic.title}</span>
      <span className="bk-tl">{topic.line}</span>
      <span className="bk-tm">{topic.minutes} min</span>
    </li>
  );
}

function EmailFallback() {
  return (
    <div className="bk-fb">
      <div className="bk-fb-t">
        <p className="bk-fb-h">Arrange the call by email</p>
        <p>Send us a few times that suit you and we will set up your call.</p>
      </div>
      <button
        type="button"
        onClick={() =>
          openContactForm({ topic: "contact", subject: "Meeting request" })
        }
        className="btn pri"
      >
        Email us to arrange it
      </button>
    </div>
  );
}

export default function Book() {
  // Without a valid embed URL there is no calendar, only the email fallback,
  // and Google sends no confirmation.
  const hasCalendar = bookingCalendarReady();
  const steps = hasCalendar ? BOOKING_STEPS : BOOKING_STEPS_BY_EMAIL;
  const expectations = hasCalendar ? BOOKING_EXPECT : BOOKING_EXPECT_BY_EMAIL;
  const questions = hasCalendar ? BOOKING_FAQ : BOOKING_FAQ_BY_EMAIL;

  return (
    <BpPage className="book">
      <PageHero
        sig
        label="BOOK A CALL"
        title="Talk to the EmbeddedOS team"
        lead={`A ${BOOKING_MINUTES}-minute video call with the people who build EmbeddedOS: the kernel, the tools and the boards.`}
      >
        <Steps steps={steps} />
      </PageHero>

      <div className="sec bk-main">
        <div className="wrap bk-grid">
          <div className="bk-col">
            <section aria-labelledby="topic-heading" className="bk-topics">
              <h2 id="topic-heading">What would you like to talk about?</h2>
              <p className="bk-sub">
                {hasCalendar
                  ? "Mention your topic in the booking form so the right people join."
                  : "Mention your topic in your email so the right people join."}
              </p>
              <ul className="bk-tlist">
                {BOOKING_TOPICS.map(t => (
                  <TopicRow key={t.key} topic={t} />
                ))}
              </ul>
            </section>

            <section
              id="pick-a-time"
              aria-labelledby="time-heading"
              className="bk-time"
            >
              <h2 id="time-heading">
                {hasCalendar ? "Pick a time" : "Suggest a few times"}
              </h2>
              <p className="bk-meta">
                <span>{BOOKING_MINUTES} min</span>
                <span>Your time zone</span>
              </p>
              <BookingCalendar fallback={<EmailFallback />} />
            </section>
          </div>

          <aside className="bk-aside">
            <div className="bk-box">
              <h2>What to expect</h2>
              <ul className="bk-exp">
                {expectations.map(item => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="bk-box">
              <h2>Your time zone</h2>
              <p>
                {hasCalendar
                  ? BOOKING_TIME_ZONE_NOTE
                  : BOOKING_TIME_ZONE_NOTE_BY_EMAIL}
              </p>
            </div>
            <div className="bk-box">
              <h2>Questions</h2>
              <div className="faq bk-faq">
                {questions.map(item => (
                  <details key={item.question}>
                    <summary>{item.question}</summary>
                    <p>{item.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </BpPage>
  );
}

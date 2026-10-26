import { Link } from "wouter";
import { BOOKING_MINUTES } from "@/data/booking";
import "./BookingTeaser.css";

/**
 * The compact "Book a call" card that /contact and /eos-boards show instead of
 * the calendar: one line and a link to /book. It sits inside a Black Edition
 * page (.bp), so it is drawn with that page's card and button classes.
 */
export default function BookingTeaser({
  href,
  title,
  line,
}: {
  href: string;
  title: string;
  line: string;
}) {
  return (
    <div data-booking="teaser" className="card hl bk-teaser">
      <div className="bk-teaser-t">
        <p className="bk-teaser-h">{title}</p>
        <p>
          {line} {BOOKING_MINUTES} minutes, by video.
        </p>
      </div>
      <Link href={href} className="btn pri">
        Book a call{" "}
        <span className="ar" aria-hidden="true">
          →
        </span>
      </Link>
    </div>
  );
}

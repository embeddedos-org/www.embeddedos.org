<?php

declare(strict_types=1);

/*
 * Retired. This endpoint mailed the team inboxes a booking notice posted by
 * /book's previous calendar. /book now embeds a Google Calendar appointment
 * schedule, which tells the page nothing about a booking, and Google Calendar
 * notifies the calendar's owner itself, so nothing posts here any more.
 *
 * The file stays, reduced to this, because the deploy cannot delete:
 * client/public/.cpanel.yml copies the build into public_html and has
 * deliberately no delete step. Removed from the repository, the old endpoint
 * would stay live on the server, still mailing both inboxes for any request
 * that set the site's Origin header. Deployed, this file overwrites it.
 *
 * Every request gets 410 Gone. The body is not read, nothing is stored and no
 * mail is sent. Once public_html/api/booking.php is gone from the server, this
 * file can be deleted too (README, "Booking").
 */

http_response_code(410);
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
echo '{"ok":false,"error":"gone"}';

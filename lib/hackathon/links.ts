// External RSVP / ticket listings for ONLYHACKS for the ONLYWEIRD '26.
//
// These are *supplementary* sign-up channels — the primary path is still the
// custom form at /hackathon/register (the OnlyWorks funnel that issues a
// builder serial + verification). Luma/Eventbrite are for people who want a
// calendar reminder or a familiar ticket flow; surface them, don't lead with
// them. One source of truth so the URLs only ever change in one place.

export interface RsvpLink {
  platform: string
  label: string
  href: string
  note: string
}

export const RSVP_LINKS: RsvpLink[] = [
  {
    platform: 'Luma',
    label: 'RSVP on Luma',
    href: 'https://luma.com/6dddvr5i',
    note: 'Add to calendar + reminders',
  },
  {
    platform: 'Eventbrite',
    label: 'Get a ticket on Eventbrite',
    href: 'https://www.eventbrite.com/e/onlyhacks-tickets-1991858310827?aff=oddtdtcreator',
    note: 'Free ticket + confirmation',
  },
]

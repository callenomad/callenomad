# Fixing the quiz nurture: Emails 2, 3 and 4 in Make.com

## Why only Email 1 sends

Your quiz webhook scenario runs once, the moment someone submits the quiz. It sends Email 1 and then ends. Make has no way to "wait 2 days" inside a single run (its Sleep module stops at 5 minutes), so Emails 2 to 4 never have anything to trigger them.

The fix: save each lead in a Make **Data store** when they arrive, and add a second scenario that runs **once a day**, checks who is due their next email, sends it, and moves them on a step. This stays on the free plan (1,000 credits a month, 1 data store).

## Step 1: create the data store (5 minutes)

Make > Data stores > Add data store. Name it `quiz_leads`. Data structure:

| Field | Type |
| --- | --- |
| email | Text |
| created | Date |
| step | Number |
| source | Text |
| score | Number |
| painPoint | Text |

## Step 2: update the existing quiz scenario (5 minutes)

1. Open the webhook module and click **Redetermine data structure**, then submit the quiz once yourself. The payload now includes a new `source` field (event, linkedin, x, tandem, podcast, newsletter, workshop, instagram, `ref:<website>` or `direct`).
2. After the Email 1 module, add **Data store > Add/replace a record**:
   - Data store: `quiz_leads`
   - Key: `{{email}}` (so a repeat submission does not restart the sequence twice)
   - email `{{email}}`, created `{{now}}`, step `1`, source `{{source}}`, score `{{streetScore}}`, painPoint `{{painPoint}}`
3. Optional but useful: add a Google Sheets or Notion "add row" with the same fields, so you can see leads by source.

## Step 3: new scenario "Quiz nurture: daily" (15 minutes)

1. **Schedule:** every day at 09:00 (America/Bogota).
2. **Module 1: Data store > Search records**, data store `quiz_leads`, filter `step` *Less than* `4`.
3. **Router** with three routes. Put a filter on each route:
   - **Email 2 route:** `step` equal to `1` AND `created` *Earlier than or equal to* `{{addDays(now; -2)}}`
   - **Email 3 route:** `step` equal to `2` AND `created` *Earlier than or equal to* `{{addDays(now; -4)}}`
   - **Email 4 route:** `step` equal to `3` AND `created` *Earlier than or equal to* `{{addDays(now; -6)}}`
4. On each route: the same email module you use for Email 1 (Zoho Mail / SMTP), with that email's subject and body, then **Data store > Update a record**, key `{{1.key}}`, step `2`, `3` or `4`.
5. Turn the scenario **on**.

**To stop emails for someone** (they reply "stop", or they book an audit): open the data store and set their `step` to `99`.

## Step 4: test it in 10 minutes, not 6 days

Submit the quiz with a test address, then in the data store change that record's `created` to 3 days ago. Click **Run once** on the daily scenario: Email 2 should arrive and `step` should change to 2. Set `created` to 5 days ago and run again for Email 3.

## Credits

Each daily run costs about 1 credit for the search, plus about 2 per email sent (send + update). With 50 new leads a month that is roughly 30 + 300 = 330 credits, inside the free 1,000.

## Copy fixes before you switch it on

- The quiz does not ask for a first name, so `{{First Name}}` will print blank. Open with "Hi," or use `{{ifempty(firstName; "there")}}`.
- Replace the `[Your Name]` sign-off with "Kind Regards, Ben Chiverton-Hunt".
- Emails 1 and 3 still lead with Mexico City, Buenos Aires and Madrid. Swap those for Colombian cities, or keep them as "and if you travel on" extras.
- Add one line to the footer of every email: "Reply 'stop' and I'll take you off this list." UK rules on marketing email expect an easy opt-out.

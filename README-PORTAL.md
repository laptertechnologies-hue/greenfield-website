# Greenfield parents' portal app

The portal is a mobile app built into this website. It lives at **/app**
(e.g. `https://yourschool.com/app`) and the same code becomes the Android app.

## What's in it
- Welcome screen, then sign-in with two tabs: **Parent / student** and **Staff**
- **Parents and students:** Home (term average, attendance, fees balance, notices),
  Results (BOT/MOT/EOT marks and grades), Fees (statement and how to pay),
  Attendance (month calendar), More (call school, sign out). Parents with more than
  one child switch between them at the top.
- **Staff / head teacher:** Overview dashboard with student search, Students list
  with class/stream/status filters, each student's results, fees and attendance,
  Marks sheet for entering marks, Fees list of balances, More.

Code: `src/portal/` (screens in `src/portal/screens/`, colours in `portal.css`).

## Demo accounts (remove before going live)
| Who | Login | Password |
|---|---|---|
| Parent (2 children) | 0772000000 | 1234 |
| Student | PC2101 | 1234 |
| Head teacher | headteacher | admin123 |

## Making it live (real data)
All data comes from the `api` object in `src/portal/data.ts`. It currently returns
demo data. Replace each function body with a call to your backend, for example:

```ts
async students() {
  const r = await fetch(`${API}/students`, { headers: { Authorization: `Bearer ${token}` } });
  if (!r.ok) throw new Error('Could not load students');
  return r.json();
}
```
The backend (your existing portal at gfss.portal.laptertech.store, or a new one)
needs endpoints for: sign-in, students, marks, fees, attendance, overview, save marks.
Passwords must be checked on the server, never in this app.

## Running it
```bash
npm install
npm run dev        # open http://localhost:5173/app
npm run build      # website files go to dist/
```

## Publishing to the Google Play Store
The project already uses Capacitor. Inside the Android app, it opens straight into
the portal instead of the website home page.

1. `npm run build`
2. `npx cap sync android`
3. `npx cap open android` (opens Android Studio)
4. In Android Studio set the app icon (right-click `res` > New > Image Asset, use the
   school crest) and bump `versionCode` / `versionName` in `android/app/build.gradle`
   for every new upload.
5. Build > Generate Signed App Bundle > **Android App Bundle (.aab)**. Create a
   keystore and **keep it safe forever**; you need it for every future update.
6. In Google Play Console (one-time US$25 developer account): create the app, upload
   the .aab, fill in the store listing, screenshots, content rating, and the
   **Data safety** form (the app handles children's names, marks and fees, so declare
   that). Use `public/privacy-policy.html` as the privacy policy URL.
7. New personal developer accounts must run a **closed test with at least 12 testers
   for 14 days** before going public; a school/organisation account skips this.

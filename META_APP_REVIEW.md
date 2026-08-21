# Meta app review — what to submit

Copy the text below into Meta's forms. Reviewers reject vague submissions, so
these say plainly what the app does, who uses it, and why the permission is
needed.

---

## Permission requested

**`pages_messaging`**

---

## What does your app do? (app description)

> Hotel The Grand Alayna is a small hotel in Sitakund, Chattogram, Bangladesh.
> This app answers messages sent to our Facebook Page by guests asking about
> rooms, prices, facilities, food and directions.
>
> Most of our enquiries arrive on Messenger, often late at night and mostly in
> Bangla or in Bangla written with English letters. We are a six-room hotel and
> cannot keep someone at the desk answering messages at all hours, so guests were
> waiting hours for a reply and booking elsewhere.
>
> The app replies with information we have written ourselves — our room types,
> our rates, our check-in times, our house rules. It cannot invent an answer. If
> a guest asks something we have not written down, or is ready to book, or is
> unhappy about something, the app stops and passes the conversation to a member
> of our reception team, who replies by hand from the Page inbox.

---

## How will you use this permission? (`pages_messaging`)

> We use `pages_messaging` to receive messages sent to our own Facebook Page and
> to send replies to those guests.
>
> Specifically:
>
> 1. A guest messages the Hotel The Grand Alayna Page asking about a room.
> 2. Our webhook receives the message.
> 3. We reply with the relevant information — the room rate, whether it has air
>    conditioning, what time check-in is — in the same language the guest wrote in.
> 4. If the guest is ready to book, or asks something we cannot answer, we notify
>    our reception staff, who take over the conversation themselves.
>
> We only message people who have messaged our Page first, and only within the
> conversation they started. We do not send marketing messages, promotional
> broadcasts, or any message the guest did not ask for. We do not message anyone
> who has not contacted us.

---

## Are you using an automated experience? Describe it.

> Yes. Replies are generated automatically using an AI service (Anthropic).
>
> The assistant only has access to information we have written for it. It cannot
> see a guest's Facebook profile beyond their name, and it cannot access their
> friends, posts, or any other data.
>
> If a guest asks whether they are talking to a person or a bot, it tells them
> plainly that it is the hotel's automated assistant and that a person from
> reception also sees the conversation. A guest can ask for a person at any time
> and one takes over. Our privacy policy explains this and gives our phone number
> so anyone who prefers to speak to a human can call instead.

---

## What data do you store, and for how long?

> We store the messages exchanged with each guest, their Facebook name and page-
> scoped ID, and any booking details they choose to give us — the dates they
> want, how many people, and a phone number if they share one.
>
> We store these so we can answer properly, remember what was said earlier in the
> conversation, and follow up on a booking the guest started. They are kept while
> useful for serving that guest and deleted when they are not. A guest can ask us
> to delete their information at any time by email or phone, as set out in our
> privacy policy.
>
> We do not use this data for advertising, we do not sell it, and we do not share
> it with anyone other than the services needed to run the hotel (listed in our
> privacy policy).

---

## Privacy policy URL

```
https://hotelthegrandalayna.com/privacy
```

---

## Screencast — what to record

Under a minute, filmed on your phone:

1. Open the chat with your Page
2. Start screen recording
3. Send **"ac room er dam koto?"** — wait for the reply with the rate and link
4. Send **"apnader parking ache?"** — wait for the reply
5. Send **"ami manusher sathe kotha bolte chai"** — show it handing over to a person
6. Stop recording

That third message matters. It shows a reviewer that a guest can always reach a
human, which is the thing they are checking for.

---

## Before submitting, check

- [ ] Privacy policy URL is filled in and the page loads
- [ ] App icon uploaded (1024x1024)
- [ ] Category set
- [ ] Business verification complete, if Meta asks for it
- [ ] Ad account balance paid (this blocked app creation once already)
- [ ] Screencast recorded and uploaded

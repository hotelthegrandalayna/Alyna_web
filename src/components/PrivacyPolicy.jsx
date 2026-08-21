import React from "react";
import "./PrivacyPolicy.css";
import SEO from "./SEO";
import HomeContactHeader from "./HomeContactHeader";

/**
 * Written in plain language on purpose. A privacy policy nobody can read
 * protects nobody — and Meta's reviewers read this page before approving the
 * Messenger assistant, so it describes what actually happens rather than
 * hiding behind boilerplate.
 */
const LAST_UPDATED = "21 August 2026";

const PrivacyPolicy = () => (
  <div className="privacy-wrapper">
    <SEO
      title="Privacy Policy"
      description="How Hotel The Grand Alayna collects, uses and protects your information, including messages sent to us on Facebook Messenger."
      path="/privacy"
    />

    <HomeContactHeader title="Privacy Policy" loading={false} image="" />

    <section className="privacy-content">
      <p className="privacy-updated">Last updated: {LAST_UPDATED}</p>

      <p className="privacy-intro">
        Hotel The Grand Alayna, Ward No. 9, Shibpur, Palli Bidyut Road, Sitakund,
        Chattogram-4310, Bangladesh. This page explains what information we hold
        about you, why we hold it, and what you can ask us to do with it.
      </p>

      <h2>When you message us on Facebook</h2>
      <p>
        Our Facebook Page uses an automated assistant to answer questions about
        rooms, prices, food and directions. If you ask something it cannot answer,
        or if you are ready to book, it passes the conversation to a member of our
        reception team.
      </p>
      <p>When you message the Page, we store:</p>
      <ul>
        <li>The messages you send and the replies we send back</li>
        <li>Your Facebook name and account identifier</li>
        <li>
          Any booking details you give us — the dates you want, how many people
          are coming, which room you prefer, and your phone number if you share it
        </li>
      </ul>
      <p>
        We keep these so we can answer you properly, remember what you told us
        earlier in the conversation, and follow up on a booking you started. We do
        not use them for advertising and we do not sell them to anyone.
      </p>

      <h2>The automated assistant</h2>
      <p>
        To write its replies, the assistant sends your messages to Anthropic, the
        company that provides the AI service behind it. Anthropic processes the
        message to produce a reply and does not use it to train their models.
      </p>
      <p>
        The assistant can only tell you things we have written down for it —
        prices, facilities, our rules. It cannot see your Facebook profile beyond
        your name, and it cannot access anything else about you.
      </p>
      <p>
        If you would rather not talk to an automated assistant, say so and a
        person will take over, or call reception directly on +8801883352526.
      </p>

      <h2>When you book a room</h2>
      <p>
        For a booking we need your name, phone number, and the dates of your stay.
        At check-in, Bangladeshi rules require us to record the national ID number
        of every guest staying in the hotel.
      </p>

      <h2>When you use this website</h2>
      <p>
        The website shows you our rooms, prices and photographs. It does not ask
        you to create an account and it does not track you across other websites.
      </p>

      <h2>Who else can see your information</h2>
      <p>We use a small number of services to run the hotel and this website:</p>
      <ul>
        <li>
          <strong>Meta (Facebook)</strong> — carries the messages you send to our
          Page, under their own privacy policy
        </li>
        <li>
          <strong>Anthropic</strong> — provides the AI that writes the assistant's
          replies
        </li>
        <li>
          <strong>Supabase</strong> — stores our website content and the
          conversations described above
        </li>
        <li>
          <strong>Netlify</strong> — hosts this website
        </li>
      </ul>
      <p>
        Beyond these, we share your information with nobody. We do not sell it,
        rent it, or pass it to other hotels or travel agents.
      </p>

      <h2>How long we keep it</h2>
      <p>
        Messenger conversations and booking enquiries are kept while they are
        useful for serving you, and removed when they are not. Records we are
        required to keep for tax or legal reasons are kept for as long as the law
        requires.
      </p>

      <h2>What you can ask us to do</h2>
      <p>You can ask us at any time to:</p>
      <ul>
        <li>Tell you what information we hold about you</li>
        <li>Correct anything that is wrong</li>
        <li>Delete your messages and enquiry details</li>
      </ul>
      <p>
        Email <a href="mailto:info@hotelthegrandalayna.com">info@hotelthegrandalayna.com</a>{" "}
        or call <a href="tel:+8801883352526">+8801883352526</a> and we will do it.
        You do not need to give a reason.
      </p>

      <h2>Children</h2>
      <p>
        This website and our Page are not intended for children under 13, and we
        do not knowingly collect their information.
      </p>

      <h2>Changes to this page</h2>
      <p>
        If we change how we handle your information, we will update this page and
        change the date at the top.
      </p>

      <h2>Contact us</h2>
      <p>
        Hotel The Grand Alayna
        <br />
        Ward No. 9, Shibpur, Palli Bidyut Road
        <br />
        Sitakund, Chattogram-4310, Bangladesh
        <br />
        <a href="mailto:info@hotelthegrandalayna.com">info@hotelthegrandalayna.com</a>
        <br />
        <a href="tel:+8801883352526">+8801883352526</a>
      </p>
    </section>
  </div>
);

export default PrivacyPolicy;

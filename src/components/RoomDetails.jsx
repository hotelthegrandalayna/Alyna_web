import React from "react";
import "./RoomDetails.css";
import { LuChefHat } from "react-icons/lu";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import HomeContactHeader from "./HomeContactHeader";
import { FaPhone } from "react-icons/fa6";

const RoomDetails = () => {
  // Internet dummy images for the room and thumbnails
  const mainRoomImg =
    "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80";
  const thumbImg =
    "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80";

  return (
    <div className="room-page">
      {/* <div className="breadcrumb-banner">
        <div className="container">
          <span>Home</span> / <span className="active">Superior Room-Camp</span>
        </div>
      </div> */}
      <HomeContactHeader />

      <div className="container main-content">
        <div className="room-grid">
          {/* Left Column: Images and Description */}
          <div className="room-info">
            <div className="main-image-container">
              <img
                src={mainRoomImg}
                alt="Superior Room"
                className="main-room-img"
              />
              <div className="thumbnails">
                <img src={thumbImg} alt="thumb" />
                <img src={thumbImg} alt="thumb" className="selected-thumb" />
                <img src={thumbImg} alt="thumb" />
              </div>
            </div>

            <div className="room-text">
              <p>
                Attractively ornamented with complete marble & tiles and
                luxurious fabrics, our two prominent Presidential suites are
                1500-1800 sq ft. These two unique suites boast an octagonal
                living area, the sides of which are fitted with windows
                overlooking the sea, the Bay of Bengal for the best views in the
                city.
              </p>
            </div>
            <div className="booking-card-container">
              <div className="outer-glow-border"></div>

              <div className="main-booking-box">
                <div className="content-left">
                  <div className="phone-icon-box">
                    <FaPhone fontSize={"40px"} color="orange" />
                  </div>

                  <div className="cta-and-number">
                    <p className="cta-text">CALL TO CONFIRM BOOKING !</p>

                    <div className="floating-number-box">
                      <span className="phone-number">01878150350</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Features and Booking */}
          <div className="room-sidebar">
            <div className="complimentary-section">
              <div className="complimentary-header">
                <LuChefHat size="24px" />
                <span>COMPLIMENTARY</span>
              </div>
              <ul>
                <li>Breakfast for 4 pax</li>
                <li>Welcome drink (on arrival)</li>
                <li>Bus-stop pick-up (on demand)</li>
                <li>Mineral water 500ml x 2 bottles</li>
                <li>Internet in the rooms & lobby</li>
              </ul>
            </div>

            <div className="availability-card">
              <h5>CHECK AVAILABILITY</h5>
              <div className="calendar-ui">
                <div className="cal-header">
                  <span>&lt;</span> January 2024 <span>&gt;</span>
                </div>

                <div className="cal-days">
                  <span>Mo</span>
                  <span>Tu</span>
                  <span>We</span>
                  <span>Th</span>
                  <span>Fr</span>
                  <span>Sa</span>
                  <span>Su</span>
                  <span className="empty"></span>
                  <span className="empty"></span>
                  <span className="empty"></span>
                  <span>1</span>
                  <span>2</span>
                  <span>3</span>
                  <span>4</span>
                  <span>5</span>
                  <span className="booked">6</span>
                  <span>7</span>
                  <span className="booked">8</span>
                  <span>9</span>
                  <span>10</span>
                  <span>11</span>
                </div>
              </div>
              {/* <Calendar onChange={setDate} value={date}  /> */}

              {/* <p className="selected-date">
                Selected Date: {date.toDateString()}
              </p> */}
              <div className="cal-legend">
                <p>
                  <span className="dot red"></span> All deluxe rooms are booked
                  this day
                </p>
                <p>
                  <span className="dot orange"></span> Most of the deluxe rooms
                  are booked
                </p>
                <p>
                  <span className="dot green"></span> Most of the deluxe rooms
                  are free to book
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;

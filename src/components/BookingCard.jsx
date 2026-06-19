import React from "react";
import "./BookingCard.css";

const BookingCard = ({ price = 2000, onBookNow }) => {
  return (
    <div className="booking-card">
      <div className="booking-header">
        <h2 className="booking-title">Booking</h2>
        <div className="booking-price">
          <span>From </span>
          <span className="price-amount">৳{price}</span>
          <span>/ night</span>
        </div>
      </div>
      <button className="book-now-btn" onClick={onBookNow}>
        BOOK NOW
      </button>
    </div>
  );
};

export default BookingCard;

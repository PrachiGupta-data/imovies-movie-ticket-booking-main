import React from 'react';

// Standard 8 rows x 8 seats layout with aisle
const ROW_CONFIG = [
  { row: 'A', tier: 'VIP', priceMultiplier: 'vip' },
  { row: 'B', tier: 'VIP', priceMultiplier: 'vip' },
  { row: 'C', tier: 'Premium', priceMultiplier: 'premium' },
  { row: 'D', tier: 'Premium', priceMultiplier: 'premium' },
  { row: 'E', tier: 'Premium', priceMultiplier: 'premium' },
  { row: 'F', tier: 'Regular', priceMultiplier: 'regular' },
  { row: 'G', tier: 'Regular', priceMultiplier: 'regular' },
  { row: 'H', tier: 'Regular', priceMultiplier: 'regular' },
];

const SEATS_PER_ROW = 8;

function SeatMatrix({ bookedSeats = [], selectedSeats = [], onToggleSeat, ticketPrices }) {
  const getSeatPrice = (tierKey) => {
    return ticketPrices?.[tierKey] || 250;
  };

  const handleSeatClick = (seatId, tier, price) => {
    if (bookedSeats.includes(seatId)) return;
    onToggleSeat({ seatNumber: seatId, tier, price });
  };

  return (
    <div className="seat-matrix-wrapper text-center my-4">
      {/* Screen Indicator */}
      <div className="mb-4">
        <div className="theatre-screen-curve mx-auto w-75"></div>
        <div className="text-primary text-uppercase fw-bold tracking-wider small opacity-75">
          <i className="bi bi-display me-2"></i> All Eyes This Way • Cinema Screen
        </div>
      </div>

      {/* Seat Rows by Tier */}
      <div className="d-flex flex-column align-items-center gap-3">
        {['VIP', 'Premium', 'Regular'].map((tierName) => {
          const tierRows = ROW_CONFIG.filter((r) => r.tier === tierName);
          const tierKey = tierRows[0].priceMultiplier;
          const tierPrice = getSeatPrice(tierKey);

          return (
            <div key={tierName} className="tier-section w-100 mb-2">
              <div className="d-flex align-items-center justify-content-center gap-3 mb-2">
                <span className={`badge ${
                  tierName === 'VIP'
                    ? 'badge-gold'
                    : tierName === 'Premium'
                    ? 'badge-cyan'
                    : 'bg-light text-dark border'
                } px-3 py-1`}>
                  {tierName} (₹{tierPrice})
                </span>
                <div className="border-bottom border-light flex-grow-1" style={{ maxWidth: '240px' }}></div>
              </div>

              {tierRows.map(({ row, priceMultiplier }) => (
                <div key={row} className="d-flex justify-content-center align-items-center gap-2 mb-1">
                  <span className="text-secondary fw-bold small me-2" style={{ width: '18px' }}>
                    {row}
                  </span>

                  {/* Left Aisle */}
                  <div className="d-flex">
                    {Array.from({ length: SEATS_PER_ROW / 2 }, (_, i) => {
                      const seatNum = i + 1;
                      const seatId = `${row}${seatNum}`;
                      const isBooked = bookedSeats.includes(seatId);
                      const isSelected = selectedSeats.some((s) => s.seatNumber === seatId);

                      let seatClass = 'seat ';
                      if (isBooked) seatClass += 'booked';
                      else if (isSelected) seatClass += 'selected';
                      else seatClass += 'available';

                      return (
                        <div
                          key={seatId}
                          className={seatClass}
                          title={`${seatId} - ${tierName} (₹${tierPrice})${isBooked ? ' [Booked]' : ''}`}
                          onClick={() => handleSeatClick(seatId, tierName, tierPrice)}
                        >
                          {seatNum}
                        </div>
                      );
                    })}
                  </div>

                  {/* Center Aisle Spacer */}
                  <div className="mx-2" style={{ width: '24px' }}></div>

                  {/* Right Aisle */}
                  <div className="d-flex">
                    {Array.from({ length: SEATS_PER_ROW / 2 }, (_, i) => {
                      const seatNum = i + 1 + SEATS_PER_ROW / 2;
                      const seatId = `${row}${seatNum}`;
                      const isBooked = bookedSeats.includes(seatId);
                      const isSelected = selectedSeats.some((s) => s.seatNumber === seatId);

                      let seatClass = 'seat ';
                      if (isBooked) seatClass += 'booked';
                      else if (isSelected) seatClass += 'selected';
                      else seatClass += 'available';

                      return (
                        <div
                          key={seatId}
                          className={seatClass}
                          title={`${seatId} - ${tierName} (₹${tierPrice})${isBooked ? ' [Booked]' : ''}`}
                          onClick={() => handleSeatClick(seatId, tierName, tierPrice)}
                        >
                          {seatNum}
                        </div>
                      );
                    })}
                  </div>

                  <span className="text-secondary fw-bold small ms-2" style={{ width: '18px' }}>
                    {row}
                  </span>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="d-flex justify-content-center align-items-center gap-4 mt-4 pt-3 border-top flex-wrap">
        <div className="d-flex align-items-center gap-2">
          <div className="seat available" style={{ width: '22px', height: '22px' }}></div>
          <span className="small text-secondary">Available</span>
        </div>
        <div className="d-flex align-items-center gap-2">
          <div className="seat selected" style={{ width: '22px', height: '22px' }}></div>
          <span className="small text-dark fw-semibold">Selected</span>
        </div>
        <div className="d-flex align-items-center gap-2">
          <div className="seat booked" style={{ width: '22px', height: '22px' }}></div>
          <span className="small text-secondary">Sold Out</span>
        </div>
      </div>
    </div>
  );
}

export default SeatMatrix;

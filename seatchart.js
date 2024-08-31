const seatingChart = document.getElementById('seating-chart');
const selectedSeatsContainer = document.getElementById('selected-seats');
const totalPriceElem = document.getElementById('total-price');
const ticketTypeElem = document.getElementById('ticket-type');
const citySelect = document.getElementById('city');
const dateInput = document.getElementById('date');
const timeInput = document.getElementById('time');
const formatSelect = document.getElementById('format');

// Define the available times
const availableTimes = ['12:00', '15:00', '18:00', '21:00'];

// Retrieve available dates and reserved seats from LocalStorage, or initialize with default values
const availableDates = JSON.parse(localStorage.getItem('availableDates')) || ['2024-09-01', '2024-09-02', '2024-09-03'];
const reservedSeats = JSON.parse(localStorage.getItem('reservedSeats')) || {
    '2024-09-01': [{ row: 1, seat: 1 }, { row: 2, seat: 5 }],
    '2024-09-02': [{ row: 3, seat: 7 }],
    '2024-09-03': [{ row: 10, seat: 12 }]
};

const seats = [];
let selectedSeats = JSON.parse(localStorage.getItem('selectedSeats')) || [];
let totalPrice = parseFloat(localStorage.getItem('totalPrice')) || 0;
let selectedDate = localStorage.getItem('selectedDate') || '';
let selectedCity = localStorage.getItem('selectedCity') || '';
let selectedTime = localStorage.getItem('selectedTime') || '';
let selectedFormat = localStorage.getItem('selectedFormat') || '2D';

// Initialize form values based on localStorage
dateInput.value = selectedDate;
citySelect.value = selectedCity;
timeInput.value = selectedTime;
formatSelect.value = selectedFormat;

// Populate the time input with available times

function populateTimeOptions() {
    availableTimes.forEach(time => {
        const option = document.createElement('option');
        option.value = time;
        option.textContent = time;
        timeInput.appendChild(option);
    });
}

// Initialize form with available options
populateTimeOptions();
timeInput.value = selectedTime;

dateInput.addEventListener('change', () => {
    const newDate = dateInput.value;
    if (!availableDates.includes(newDate)) {
        alert("Selected date is not available for booking.");
        dateInput.value = ""; // Clear the selected date
    } else {
        localStorage.setItem('selectedDate', newDate);
        generateSeatingChart(); // Regenerate the seating chart for the selected date
    }
});

citySelect.addEventListener('change', () => {
    const city = citySelect.value;
    localStorage.setItem('selectedCity', city);
});

timeInput.addEventListener('change', () => {
    const time = timeInput.value;
    if (!availableTimes.includes(time)) {
        alert("Selected time is not available.");
        timeInput.value = ""; // Clear the selected time
    } else {
        localStorage.setItem('selectedTime', time);
    }
});

formatSelect.addEventListener('change', () => {
    const format = formatSelect.value;
    localStorage.setItem('selectedFormat', format);
    // Optionally, you can regenerate the seating chart if format affects seat availability
    generateSeatingChart();
});

function generateSeatingChart() {
    seatingChart.innerHTML = ""; // Clear the previous seating chart
    const reservedForDate = reservedSeats[selectedDate] || [];

    for (let row = 1; row <= 15; row++) {
        for (let seatNum = 1; seatNum <= 12; seatNum++) {
            const seat = document.createElement('div');
            seat.classList.add('seat');
            seat.dataset.row = row;
            seat.dataset.seat = seatNum;
            seat.dataset.price = ticketTypeElem.value;

            const isReserved = reservedForDate.some(rs => rs.row == row && rs.seat == seatNum);
            const isSelected = selectedSeats.some(ss => ss.row == row && ss.seat == seatNum);

            if (isReserved) {
                seat.classList.add('reserved');
                seat.innerHTML = `<span>${seatNum}</span><div class="tooltip">Row: ${row}<br>Seat: ${seatNum}<br>Reserved</div>`;
            } else {
                seat.innerHTML = `<span>${seatNum}</span><div class="tooltip">Row: ${row}<br>Seat: ${seatNum}<br>Price: $${seat.dataset.price}</div>`;
                if (isSelected) {
                    seat.classList.add('selected');
                }
                seat.addEventListener('click', () => toggleSeatSelection(seat));
            }
            seatingChart.appendChild(seat);
            seats.push(seat);
        }
    }
    updateBookingInfo(); // Update the booking info after generating the chart
}

function toggleSeatSelection(seat) {
    const seatPrice = parseFloat(seat.dataset.price);
    const seatData = { row: seat.dataset.row, seat: seat.dataset.seat };

    if (seat.classList.contains('selected')) {
        seat.classList.remove('selected');
        seat.style.backgroundColor = ""; // Reset to default background color
        selectedSeats = selectedSeats.filter(ss => ss.row != seatData.row || ss.seat != seatData.seat);
        totalPrice -= seatPrice;
    } else {
        seat.classList.add('selected');
        seat.style.backgroundColor = "#87CEFA"; // Set a light blue background color when selected
        selectedSeats.push(seatData);
        totalPrice += seatPrice;
    }

    localStorage.setItem('selectedSeats', JSON.stringify(selectedSeats));
    localStorage.setItem('totalPrice', totalPrice.toFixed(2));
    updateBookingInfo();
}

function updateBookingInfo() {
    // Just update the total price without displaying the selected seats
    totalPriceElem.textContent = totalPrice.toFixed(2);
}

function proceedToCheckout() {
    const city = citySelect.value;
    const date = dateInput.value;
    const time = timeInput.value;
    const format = formatSelect.value;

    if (!date || !availableDates.includes(date)) {
        alert("Please select a valid date.");
        return;
    }
    if (!availableTimes.includes(time)) {
        alert("Please select a valid time.");
        return;
    }

    alert(`Proceeding to checkout with total: $${totalPrice.toFixed(2)}\nCity: ${city}\nDate: ${date}\nTime: ${time}\nFormat: ${format}`);
  
    window.location.href = 'success.html'; // Redirect to the success page

    // Clear the local storage after proceeding to checkout
    localStorage.removeItem('selectedSeats');
    localStorage.removeItem('totalPrice');
    localStorage.removeItem('selectedDate');
    localStorage.removeItem('selectedCity');
    localStorage.removeItem('selectedTime');
    localStorage.removeItem('selectedFormat');
    selectedSeats = [];
    totalPrice = 0;
    updateBookingInfo();
}

// Restore the selected date from local storage if available
if (localStorage.getItem('selectedDate')) {
    dateInput.value = localStorage.getItem('selectedDate');
    generateSeatingChart();
}

ticketTypeElem.addEventListener('change', () => {
    seats.forEach(seat => {
        if (!seat.classList.contains('reserved')) {
            seat.dataset.price = ticketTypeElem.value;
            const tooltip = seat.querySelector('.tooltip');
            tooltip.innerHTML = `Row: ${seat.dataset.row}<br>Seat: ${seat.dataset.seat}<br>Price: $${ticketTypeElem.value}`;
        }
    });
    totalPrice = 0;
    selectedSeats.length = 0;
    updateBookingInfo();
    localStorage.removeItem('selectedSeats');
    localStorage.removeItem('totalPrice');
});

generateSeatingChart();



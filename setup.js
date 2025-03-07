document.addEventListener("DOMContentLoaded", () => {
    let flights = JSON.parse(localStorage.getItem("flights")) || [];
    let schedule = document.getElementById("schedule");
    let aircraftList = ["G-PJCD", "G-PJCM", "G-PJCN", "G-PJCS"];

    let columnWidth = document.querySelector(".grid-cell").offsetWidth;
    let rowHeight = document.querySelector(".grid-cell").offsetHeight;
    let aircraftLabelHeight = document.querySelector(".aircraft-label").offsetHeight;

    // Set up the schedule container to use flexbox and wrap items
    schedule.style.display = "flex";
    schedule.style.flexWrap = "wrap";
    schedule.style.gap = "10px"; // Optional: Adjust gap between items

    // Remove any existing flight entries
    document.querySelectorAll(".flight").forEach(flight => flight.remove());

    flights.forEach(flight => {
        let aircraftIndex = aircraftList.indexOf(flight.aircraft);
        if (aircraftIndex !== -1) {
            let flightDiv = document.createElement("div");
            flightDiv.classList.add("flight");

            // Use flexbox for flight items
            flightDiv.style.flexBasis = "calc(33.33% - 10px)"; // 3 items per row
            flightDiv.style.position = "relative"; // Positioning to use absolute inside flight entry

            // Adjust positioning based on flight times (no need for absolute positioning anymore)
            let leftPos = (flight.startHour * 2) * columnWidth;
            let width = ((flight.endHour - flight.startHour) * 2) * columnWidth;
            let topPos = aircraftLabelHeight + (aircraftIndex * rowHeight);

            flightDiv.style.left = `${leftPos + 150}px`;
            flightDiv.style.width = `${width}px`;
            flightDiv.style.height = `${rowHeight - 11}px`;
            flightDiv.style.top = `${Math.round(topPos - aircraftLabelHeight * 5 + 3 - aircraftIndex * 0.5)}px`;

            // Function to format time (displaying in HH:MM format)
            function formatTime(hourDecimal) {
                let hour = Math.floor(hourDecimal);
                let minutes = Math.round((hourDecimal % 1) * 60);
                return `${hour}:${minutes.toString().padStart(2, "0")}`;
            }

            // Flight div content
            flightDiv.innerHTML = `
                <span class="passengers-out">${flight.passengersOut}</span>
                <span class="passengers-in">${flight.passengersIn}</span>
                <span class="flight-label">${flight.aircraft}</span>
                <span class="flight-time start-time">${formatTime(flight.startHour)}</span>
                <span class="flight-time end-time">${formatTime(flight.endHour)}</span>
                <span class="route">${flight.route}</span>
                <span class="pilots">${flight.pilot1}, ${flight.pilot2}</span>
                <span class="category">${flight.category || "N/A"}</span>
            `;

            // Append flight div to the schedule container
            schedule.appendChild(flightDiv);
            console.log("Rendering flight:", flight);
            console.log("Category:", flight.category);
        }
    });

    // Function to update the current time indicator
    function updateCurrentTimeIndicator() {
        let now = new Date();
        let currentHour = now.getHours() + now.getMinutes() / 60;
        let leftPos = (currentHour * 2) * columnWidth + 150;

        let indicator = document.getElementById("currentTimeIndicator");
        if (indicator) {
            indicator.style.left = `${leftPos}px`;
        }
    }

    // Update the current time indicator every minute
    updateCurrentTimeIndicator();
    setInterval(updateCurrentTimeIndicator, 60000);

    // Scroll the schedule container to the current time
    let now = new Date();
    let currentHour = now.getHours() + now.getMinutes() / 60;
    let scrollPos = (currentHour / 24) * (columnWidth * 48) - window.innerWidth / 2;
    document.getElementById("scheduleContainer").scrollLeft = scrollPos;

    // Add style to flight entries
    let style = document.createElement("style");
    style.innerHTML = `
        .flight {
            background: blue;
            color: white;
            text-align: center;
            border-radius: 5px;
            font-size: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            padding: 4px;
        }
        .flight-time {
            font-size: 18px;
            position: absolute;
            bottom: 3px;
        }
        .start-time {
            left: 5px;
        }
        .end-time {
            right: 5px;
        }
        .passengers-out {
            position: absolute;
            top: 3px;
            left: 5px;
            font-size: 16px;
            font-weight: bold;
        }
        .passengers-in {
            position: absolute;
            top: 3px;
            right: 5px;
            font-size: 16px;
            font-weight: bold;
        }
        .route {
            font-size: 18px;
            margin-top: 5px;
        }
        .pilots {
            font-size: 16px;
            margin-top: 3px;
            font-weight: normal;
        }
        .category {
            position: absolute;
            bottom: 5px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 16px;
            font-weight: bold;
        }
    `;
    document.head.appendChild(style);
});

document.addEventListener("DOMContentLoaded", () => {
    let flights = [];
    

    // Fetch flight data 
    async function fetchFlights() {
    try {
        const response = await fetch('/api/flights', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            const data = await response.json();
            flights = data || [];
            console.log(flights); // Log the fetched flight data
            renderFlights(); // Render after fetching data
        } else {
            console.error("Failed to fetch flight data:", 
response.statusText);
        }
    } catch (error) {
        console.error("Error fetching flight data:", error);
    }
}

    let schedule = document.getElementById("schedule");
    let aircraftList = ["G-PJCD", "G-PJCM", "G-PJCN", "G-PJCS"];

    function timeToDecimal(timeStr) {
        if (!timeStr) return null;
        let [hours, minutes] = timeStr.split(":").map(Number);
        return hours + minutes / 60;
    }

    let columnWidth = document.querySelector(".grid-cell")?.offsetWidth || 
160;
    let rowHeight = document.querySelector(".grid-cell")?.offsetHeight || 
160;
    let aircraftLabelHeight = 
document.querySelector(".aircraft-label")?.offsetHeight || 40;

    // Function to render flights
    function renderFlights() {
        // Clear existing flights
        document.querySelectorAll(".flight").forEach(flight => 
flight.remove());

        // Track used top positions for each aircraft
        let aircraftFlightPositions = {};

        flights.forEach(flight => {
            let aircraftIndex = aircraftList.indexOf(flight.aircraft);
            if (aircraftIndex !== -1) {
                let startHour = timeToDecimal(flight.startTime);
                let endHour = timeToDecimal(flight.endTime);

                // Log the calculated positions
                let leftPos = (startHour * 2) * columnWidth;
                let width = ((endHour - startHour) * 2) * columnWidth;
                let topPos = Math.round(aircraftLabelHeight + 
(aircraftIndex * rowHeight) - 122);

                // Adjust the first few rows slightly if necessary
                if (aircraftIndex === 0) {
                    topPos -= -1;  // Fine-tune the first row
                } else if (aircraftIndex === 1) {
                    topPos -= -1;  // Fine-tune the second row
                }

                console.log(`Flight: ${flight.route}, leftPos: ${leftPos}, 
width: ${width}, topPos: ${topPos}`);

                // Create flight div
                let flightDiv = document.createElement("div");
                flightDiv.classList.add("flight");
                flightDiv.style.left = `${leftPos + 150}px`;  // Adjust 
                flightDiv.style.width = `${width}px`;
                flightDiv.style.height = `${rowHeight - 11}px`;
                flightDiv.style.top = `${Math.round(topPos)}px`;

                // Add flight information
                flightDiv.innerHTML = `
                    <span 
class="passengers-out">${flight.passengersOut}</span>
                    <span 
class="passengers-in">${flight.passengersIn}</span>
                    <span class="flight-time 
start-time">${flight.startTime}</span>
                    <span class="flight-time 
end-time">${flight.endTime}</span>
                    <span class="route">${flight.route}</span>
                    <span class="pilots">${flight.pilot1} - 
${flight.pilot2}</span>
                    <span class="category">${flight.category ? 
flight.category : " "}</span>
                `;

                // Determine the color based on the flight status
                let statusColor = 'green'; // Default status is 'Normal'
                switch (flight.status) {
                    case 'Flying':
                        statusColor = 'blue';
                        break;
                    case 'Hold':
                        statusColor = 'orange';
                        break;
                    case 'Complete':
                        statusColor = 'grey';
                        break;
                    case 'Normal':
                    default:
                        statusColor = 'green';
                        break;
                }

                // Set the background color of the flight based on its 

                flightDiv.style.backgroundColor = statusColor;

                // Append the flight to the schedule
                schedule.appendChild(flightDiv);
            }
        });
    }

    // Initial fetch of flights and render them
    fetchFlights();

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

    updateCurrentTimeIndicator();
    setInterval(updateCurrentTimeIndicator, 60000);

    let now = new Date();
    let currentHour = now.getHours() + now.getMinutes() / 60;
    let scrollPos = (currentHour / 24) * (columnWidth * 48) - 
window.innerWidth / 6;
    console.log(`scrollPos: ${scrollPos}`);  // Log the calculated scroll 

    document.getElementById("scheduleContainer").scrollLeft = scrollPos;

    // Add dynamic CSS styles
    let style = document.createElement("style");
    style.innerHTML = `
        .flight {
            position: absolute;
            color: white;
            text-align: center;
            border-radius: 5px;
            font-size: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            padding: 4px;
            visibility: visible; /* Ensure flights are visible */
            z-index: 1; /* Ensure flights appear above other elements */
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
            font-weight: bold;
        }
        .pilots {
            font-size: 16px;
            margin-top: 3px;
            font-weight: normal;
        }
        /* Ensure the current time marker appears above the flights */
    #currentTimeIndicator {
        z-index: 2; /* Higher than the flight blocks */
        position: absolute;
        background-color: red;
        width: 2px;
        height: 100%;
    }
        .category {
            font-size: 16px;
            position: absolute;
            bottom: 2px;
            left: 50%;
            transform: translateX(-50%);
            font-weight: bold;
            white-space: nowrap;
        }
    `;
    document.head.appendChild(style);

    // Add event listener for storage changes to auto-update the flights 
    window.addEventListener("storage", function(e) {
        if (e.key === "flights") {
            renderFlights(); // Re-render the flights if the flight data 
        }
    });

    // Horizontal scrolling with the mouse wheel
    document.getElementById("scheduleContainer").addEventListener("wheel", 
function(e) {
        if (e.deltaY !== 0) {
            this.scrollLeft += e.deltaY; // Adjust the speed by 
        }
    }, { passive: true });
});

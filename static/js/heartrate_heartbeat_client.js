function initHeartrateHeartbeat(parent) {
    getLatestHeartrate()
    .then((data) => update(parent, data));
}

function getLatestHeartrate() {
   return fetch('https://heartbeat.home.adishy.com/get_last')
          .then(response => {
		if ( response.ok ) return response.json();
                return { error: response.text() }
	  })
}

function update(parent, data) {
     data = JSON.parse(data);
     let heartRate = parseInt(data.heart_rate);
     let recordedTimestamp = parseInt(data.recorded_timestamp) * 1000; // recordedTimestamp generated from Swift timeIntervalSince1970
     recordedTimestamp = new Date(recordedTimestamp)
     let dateOptions = {
			    day: 'numeric',
    			    month: 'short',
    			    year: 'numeric',
    			    hour: '2-digit',
    			    minute: '2-digit',
    			    hour12: true
		      };
     let recordedTimestampFmt = recordedTimestamp.toLocaleDateString('en-US', dateOptions);
     let capitalized = "";
     for (let i = 0; i < recordedTimestampFmt.length; i++) {
	capitalized += recordedTimestampFmt[i].toUpperCase();
     }
     recordedTimestampFmt = capitalized;
     let status = "ALL SYSTEMS NOMINAL";
     if ( data.hasOwnProperty("error") ) { 
	status = "SYSTEMS UNHEALTHY";
 	console.error(data);
     }
     render(parent, heartRate, recordedTimestampFmt, status);
}

function render(parent, heartRate, timestampFmt, status) {
 let styles = `
	   @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;600;700&display=swap');

	   .heartrate_heartbeat_show {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: center;
	   }

           .heartrate_heartbeat_show p{
		font-family: 'Be Vietnam Pro', sans-serif;
		font-size: 14px;
		font-weight: 700;
		padding-left: 10px;
		color: #5a5a5a;
	   }

	   .heartrate_heartbeat_show .bpm_value {
	       color: #919191;
	    }

	   .heartrate_heartbeat_show .heart {
	      fill: #e70b39;
	      position: relative;
	      width: 22px;
       	      padding-left: 10px;
	      animation: pulse ${Math.round((60/heartRate + Number.EPSILON) * 100) / 100}s ease infinite;
	    }

	    @keyframes pulse {
	       0% { transform: scale(1); }
	       50% { transform: scale(1.3); }
	       100% { transform: scale(1); }
	     }
 `;

let styleElement = document.querySelector("style");
if ( !styleElement ) {
    let globalStyle = document.createElement("style");
    globalStyle.type = "text/css";
    let documentHead = document.querySelector("head");
    documentHead.appendChild(globalStyle);
    styleElement = globalStyle; 
}

styleElement.appendChild(document.createTextNode(styles));

 let html = 
	`<div class="heartrate_heartbeat_show">
		<svg class="heart" viewBox="0 0 32 29.6"><path d="M23.6,0c-3.4,0-6.3,2.7-7.6,5.6C14.7,2.7,11.8,0,8.4,0C3.8,0,0,3.8,0,8.4c0,9.4,9.5,11.9,16,21.2c6.1-9.3,16-12.1,16-21.2C32,3.8,28.2,0,23.6,0z"/></svg> 
		<p><span class="bpm_value">${heartRate}</span> BPM</p>
		<p>${timestampFmt}</p>
		<p>${status}</p>
	</div>`;
  parent.innerHTML = html;
}



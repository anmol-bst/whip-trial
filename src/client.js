import { WHIPClient } from "@eyevinn/whip-web-client"
import React, { useEffect, useState } from "react";

// type JwtToken = {
//     exp?: number,
//     iat?: number,
//     jti?: string,
//     resource?: string,
//     topic?: string,
//     events_url?: string,
//     whip_url?: string,
//     user_id?: string,
//     capabilities?: {
//       allow_publish: boolean,
//       allow_subscribe: boolean,
//     },
// };

const Button = () => {
    const [participantToken, setParticipantToken] = useState("");

  
    const parseJwt = (token) => {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace('-', '+').replace('_', '/');
        const json = JSON.parse(atob(base64));
        return {
          whip_url: json.whip_url,
        };
    };
    
    const joinStage = async () => {
        const jwt = parseJwt(participantToken);
        console.log("AJSP", jwt);
        const client = new WHIPClient({
            endpoint: jwt.whip_url || "http://<host>/whip/broadcaster",
            opts: { debug: true, iceServers: [{ urls: "stun:stun.l.google.com:19320" }] }
        });
        await client.setIceServersFromEndpoint();
        
        const videoIngest = document.querySelector<HTMLVideoElement>("video#ingest");
        const mediaStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
        });
        // const displayStream = await navigator.mediaDevices.getDisplayMedia({
        //     video: true,
        //     audio: true,
        // });
        if (videoIngest)
            videoIngest.srcObject = mediaStream;
        await client.ingest(mediaStream);
    };

    return (
        <div className="row">
            <label>{`Participant Token`}</label>
            <input
                value={participantToken}
                onChange={(e) => { setParticipantToken(e.target.value)}}
                style={{ margin: '0px 8px', height: '24px', transform: 'translateY(-6px)' }}
            />
            <div className="button-container row" >
                <button
                    className="button margin-right"
                    onClick={joinStage}
                >
                    Join
                </button>
            </div>
            <br />
      </div>
    );
};

export default Button;
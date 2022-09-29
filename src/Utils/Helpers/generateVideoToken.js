import { KJUR } from "jsrsasign";

export default function generateVideoToken(
  topic,
  passWord = "",
  sessionKey = "",
  userIdentity = "",
  roleType = 1,
) {
  let signature = "";
  try {
    const iat = Math.round(new Date().getTime() / 1000);
    const exp = iat + 60 * 60 * 2;

    // Header
    const oHeader = { alg: "HS256", typ: "JWT" };
    // Payload
    const oPayload = {
      app_key: import.meta.env.VITE_ZOOM_VIDEO_SDK_KEY,
      iat,
      exp,
      tpc: topic,
      pwd: passWord,
      user_identity: userIdentity,
      session_key: sessionKey,
      role_type: roleType, // role=1, host, role=0 is attendee, only role=1 can start session when session not start
    };
    const sHeader = JSON.stringify(oHeader);
    const sPayload = JSON.stringify(oPayload);
    signature = KJUR.jws.JWS.sign(
      "HS256",
      sHeader,
      sPayload,
      import.meta.env.VITE_ZOOM_VIDEO_SDK_SECRET,
    );
  } catch (e) {
    console.error(e);
  }
  return signature;
}

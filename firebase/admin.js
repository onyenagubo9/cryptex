import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      type: "service_account",
      project_id: "cryptex-c81cb",
      private_key_id: "64f3ea8d79cd66bb757ffa6bd89b92fb7a5d6c2b",
      private_key: `-----BEGIN PRIVATE KEY-----
MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDEtcvqwJVKac7/
...YOUR KEY...
-----END PRIVATE KEY-----`,
      client_email: "firebase-adminsdk-fbsvc@cryptex-c81cb.iam.gserviceaccount.com",
      client_id: "118046624300175264758",
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40cryptex-c81cb.iam.gserviceaccount.com"
    }),
  });
}

export default admin;

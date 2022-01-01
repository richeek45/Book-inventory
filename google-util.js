const { google } = require("googleapis");
const axios = require("axios");
const fs = require("fs");
const { refresh_token } = require("./token.json");

let oauth2Client = new google.auth.OAuth2({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  /*
   * This is where Google will redirect the user after they
   * give permission to your application
   */
  redirectUri: `${process.env.CORS_ORIGIN}/api/v1/books/auth/google`,
});

const TOKEN_PATH = "token.json";

exports.getGoogleAuthURL = () => {
  /*
   * Generate a url that asks permissions to the user's email and profile
   */
  const scopes = [
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/books",
  ];

  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: `${process.env.CORS_ORIGIN}/api/v1/books/auth/google`,
    scope: scopes, // If you only need one scope you can pass it as string
  });
};

// let URLSearchParams = new URLSearchParams(init);

// function getGoogleAuthURL() {
//   const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
//   const options = {
//     redirect_uri: `${process.env.CORS_ORIGIN}/auth/google`,
//     client_id: process.env.GOOGLE_CLIENT_ID,
//     access_type: 'offline',
//     response_type: 'code',
//     prompt: 'consent',
//     scope: [
//       'https://www.googleapis.com/auth/userinfo.profile',
//       'https://www.googleapis.com/auth/userinfo.email',
//     ].join(' '),
//   };

//   return `${rootUrl}?${URLSearchParams.toString(options)}`;
// }
// const url = new URL(getGoogleAuthURL);
// let params = new URLSearchParams(url.search);
// let code = params.get('code');
const REFRESH_TOKEN = "refresh_token.json";

exports.getGoogleUser = async (code) => {
  console.log("google auth code 2: ", code);
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  // Store the token to disk for later program executions
  fs.writeFile(TOKEN_PATH, JSON.stringify(tokens), (err) => {
    if (err) console.error(err);
    console.log("Token stored to", TOKEN_PATH);
  });
  // //  Store the refresh token
  // fs.writeFile(REFRESH_TOKEN, json.stringify(tokens), (err) => {
  //   if (err) console.log(err);
  //   console.log("Refresh Token stored to", REFRESH_TOKEN);
  // });
  // Fetch the user's profile with the access token and bearer
  const googleUser = await axios
    .get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`,
      {
        headers: {
          Authorization: `Bearer ${tokens.id_token}`,
        },
      }
    )
    .then((res) => res.data)
    .catch((error) => {
      throw new Error(error.message);
    });
  return googleUser;
};

exports.refreshToken = async () => {
  console.log(oauth2Client);
  const token = await axios
    .post("https://www.googleapis.com/oauth2/v4/token", null, {
      params: {
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        refresh_token: refresh_token,
        grant_type: "refresh_token",
      },
    })
    .then(({ data }) => {
      // Store the token to disk for later program executions
      console.log(data);
      // Store the token to disk for later program executions
      fs.appendFile(TOKEN_PATH, JSON.stringify(tokens), (err) => {
        if (err) console.error(err);
        console.log("Token stored to", TOKEN_PATH);
      });
    })
    .catch((err) => console.log(err));
};

// import axios from 'axios';

// function getTokens({
//   code,
//   clientId,
//   clientSecret,
//   redirectUri,
// }) {

//   /*
//   Returns:
//   Promise<{
//     access_token: string;
//     expires_in: Number;
//     refresh_token: string;
//     scope: string;
//     id_token: string;
//   }>
//   */
//   const url = 'https://oauth2.googleapis.com/token';
//   const values = {
//     code,
//     client_id: clientId,
//     client_secret: clientSecret,
//     redirect_uri: redirectUri,
//     grant_type: 'authorization_code',
//   };

//   return axios
//     .post(url, URLSearchParams.toString(values), {
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded',
//       },
//     })
//     .then((res) => res.data)
//     .catch((error) => {
//       throw new Error(error.message);
//     });
// }

// async googleAuth(input, context) {
//   const googleUser = await getGoogleUser({ code: input.code });

//   let user = await this.userModel
//     .findOne({ githubId: String(googleUser.id) })
//     .exec();

//   if (user) {
//     // Update their profile

//   }

//   if (!user) {
//     // Create the user in the database
//     user = new User()
//   }

//   // Generate a JWT, add it as a cookie

//   return user;
// }

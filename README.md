# Book-inventory
###### Book Inventory to store library books using Google Books Library authenticating using Google OAuth Sign In

- 1.Go to https://console.cloud.google.com/ and create your first project.
- 2.Next go to https://console.cloud.google.com/apis/library/books.googleapis.com and enable the Books API.
- 3.After enabling the API create an OAuth2 client ID and get an API key from the credentials section.
- 4.In the credentials section while creating the client ID enter the redirect URI which is required for Google OAuth Authentication.
- 5.From the OAuth Client ID section copy the Client ID and Client Secret into your .env file.
- 6.Create a separate .env and copy all the variables from .example.env into the .env file.
- 7.Clone this repo and run npm install on your local browser.
- 8.RUN npm run dev into the local browser http://localhost:PORT. Replace PORT with your port number. 

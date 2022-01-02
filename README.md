# Book-inventory
###### Book Inventory to store library books using Google Books Library authenticating using Google OAuth Sign In
1.Go to https://console.cloud.google.com/ and create your first project.
2.Next go to https://console.cloud.google.com/apis/library/books.googleapis.com 3.and enable the Books API.
4.After enabling the API create an OAuth2 client ID and get an API key from the credentials section.
5.In the credentials section while creating the client ID enter the redirect URI which is required for Google OAuth Authentication.
6.From the OAuth Client ID section copy the Client ID and Client Secret into your .env file.
7.Create a separate .env and copy all the variables from .example.env into the .env file.
8.RUN npm run dev into the local browser http://localhost:PORT. Replace PORT with
your port number.

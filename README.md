# Book-inventory
###### Book Inventory to store library books using Google Books Library authenticating using Google OAuth Sign In
Go to https://console.cloud.google.com/ and create your first project.
Next go to https://console.cloud.google.com/apis/library/books.googleapis.com and enable the Books API.
After enabling the API create an OAuth2 client ID and get an API key from the credentials section.
In the credentials section while creating the client ID enter the redirect URI which is required for Google OAuth Authentication.
From the OAuth Client ID section copy the Client ID and Client Secret into your .env file.
Create a separate .env and copy all the variables from .example.env into the .env file.
RUN npm run dev into the local browser

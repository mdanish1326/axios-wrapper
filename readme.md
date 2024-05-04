# WrapeAxios

WrapeAxios is a JavaScript library that provides an easy-to-use wrapper the popular HTTP client, Axios. It is designed to handle token-based authentication and automatic token refresh for RESTful APIs. This wrapper simplifies the process of setting up Axios instances with built-in interceptors for request and response handling, especially for private endpoints that require authentication.

## Features

- Easy integration with Axios for making HTTP requests.
- Support for automatic token refresh on receiving a 401 Unauthorized response.
- Built-in local storage strategy for storing and retrieving access and refresh tokens.
- Customizable Axios instances with versioning and custom headers support.
- Interceptor setup to inject the `Authorization` header into requests when needed.
- Error handling for failed requests and token refresh attempts.

## Installation

To install WrapeAxios, you can use npm (Node Package Manager). Run the following command in your project directory:
```
npm install wrape-axios
```

## Usage

### Importing WrapeAxios

First, import WrapeAxios into your JavaScript file:
```
import WrapeAxios from "wrape-axios";
```
### Configuration

Create a new instance of WrapeAxios by passing a configuration object:
```
const wrapeAxios = new WrapeAxios({
  baseURL: "https://api.yourdomain.com",
  version: "v1", // Optional: API version if required
  refreshEndpoint: "/auth/refresh", // Endpoint to call for refreshing the tokens
  strategy: STRATEGY.LOCAL_STORAGE, // Token storage strategy
  accessTokenKey: "accessToken", // Key for storing the access token
  refreshTokenKey: "refreshToken", // Key for storing the refresh token
});
```

### Using WrapeAxios

To make API calls using the configured instance, call the `useWrapeAxios` method with the desired endpoint and options:
```
api.get("/users")
  .then(response => {
    console.log(response.data); // Handle the response data
  })
  .catch(error => {
    console.error(error); // Handle errors
  });
```

## Contributing

If you'd like to contribute to the development of WrapeAxios, please follow the standard GitHub fork and pull request workflow.

1. Fork the repository on GitHub.
2. Clone your forked repository to your local machine.
3. Create a new branch for your feature or bug fix.
4. Make changes in your local repository.
5. Push your changes to your fork on GitHub.
6. Submit a pull request from your fork to the main repository.

## GitHub Repository

The source code for WrapeAxios is hosted on GitHub. You can view, fork, or contribute to the project here:

[AxiosWrapper GitHub Repository](https://github.com/mdanish1326/axios-wrapper)



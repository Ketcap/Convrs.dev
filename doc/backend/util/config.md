### `getConfigOrThrow(user: User & { Configs: Config[] }, app: Application): Promise<Config>`

This function takes in two parameters:
- `user`: an object of type `User` with an additional property `Configs` which is an array of `Config` objects. This parameter represents the user for whom the configuration is being fetched.
- `app`: an object of type `Application`. This parameter represents the application for which the configuration is being fetched.

This function returns a promise that resolves to a `Config` object.

This function searches for a `Config` object in the `Configs` array of the `user` parameter that matches the `application` property of the `app` parameter. If a matching `Config` object is found, it is returned. If no matching `Config` object is found, an error is thrown with the message "No OpenAI config found".
# Catalisa Dev Challenge
## Installation

```bash
$ docker compose up -d
$ npm install
```

## Running the app

```bash
# watch mode
$ npm run start:dev
```

## Test

```bash
# unit tests
$ npm run test
```

## Docker compose

- It creates both `databases`, one for development and other for tests. 

- `Adminer` to visualize the data.
    -  runs on port `:8080` and the credentials you can find in the [docker compose file](docker-compose.yml).

## OBS

- I decided that account deleting would use soft delete by filling the field `deletedAt` with the timestamp of the deletion;
- About the `Transaction` table schema, I made some assumptions like:
    - `Transactions` are atomic, once created they cannot be updated nor deleted;
    - `Transaction` type are either `Deposit` or `Withdraw`;
        - `Deposit` will not care about where the money is coming from (if the sender has it's value or not), will just add this balance to the account;
        - `Withdraw` will just validate if the balance is greater than the amount asked, if yes take the money from the account, if not errors;
    - Even though `number` is a unique key, I wanted the `Transaction` to be similar on what we use on a daily basis, that is generally send `number and branch`, for example. But only `number` is required, others are optional.

- I took the freedom to do some consideration about the schema validation:
    - Just the `type` field can be updated;
- Regarding `GET /account` pagination:
    - `take` default is 20;
    - `skip` default is 0;

- Because was my first time using NestJs I tried to follow the patterns introduced by the official documentation, for example:
    - I did not create a `Repository` in this case (as I generally would prefer to), because most of the examples that I saw was doing db calls directly from the `Service`
    - I used zod to validate the inputs with the `Pipe()` function, and when the input is not right it errors with:
        ```json
        {
          "message": "Validation failed",
          "error": "Bad Request",
          "statusCode": 400
        }

        ```
    - I don't feel that this is much useful, generally I would have other approach, for example, return which of the field/fields triggered the validation error;

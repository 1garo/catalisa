# Catalisa Dev Challenge
## Installation

```bash
$ docker compose up -d
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test
```

## OBS

- I decided that account deleting would hard delete (remove the account from the database), and not just soft delete using a table field;
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

- I took the freedom to do some consideration about the schema validation:
    - Even though it's not very common to be able to update account number and branch, I leaved it there to make sense regard the challenge specification (CRUD);
- `take` default is 10;
- `skip` is 0;
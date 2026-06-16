# timed wordle

It's wordle, but there's a timer and if it reaches 0 the game will randomly guess for you.

**IN DEVELOPMENT** (ETA: forever)

## Local Play

Build the app by installing the dependencies needed for the app. Either download the runtime language and its dependencies on your own or use Docker to build the project. Regardless, clone the project first by running `git clone https://github.com/gregoriusavip/timed-wordle.git`

### Local dependencies

---

#### Python Setup

- Install Python 3.14.3 from the official download link or through [pyenv](https://github.com/pyenv/pyenv).
- On /wordlebackend directory, create a .env file
  - In order for django to work, you need to generate a secret key. This can be done from anywhere such as from [Djecrety](https://djecrety.ir/)
  - Once you have generated a secret key, paste`SECRET_KEY=YOURSECRETKEYHERE` into the .env file
- Install [Pipenv](https://pipenv.pypa.io/en/latest/installation.html)
  - On **/djangoapp** directory, run `pipenv shell`
  - Inside the shell, run `python manage.py runserver`.
    - This will run the local server for the backend on `http://127.0.0.1:8000/`

#### React setup

- Install [pnpm](https://pnpm.io/installation)
- On **/reactapp** directory, run `pnpm install`
- Once installed on the same directory, run `pnpm run dev`
  - This will run the local server for the frontend on `http://localhost:5173/`

---

### Docker

To use docker, simply [install docker](https://www.docker.com/) from the official website and then on the project root directory, run `docker compose build` to build the project, then `docker compose up` to run the servers. The link should be the same as the local dependencies setup and should be displayed on console as well.

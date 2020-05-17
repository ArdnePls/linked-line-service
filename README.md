# linked-line-service

Linked line service

## First steps

#### Installing node
Get the latest version of node from the [official website](https://nodejs.org/).

#### Getting dependencies
Run ```npm install``` from rootpath of the project.

#### Environments
You should at first create in the rootpath of the project an `.env` file. Then, set the followings ENV VARs in `.env`.

- FILE_URL=`url where the shared file is storaged`
- PORT=8080 `You can change the port as you prefer`


#### Starting your app
Now, to start your app run ```npm run dev``` in the rootpath of the project. Then access your app at **localhost:port**. The port is logged in the console where you ran the start script. If you did not alter the default port, it will be 8080.

## API

### Endpoints

#### POST to '/'
- Does: Receives a sentence and writes the storaged file with a hash from the previous line, the sentence and a nonce calculated with the a hash from the previous line and the sentence, so the full hash (`prev_hash,sentence,nonce`) will generate a hash which will start with `00`. If it's the first line we write the file, the first hash will be random with the given condition.
- Returns: The full file text (`hashFromPreviousLine,sentence,nonce\n`)
- Receives: This endpoint will require to receive a body with the `sentence` field filled with the sentence you want to write in the file.

#### PUT to '/'
- Does: Receives a sentence and an index and updates with the condition given. The index will start at 1, and should be less less or equal than the last line number. It will persist the previous data from the file, replace the sentence required with a new nonce generated with the hash from the previous line and the new sentence, and re-generate the data (hashes and nonces) after the required line persisting the sentences written previously in every line.
- Returns: The full file text (`hashFromPreviousLine,sentence,nonce\n`)
- Receives: This endpoint will require to receive a body with the `sentence` field filled with the sentence you want to write in the file and the `index` field which will have an integer greater than 0 (file lines starts at 1) and less or equal than the last line number.
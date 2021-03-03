require("dotenv").config();

import { Ganache } from './src/utils/ganache'

const start = async () => {
    const instance = new Ganache({
        port: 8549
    })

    await instance.start()
}

start()
    .then(() => console.log("Running"))
    .catch((error) => console.log("Error", error))

export { }
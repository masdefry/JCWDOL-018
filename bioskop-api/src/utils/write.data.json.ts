import fs from 'fs';

export const writeDataJSON = (dataToWrite: any) => {
    fs.writeFileSync('./src/db/db.json', JSON.stringify(dataToWrite))
}
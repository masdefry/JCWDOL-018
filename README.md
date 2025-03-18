Hello, JCWDOL!

+   How to Setup REST API with ExpressTS as Framework?

            1.  Create Project Directory

            2.  Install Dependencies

                        npm install express cors dotenv
                        
                        npm install --save-dev typescript ts-node @types/node @types/express nodemon

            3.  Configure TS

                        npx tsc --init

            4.  Edit File `tsconfig.json`

                         - Uncomment rootDir:  "rootDir": "./src"

                        - Uncomment outDir:   "outDir": "./dist"

            5.  Create File `nodemon.json` on Root Project Directory

            6.  Add this Configuration on `nodemon.json`

                        {
                            "watch": ["src"],
                            "ext": "ts",
                            "exec": "ts-node src/index.ts"
                        }

            7.  Add this Script on `package.json`

                        "scripts": {
                            "dev": "nodemon",
                            "build": "tsc",
                            "start": "node dist/index.js"
                        }

            8.  Running Project

                        npm run dev
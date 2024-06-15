"use client"
import { Button } from "@/components/ui/button"
import React from 'react';
import MarkdownPreview from '@uiw/react-markdown-preview';
import { useState } from 'react'

export default function Page() {
    const clicked = async () => {
        console.log()
    }
    const source = `## Generative AI Estate Planning Platform with groq API
Demo: 

[!Demo](https://github.com/ashmitg/AiEstate/assets/84148720/58fe8077-2fc0-4e87-8f04-cf6eb2d51c7c)

### Description

This is a full-stack web application built with the MERN stack (MongoDB, Express, React, and Node.js) that allows users to create personalized estate plans based on their assets and designated beneficiaries. The application utilizes a generative AI model powered by the groq API to generate comprehensive estate planning documents tailored to the user's specific needs.

### Features

- User authentication and authorization
- Asset management (cars, properties, businesses, stocks, custom assets)
- Assign beneficiaries for each asset in the event of death
- Generate personalized estate planning documents using the groq API
- Responsive UI built with Chakra UI
- Secure data storage with MongoDB

### Installation

1. Clone the repository:
2. Navigate to the project directory:
3. Install server-side and client-side dependencies:
   cd server && npm install nodemon index.js
   cd client npm install && npm start

### Configuration

1. Create a \`.env\` file in the \`server\` directory and add the variables from .envcopy

The application should now be running at \`http://localhost:3000\`.

### Technologies Used

- MongoDB
- Express.js
- React.js
- Node.js
- Chakra UI
- JSON Web Tokens (JWT) for authentication
- groq API for generative AI capabilities using mixtral, llama

### Contributing

Contributions are welcome! Please read the [contributing guidelines](CONTRIBUTING.md) for more information.

### License

This project is licensed under the [MIT License](LICENSE).`;

return (
    <div className="flex flex-col min-h-screen w-full items-center justify-center bg-muted/40">
        <div className="max-w-[150rem] flex flex-col items-center">
            <MarkdownPreview source={source} style={{ padding: 16 }} />

            <Button className="w-full my-4" onClick={clicked}>
                Click me
            </Button>
        </div>
    </div>
);


}
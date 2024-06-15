# Open Source Component Searcher

Welcome to the Open Source Component Searcher project! This tool is designed to help you seamlessly find compatible open-source components for your projects. Whether you need to integrate a multi-file uploader, authentication system, or any other feature into your web application, this searcher leverages advanced technologies to ensure you find the best possible solutions quickly and efficiently.

## Demo

[!Demo](https://github.com/ashmitg/mongodbhackathon/assets/84148720/42df77f9-3952-41bc-8264-95eee42d7dd7)

## RAG Implementation

<img width="740" alt="Screen Shot 2024-06-02 at 11 35 07 AM" src="https://github.com/ashmitg/AiEstate/assets/84148720/6dc4c34d-2b86-4bfa-b59b-6dc44e2b4c7e">

## Table of Contents

1. [Introduction](#introduction)
2. [Features](#features)
3. [Technologies Used](#technologies-used)
4. [Installation](#installation)
5. [Usage](#usage)
6. [Contributing](#contributing)
7. [License](#license)

## Introduction

The Open Source Component Searcher is designed to help developers enhance their web applications by finding compatible open-source components. This tool uses vectorization and search algorithms to analyze your existing project and identify the best components available on GitHub that match your requirements.

## Features

- **Project Vectorization**: Vectorizes your existing project repository to understand its structure and dependencies.
- **Query Generation**: Utilizes Upstage to generate potential search queries tailored to your project needs.
- **GitHub Scraping**: Searches GitHub for open-source projects and components that match the generated queries.
- **Vector Storage**: Stores scraped data in a MongoDB Atlas vector store for efficient querying and retrieval.
- **Component Matching**: Queries the vector store to find the most compatible open-source components for your project.

## Technologies Used

- **Next.js**: Framework used for building the web application.
- **LangChain**: For vectorizing your project repository.
- **MongoDB Atlas**: As the vector store for storing and retrieving project vectors.
- **Upstage**: For generating search queries based on your project requirements.
- **GitHub API**: For searching and scraping open-source components.

## Installation

To get started with the Open Source Component Searcher, follow these steps:

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/ashmitg/mongodbhackathon
   cd mongodbhackathon
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Configure MongoDB Atlas**:

   - Set up a MongoDB Atlas account and create a new cluster.
   - Obtain your MongoDB connection string and update the `.env` file with your credentials.

4. **Run the Application**:
   ```bash
   npm run dev
   ```

## Usage

1. **Vectorize Your Project**: Upload your project repository to the tool to start the vectorization process.
2. **Generate Search Queries**: Specify the features you need (e.g., multi-file uploader), and the tool will generate relevant search queries.
3. **Search GitHub**: The tool will search GitHub using the generated queries and scrape the results.
4. **Store and Query Vectors**: The scraped data will be stored in the MongoDB Atlas vector store.
5. **Find Compatible Components**: Query the vector store to find the most compatible open-source components for your project.

## Contributing

We welcome contributions from the community! To contribute, follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Make your changes and commit them (`git commit -m 'Add your feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Create a new Pull Request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

By using the Open Source Component Searcher, you can save time and ensure that the components you integrate into your web application are highly compatible and meet your specific needs. We hope you find this tool useful and look forward to your feedback and contributions!

/**
 * @label Test Fixtures - Expected AI Outputs
 * @description Mock AI-generated summaries, key points, and Q&A for testing
 */

export const expectedSummaries = {
  short: {
    summary: 'This video provides a brief introduction to React hooks, explaining that they are functions allowing the use of state and React features without classes. The most common hooks mentioned are useState and useEffect.',
    keyPoints: [
      'React hooks are functions for using state without classes',
      'Most common hooks are useState and useEffect',
      'Hooks provide access to React features in functional components',
    ],
    qaPairs: [
      {
        question: 'What are React hooks?',
        answer: 'React hooks are functions that let you use state and other React features without writing a class component.',
      },
      {
        question: 'What are the most commonly used React hooks?',
        answer: 'The most commonly used hooks are useState for managing state and useEffect for handling side effects.',
      },
    ],
  },

  medium: {
    summary: 'This comprehensive tutorial covers the fundamentals of modern web development, including HTML, CSS, and JavaScript. It progresses from basic concepts to advanced topics like React and TypeScript. HTML provides structure, CSS handles styling, and JavaScript adds interactivity. The tutorial emphasizes practical application and regular practice for skill development.',
    keyPoints: [
      'HTML provides the structure of web pages',
      'CSS is used for styling and layout design',
      'JavaScript adds interactivity and dynamic behavior',
      'Modern frameworks like React build on these fundamentals',
      'TypeScript adds type safety to JavaScript',
      'Regular practice and building projects reinforces learning',
      'These technologies work together in modern web applications',
    ],
    qaPairs: [
      {
        question: 'What are the three core technologies covered in this tutorial?',
        answer: 'The three core technologies are HTML for structure, CSS for styling, and JavaScript for interactivity.',
      },
      {
        question: 'Why is practice important in web development?',
        answer: 'Practice is important because it helps reinforce learning and building real projects solidifies understanding of how technologies work together.',
      },
      {
        question: 'What is the role of JavaScript in web development?',
        answer: 'JavaScript adds interactivity and dynamic behavior to web pages, making them responsive to user actions.',
      },
    ],
  },

  technical: {
    summary: 'This tutorial demonstrates building a RESTful API with Node.js and Express. It covers project setup, dependency installation (Express, Mongoose, dotenv), server configuration with middleware, CRUD route implementation, controller creation, Mongoose schema integration, error handling, and endpoint testing with tools like Postman.',
    keyPoints: [
      'Use Express framework for building the REST API',
      'Mongoose provides MongoDB integration',
      'dotenv manages environment variables',
      'Implement CRUD operations (GET, POST, PUT, DELETE)',
      'Controllers handle business logic separately from routes',
      'Mongoose schemas define data models',
      'Middleware handles JSON parsing, CORS, and error handling',
      'Test endpoints using Postman or cURL',
    ],
    qaPairs: [
      {
        question: 'What dependencies are needed for this REST API?',
        answer: 'The main dependencies are Express for the web framework, Mongoose for MongoDB integration, and dotenv for environment variable management.',
      },
      {
        question: 'What are CRUD operations?',
        answer: 'CRUD stands for Create, Read, Update, and Delete - the four basic operations for persistent storage, implemented using POST, GET, PUT, and DELETE HTTP methods.',
      },
      {
        question: 'How is the code organized in this API?',
        answer: 'The code is organized with routes handling HTTP requests, controllers managing business logic, and Mongoose models defining data schemas.',
      },
    ],
  },
};

export const mockAIResponses = {
  summary: {
    success: true,
    data: {
      summary: expectedSummaries.medium.summary,
    },
  },
  keyPoints: {
    success: true,
    data: {
      keyPoints: expectedSummaries.medium.keyPoints,
    },
  },
  qa: {
    success: true,
    data: {
      qaPairs: expectedSummaries.medium.qaPairs,
    },
  },
  complete: {
    success: true,
    data: {
      summary: expectedSummaries.medium.summary,
      keyPoints: expectedSummaries.medium.keyPoints,
      qaPairs: expectedSummaries.medium.qaPairs,
    },
  },
};

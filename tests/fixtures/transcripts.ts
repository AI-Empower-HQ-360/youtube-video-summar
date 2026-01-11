/**
 * @label Test Fixtures - Sample Transcripts
 * @description Mock transcript data for testing
 */

export const sampleTranscripts = {
  short: `Hello and welcome to this video. Today we're going to learn about React hooks. 
React hooks are functions that let you use state and other React features without writing a class. 
The most commonly used hooks are useState and useEffect. 
That's all for today, thanks for watching!`,

  medium: `Welcome to this comprehensive tutorial on building web applications. 
In this video, we'll cover the fundamentals of modern web development including HTML, CSS, and JavaScript. 
We'll start with the basics and work our way up to more advanced concepts like React and TypeScript. 
First, let's talk about HTML. HTML is the structure of your web page. 
Next, CSS is used for styling and layout. 
Finally, JavaScript adds interactivity and dynamic behavior. 
By the end of this tutorial, you'll have a solid understanding of how these technologies work together.
Remember to practice regularly and build real projects to reinforce your learning.`,

  long: `Good morning everyone and welcome to today's lecture on artificial intelligence and machine learning.
We're going to dive deep into the fundamentals of AI, starting with a historical perspective.
Artificial intelligence has been a dream of humanity for decades, with roots going back to the 1950s.
The field has evolved dramatically over the years, especially with recent advances in deep learning.

Today's agenda includes three main topics: first, we'll discuss supervised learning algorithms.
These are algorithms that learn from labeled training data to make predictions on new, unseen data.
Common examples include linear regression, logistic regression, and neural networks.

Second, we'll explore unsupervised learning, which involves finding patterns in data without labels.
Clustering algorithms like K-means and hierarchical clustering fall into this category.
We'll also touch on dimensionality reduction techniques like PCA and t-SNE.

Finally, we'll look at reinforcement learning, which is about training agents to make decisions.
This is the technology behind game-playing AIs like AlphaGo and autonomous driving systems.
The agent learns through trial and error, receiving rewards or penalties for its actions.

Throughout this lecture, we'll use practical examples and code demonstrations.
Make sure you have your development environment set up with Python and the necessary libraries.
We'll be using NumPy for numerical operations, Pandas for data manipulation, and Scikit-learn for machine learning.

Let's begin with our first topic on supervised learning...`,

  technical: `In this tutorial, we're implementing a RESTful API using Node.js and Express.
First, we'll set up our project structure and install the necessary dependencies.
We need express for the web framework, mongoose for MongoDB integration, and dotenv for environment variables.
Let's start by creating our package.json file and installing these packages.
Next, we'll set up our Express server with proper middleware for JSON parsing and CORS.
We'll create routes for CRUD operations: GET, POST, PUT, and DELETE.
Each route will be connected to a controller that handles the business logic.
The controller will interact with our data models defined using Mongoose schemas.
We'll also implement error handling middleware to catch and format errors properly.
Finally, we'll test our endpoints using tools like Postman or cURL.`,

  multilingual: `Bonjour et bienvenue à cette vidéo. 
Hello and welcome to this video.
Hola y bienvenidos a este video.
In this multilingual presentation, we'll switch between languages.
Nous allons parler de programmation.
We will talk about programming.
Vamos a hablar de programación.
It's important to test with different language inputs.`,
};

export const sampleTranscriptSegments = [
  {
    text: 'Hello and welcome to this video',
    duration: 2.5,
    offset: 0,
  },
  {
    text: 'Today we will learn about React',
    duration: 2.8,
    offset: 2.5,
  },
  {
    text: 'React is a JavaScript library',
    duration: 2.3,
    offset: 5.3,
  },
  {
    text: 'for building user interfaces',
    duration: 2.1,
    offset: 7.6,
  },
];

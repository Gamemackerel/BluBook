# BlueBook

~BlueBook is a minimal social network webapp, which is unique in how users gain friends. Two users must perform a bluetooth ‘handshake’ through the app while being near each other in the physical world in order to become friends, meaning users only make friends with people they have actually met.~

Our research has shown that it is not possible currently to maintain a bluetooth connection between two web browsers. We could reasonably continue on with this concept as a native mobile application, however we decided to keep our social network as a webapp and pivot our design. Now, instead of two users needed to perform a bluetooth handshake, they instead must have signed up from a similar geographical location, measured by using their IP address.

BlueBook is created by Abe Miller, Yokesh Jayakumar, and Mark Zhu for a final project in CSE461: Computer Networks at University of Washington. It is built on the template of a freecodecamp.org course: [Full Stack React & Firebase series](https://www.youtube.com/watch?v=RkBfu-W7tt0&list=PLMhAeHCz8S38ryyeMiBPPUnFAiWnoPvWP).

Instructions for starting frontend webapp locally, using the existing firebase API of https://us-central1-bluebook-5f792.cloudfunctions.net/api:

## 1: Install packages

in `frontend/`, run `npm install`

## 2: Run project

in `frontend/`, run `npm start`

## 3: Open it

go to [http://localhost:3000](http://localhost:3000)

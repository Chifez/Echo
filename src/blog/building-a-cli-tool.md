---
title: 'Building my first CLI tool'
description: 'Insights into how i built a cli tool to help me scaffold boiler plates for different projects'
date: '2024-11-17'
author: Nwosu Emmanuel
avatar: /corporate.jpg
role: Frontend Engineer
tags: ['cli', 'templates']
published: true
---

## Introduction

Have you ever felt the hassle of repeatedly selecting options from Inquirer while setting up a new project? That’s precisely what inspired me to build a CLI tool that helps scaffold boilerplate templates effortlessly.

It all started with a CLI tool I built for a project at work. After that experience, I decided to spend my weekend creating something personal—a CLI tool to automate project scaffolding and save time. This blog post delves into the journey of building my first CLI, the challenges I faced, the features I added, and plans for the future.

![CLI Tool Banner](/cli-banner.webp)

---

## Why Build a CLI Tool?

When building projects, I found myself wasting valuable time repeatedly setting up project folders, installing dependencies, and selecting options through the terminal. Although tools like Create React App exist, I wanted something personalized—something that supported the frameworks I work with most: **React**, **Next.js**, **Svelte**, and custom HTML templates.

So, I set out to solve this problem by creating a CLI tool to:

1. Automate scaffolding project structures.
2. Minimize repetitive tasks.
3. Allow for customization of templates.
4. Support versioning and easy distribution via npm.

---

## The Learning Process

Building a CLI tool was a first for me. While working on the CLI tool for a work project, I spent a lot of time reading articles, experimenting, and debugging. That knowledge became the foundation for this personal project.

Some key steps in the learning process were:

- **Understanding Node.js and Commander.js**: I chose Commander.js for building the CLI due to its simplicity and robust feature set.
- **Integrating Inquirer.js**: This library made it easy to add interactive prompts for user input.
- **Publishing to npm**: I learned how to package the tool and automate versioning with GitHub Actions.

Here’s what the initial folder structure of my CLI project looked like:

```plaintext
my-cli/
├── bin/
│   └── index.js
├── templates/
│   ├── reactjs-template/
│   ├── nextjs-template/
│   ├── svelte-template/
│   └── custom-template/
├── package.json
└── README.md
```

## Features of the CLI Tool

### 1. Template Scaffolding

The CLI supports scaffolding templates for the following frameworks:

- **Reactjs**
- **Nextjs**
- **Sveltejs**
- **Custom templates** (e.g., basic HTML or any boilerplate you prefer)

With a single command, I can scaffold a project folder with a predefined structure, install dependencies, and get started immediately.

---

### 2. Customizable Options

To reduce repetitive terminal prompts, I added options for directly specifying the template and project name. For example:

```bash
cli-starter-template my-project --template react
```

### Streamlined Project Setup

This eliminates the need for multiple Inquirer.js prompts, speeding up the setup process.

---

### 3. GitHub Workflow Integration

One of the coolest features I implemented was versioning and publishing automation. With every new release, a GitHub Workflow automatically builds and publishes the package to npm. This feature ensures smooth updates and consistent version control.

---

## Insights from the Experience

### Challenges

- **First-Time CLI Development**: Navigating the nuances of building a CLI from scratch was challenging but rewarding.
- **Publishing to npm**: Ensuring the package was ready for the public involved writing detailed documentation and following npm guidelines.

### Wins

- **Quick Adoption**: Less than a day after publishing to npm, the package had over 100 installs! Seeing people use the tool was incredibly fulfilling.
- **Improved Productivity**: It has already saved me hours of setup time for new projects.

---

## Future Plans

Although the CLI tool is functional, there’s plenty of room for improvement and new features. Here’s what’s next on my roadmap:

- **Integrate shadcn Components**: Preconfigure design components for a consistent UI across projects.
- **Add Supabase Support**: Include boilerplate configurations for authentication and database functionality.
- **Support More Frameworks**: Expand the list of templates to include popular frameworks like Vue.js, Astro, and more.
- **User Feedback**: Gather feedback to improve usability and add features requested by developers.

---

## Conclusion

Building this CLI tool was an exciting journey that improved both my technical skills and my workflow. Whether you're a developer who frequently starts new projects or someone who loves automation, creating a CLI tool can be a rewarding experience.

If you’d like to try it out or contribute to the project, check out the [GitHub repository](https://github.com/chifez/cli-template-starter) and the [npm package](https://www.npmjs.com/package/cli-template-starter).

Thank you for reading, and I hope this inspires you to build something that solves your own problems. 🚀

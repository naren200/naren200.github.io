---
title: Design your Modern Porfolio Now! 
tags: [Blog, Open Source Contributions]
# style: fill
color: secondary
description: Elevate your personal website with a dynamic and vibrant GitHub Page template. Stand out with a burst of colors that reflect your unique style and personality.
---



# How to Turn Any GitHub Pages Website into Your Own Portfolio

## Find GitHub Pages to Personalize
Visit any GitHub Pages website published online, such as [https://naren200.github.io](https://naren200.github.io). Once you've found the one that resonates with you, follow the guide to transform it into your unique portfolio. Let's showcase your journey!

## Introduction
So, you've found a fantastic GitHub Pages website that you want to turn into your personal portfolio? Great choice! In this guide, we'll walk you through the process of forking any GitHub Pages repository and customizing it to showcase your projects, skills, and experiences.

## Prerequisites

Before we get started, make sure you have the following:

- A GitHub account
- Basic knowledge of Git and GitHub


## Steps to Make It Yours
Github Repo for demo: [https://github.com/naren200/naren200.github.io](https://github.com/naren200/naren200.github.io)

1. **Fork the Repository:**
- Fork the GitHub repository by navigating to the repository you want to use.
- Click on the "Fork" button in the top right corner of the page.
- Rename the forked repository as "your_github_page_name.github.io". For example, "your_github_page_name" is "naren200" for my github profile. So, I have created my project name as "naren200.github.io".

2. **Configure GitHub Pages:**
   - Navigate to your repository's Settings.
   - Under "Pages" in the left sidebar, find the "Build and deployment" section.
   - Set the branch to "main" and the folder to "/root".
   - Save the changes.

3. **Check Your Website:**
   - Your page is now building in the background. Give it 1-2 minutes.
   - After the build is complete, visit "https://your_github_page_name.github.io" to see your website.
   - Visit "https://your_github_page_name.github.io/about" or your custom pages to see your updated content.

4. **Customize the Content**

- Edit the HTML, CSS, and other files to reflect your information.
- Update the "About Me," "Projects," "Experience," and other sections with your details.

## Getting Started to locally host and Modify your portfolio in linux!

To run the website locally and preview changes, follow these steps:

To preview changes locally, follow these steps:

1. **Clone the repository** to your machine:

    ```bash
    git clone https://github.com/your_github_page_name/your_github_page_name.github.io.git
    ```

2. **Navigate to the project folder**:

    ```bash
    cd your_github_page_name.github.io
    ```


3. **Install Jekyll and Bundler:** Before running the site locally, ensure you have Jekyll and Bundler installed on your machine. Follow the steps:

    - Install [Jekyll](https://jekyllrb.com/docs/installation/). For more information about the prerequisites, see "[Creating a GitHub Pages site with Jekyll](https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/creating-a-github-pages-site-with-jekyll#prerequisites)."

    - Install Ruby. Refer to the Installing "[Ruby](https://www.ruby-lang.org/en/documentation/installation/)" guide for details.
    
    - Install [Bundler](https://bundler.io/) using the following command:
        ```bash
        gem install bundler
        ```

4. **Install Jekyll dependencies:** While in the project directory, run the following command to install the necessary dependencies using Bundler.
    ```bash
    bundle install
    ```

5. **Run your Jekyll site locally:** Start the local development server using the following command:
    ```bash
    bundle exec jekyll serve
    ```
    Your site will be available at `http://localhost:4000` or `http://127.0.0.1:4000/` in your web browser.

6. **Preview Changes:** Open your web browser and navigate to [http://localhost:4000](http://localhost:4000) or [http://127.0.0.1:4000/](http://127.0.0.1:4000/) to preview the locally running site.

7. **Publish Your Changes:** Once satisfied with your changes:

- Commit and push your changes to GitHub.
- GitHub Pages will automatically build and reflect your updates.

8. **Updating the GitHub Pages gem:** Over a period of time, Keep your Jekyll environment up-to-date. Open your terminal and run the following command:
    - If you installed Bundler:
        ```bash
        bundle update github-pages
        ```
    - If you don't have Bundler installed:
        ```bash
        gem update github-pages
        ```

By following these steps, you'll have the necessary programs installed, and you'll be able to launch and preview your GitHub Pages site locally.


## Conclusion

Congratulations! You've successfully turned any GitHub Pages website into your personalized portfolio. Showcase your skills and experiences to the world. Best of luck!


## Contributing

Contributions are welcome! If you find issues or have suggestions over [my template](https://naren200.github.io), open an issue or submit a pull request.

## Acknowledgements

- `naren200.github.io` template - [https://naren200.github.io](https://naren200.github.io)
- Jekyll template: [Bay Theme](https://github.com/eliottvincent/bay) by Elliot Vincent
- Back-to-top button inspiration: [Matthew Cain's Codepen](https://codepen.io/matthewcain/pen/ZepbeR)
- Search inspiration: [Simple-Jekyll-Search](https://github.com/christian-fei/Simple-Jekyll-Search)
- Javascript widget: [Revolvermaps](https://www.revolvermaps.com/)

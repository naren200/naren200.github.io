# My Personal Portfolio Website

This repository contains the code and assets for my personal portfolio website. The website showcases my projects, skills, and experiences as a developer. It serves as a hub for potential clients or employers to learn more about me and my work.

## Live Demo

A live demo of the website can be found at [naren200.github.io/](https://naren200.github.io/).

## Technologies Used

- HTML5
- CSS3
- JavaScript
- Bootstrap 
- ReactJS

## Features

- Home page: Provides an overview of my background, skills, and interests.
- Projects page: Showcases my notable projects, including descriptions, screenshots, and links to their respective repositories or live demos.
- Skills page: Highlights the programming languages, frameworks, and tools that I am proficient in.
- Experience page: Displays my work experience and educational background.
- Contact page: Includes a contact form for visitors to get in touch with me.


## Getting Started

To run the website locally and preview changes, follow these steps:

1. **Clone the repository:** Open your terminal and run the following command to clone the repository to your local machine.
    ```bash
    git clone https://github.com/naren200/naren200.github.io.git
    ```

2. **Navigate to the project folder:** Change into the project directory by running the following command.
    ```bash
    cd your-portfolio-website
    ```

3. **Install Jekyll and Bundler:** Before running the site locally, ensure you have Jekyll and Bundler installed on your machine. Follow the steps:

    - Install [Jekyll](https://jekyllrb.com/docs/installation/).
    - Create a Jekyll site. For more information, see "[Creating a GitHub Pages site with Jekyll](https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/creating-a-github-pages-site-with-jekyll)."

    - Install Ruby. Refer to the ["Installing Ruby" guide](https://www.ruby-lang.org/en/documentation/installation/) for details.
    - Install Bundler using the following command:
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
    Your site will be available at `http://localhost:4000` in your web browser.

6. **Preview Changes:** Open your web browser and navigate to [http://localhost:4000](http://localhost:4000) to preview the locally running site.

7. **Updating the GitHub Pages gem:** Keep your Jekyll environment up-to-date. Open your terminal and run the following command:
    - If you installed Bundler:
        ```bash
        bundle update github-pages
        ```
    - If you don't have Bundler installed:
        ```bash
        gem update github-pages
        ```

By following these steps, you'll have the necessary programs installed, and you'll be able to launch and preview your GitHub Pages site locally.
### Acknowledgement
- Jekyll template: [Bay Theme](https://github.com/eliottvincent/bay) by Elliot Vincent
- Back-to-top button inspiration: [Matthew Cain's Codepen](https://codepen.io/matthewcain/pen/ZepbeR)
- Search inspiration: [Simple-Jekyll-Search](https://github.com/christian-fei/Simple-Jekyll-Search)
- Javascript widget: [Revolvermaps](https://www.revolvermaps.com/)
- Several hours of tinkering and fine-tuning


## Screenshots

![Screenshot 1](/imgs/ReadMe/Landing_page.png)
*Figure 1: Landing Page Layout*

![Screenshot 2](/imgs/ReadMe/AboutMe_page.png)
*Figure 2: About Me Page Layout*

![Screenshot 2](/imgs/ReadMe/PortfolioPage.png)
*Figure 3: Project Portfolio Page Layout*

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, feel free to open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

<p align='center'>Created with :heart: by <a href="https://www.linkedin.com/in/narendhiran2000/">Narendhiran</a></p>
---
title: Design your Modern CV Now! 
tags: [Blog, Open Source Contributions]
# style: 
color: secondary
description: Stand out with a vibrant and colorful LaTeX template for your career.
---


# Make it Yours! Adapt My LaTeX Resume Template

## Introduction

I'm excited to share the recent updates I made to my LaTeX resume template. These changes aim to improve readability and create a more organized structure. Below, I'll detail the modifications made and the rationale behind them.

**Link to Updated Template: [https://www.overleaf.com/latex/templates/resume-public/hmhyxvxfspsw](https://www.overleaf.com/latex/templates/resume-public/hmhyxvxfspsw)**

## Changes in Configuration under `resume.tex`

### Fonts and Colors

I've fine-tuned the font settings and introduced a new color scheme for a visually appealing and professional look. Section titles are now highlighted with a specific color for better emphasis.

```latex
% Example: Adjusting color scheme
\definecolor{my-primary-color}{HTML}{123456}
\colorlet{primary}{my-primary-color}
% ...
```

### Social Information

I expanded the social information section to include links to my LinkedIn, GitHub, and personal portfolio. This offers a more comprehensive overview of my online presence.

```latex
\linkedin{YourLinkedInID}
\github{YourGitHubID}
\homepage{portfolio.github.io}
```

Tips: At the social information header, If you want display "https://portfolio.github.io" instead of "portfolio.github.io", then you need to modify the `resume.cls` file. 

Navigate to the current file `resume.cls` and Remove the `http://` from the 2nd line.
```latex
\ifbool{isstart}{\setbool{isstart}{false}}{\acvHeaderSocialSep}%
\href{http://\@homepage}{\@homepage}%
```
## Personal Information

I replaced placeholder information with my actual name, contact details, and a link to my portfolio website. This ensures that the personal information section reflects accurate and up-to-date details.

```latex
\name{\bf{YourFirstName}}{\bf{YourLastName}}
\mobile{Your Mobile Number}
\email{Your Email}
\homepage{Your Portfolio URL}
```

## CV/Resume Content

### Header

The header now displays my name in bold, and the footer includes my contact information. These changes enhance the overall balance and consistency of the document.

```latex
% Modify the header for bold name display
\headerfirstnamestyle{\bf{YourFirstName}}
\headerlastnamestyle{\bf{YourLastName}}
% ...
```

### Sections

I've reordered and added new sections for a more comprehensive representation. Feel free to customize based on your preferences.

## File Structure and Things to Change (`cv/*.tex` files)

Consider the following suggestions to enhance the file structure:

1. **Experience Section:**
    ```latex
    \cvsection{Experience}

    \begin{cventries}
        \cventry
            {Your Company, Your Position}
            {Location}
            {Start Date - End Date}
            {
                \begin{cvitems}
                    \item Describe your achievements and responsibilities.
                    \item Highlight specific technologies or tools used.
                \end{cvitems}
            }
    \end{cventries}
    ```

2. **Certificates Section:**
    ```latex
    \cvsection{Certificates}

    \begin{cvhonors}
        \cvhonor
            {Certificate Title}
            {Issuing Organization}
            {Completion Date}
            {Location}
    \end{cvhonors}
    ```

3. **Competitions Section:**
    ```latex
    \cvsection{Competitions}

    \begin{cventries}
        \cventry
            {Competition Name}
            {Achievement}
            {Location}
            {Date}
            {
                \begin{cvitems}
                    \item Describe your role and contributions.
                    \item Mention any awards or recognitions received.
                \end{cvitems}
            }
    \end{cventries}
    ```

4. **Education Section:**
    ```latex
    \cvsection{Education}

    \begin{cvhonors}
        \cvhonor
            {Degree, Major}
            {Institution}
            {Graduation Date}
            {Location}
    \end{cvhonors}
    ```

5. **Interests Section:**
    ```latex
    \cvsection{Interests}

    \begin{cvskills}
        \cvskill
            {Interest Name}
            {Brief description of your interest or hobby.}
    \end{cvskills}
    ```

6. **Skills Section:**
    ```latex
    \cvsection{Skills}

    \begin{cvskills}
        \cvskill
            {Category Name}
            {List of skills in that category.}
    \end{cvskills}
    ```

Feel free to incorporate these changes into your LaTeX template, adapting them as needed to match your unique preferences and requirements. Happy LaTeXing!



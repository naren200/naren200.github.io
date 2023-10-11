---
layout: default
permalink: /
---

{% include landing.html %}

<!-- <div id="particles-js" style="background-image: url('imgs/landing/4015765_195_removeBG.png'); background-size: 40% auto; background-repeat: no-repeat;background-position: bottom right;" ></div> -->

<div id="particles-js"></div> 

<!-- style="background-image: url('imgs/landing/4015765_195_removeBG.png'); background-size: 40% auto; background-repeat: no-repeat; background-position: bottom right;"></div> -->

<style>
    #particles-js::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('../imgs/landing/reduced_hello.png');
    background-size: cover; /* Adjust the size as needed */
    background-repeat: no-repeat; /* Adjust the repeat as needed */
    animation: yourAnimation 2.5s ease-in forwards; /* Adjust the animation as needed */
    background-size: 40% auto; /* Default background size for smaller screens */
        background-repeat: no-repeat; /* Default background repeat for smaller screens */
        /* background-position: bottom -10vh right -10vh ; Default background position for smaller screens */
    background-position: 99% 100%; /* Background position at the bottom center of the page */

    }

    @keyframes yourAnimation {
    0% {
      opacity: 0.2;
      /* Define initial background properties */
    }
    30%{
      opacity: 1;
    }
    100% {
      opacity: 0.05;

      /* Define final background properties */
    }
    }
</style>

<script src="../particles.js"></script>
<script src="../app.js"></script>

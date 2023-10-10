---
layout: default
permalink: /
---

{% include landing.html %}

<!-- <div id="particles-js" style="background-image: url('imgs/landing/4015765_195_removeBG.png'); background-size: 40% auto; background-repeat: no-repeat;background-position: bottom right;" ></div> -->

<div id="particles-js"></div> 

<!-- style="background-image: url('imgs/landing/4015765_195_removeBG.png'); background-size: 40% auto; background-repeat: no-repeat; background-position: bottom right;"></div> -->

<style>
	
/* Default styles for smaller screens */
		#particles-js {
			background-image: url('../imgs/landing/4015765_195_removeBG.png');
			background-size: 40% auto; /* Default background size for smaller screens */
			background-repeat: no-repeat; /* Default background repeat for smaller screens */
			background-position: bottom right; /* Default background position for smaller screens */
   /* animation: fadeIn 2s ease-in forwards; */
		}

/* Medium-sized screens (adjust the max-width as needed) */
  @media (max-width: 447px) {
    #particles-js {
        background-repeat: no-repeat;
        background-size: 75% auto; /* Adjust background size for medium screens */
        background-position: bottom 10vh right 0;
								/* animation: fadeIn 3s ease-out 2s forwards; Adjust animation duration and delay as needed */

    }
  }
  /* Medium-sized screens (adjust the max-width as needed) */
  @media (min-width: 447px) {
    #particles-js {
        background-repeat: no-repeat;
        background-size: 75% auto; /* Adjust background size for medium screens */
        background-position: bottom 5vh right -5vh;

    }
  }
  /* Medium-sized screens (adjust the max-width as needed) */
  @media (min-width: 487px) {
    #particles-js {
        background-repeat: no-repeat;
        background-size: 75% auto; /* Adjust background size for medium screens */
        background-position: bottom -10vh right -15vh;

    }
  }

  /* Medium-sized screens (adjust the max-width as needed) */
  @media (min-width: 560px) {
    #particles-js {
        background-repeat: no-repeat;
        background-size: 75% auto; /* Adjust background size for medium screens */
        background-position: bottom -10vh right -15vh;

    }
  }
		/* Medium-sized screens (adjust the max-width as needed) */
  @media (min-width: 660px) {
    #particles-js {
        background-repeat: no-repeat;
        background-size: 55% auto; /* Adjust background size for medium screens */
        background-position: bottom -5vh right -10vh;

    }
  }
		/* Medium-sized screens (adjust the max-width as needed) */
  @media (min-width: 770px) {
    #particles-js {
        background-repeat: no-repeat;
        background-size: 55% auto; /* Adjust background size for medium screens */
        background-position: bottom right;

    }
  }

  /* Medium-sized screens (adjust the max-width as needed) */
  @media (min-width: 850px) {
    #particles-js {
        background-repeat: no-repeat;
        background-size: 40% auto; /* Adjust background size for medium screens */
        background-position: right -10vh bottom 30vh; /* Align the image 30% from the max-height of the page */
								animation: fadeIn 3s ease-out 2s forwards; /* Adjust animation duration and delay as needed */

    }
  }

  /* Larger screens (adjust the min-width as needed) */
  @media (min-width: 1200px) {
    #particles-js {
        background-repeat: no-repeat;
        background-size: 40% auto; /* Adjust background size for larger screens */
        background-position: bottom right;
    }
  }
</style>

<script src="../particles.js"></script>
<script src="../app.js"></script>

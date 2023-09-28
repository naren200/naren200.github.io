---
layout: page
title: Experience
weight: 4
permalink: /experience/
---


{% include experience/work.html %}


<br>
<hr> 
<br>


<h4 class="page-heading">Skills</h4>
<br>
<div class="row" style="width: 100%; margin-left: 10px">
{% include about/skills.html title="Programming Skills" source=site.data.programming-skills %}
{% include about/skills.html title="Other Skills" source=site.data.other-skills %}
</div>
<br>
<hr> 
<br>

<h4 class="page-heading" id="Future-Imagination">There's a long road ahead, but we're on the right track.</h4><br>



<style>
    #owl-demo{
      margin-top: 30px;
    }
    #owl-demo .item{
      border: 0px solid black;

    }
    #owl-demo .item img{
      display: flex;
      width: 100%;
      height: 125%;
    }
  </style>
  <div id ="owl-demo" class="owl-carousel owl-theme">
    <div class="item">
      <img src="../imgs/HumanLikeRobot.jpg" alt="Image"/>
    </div>
    <div class="item">
      <img src="../imgs/FutureWorld.jpg" alt=" Image"/>
    </div>
    <div class="item">
      <img src="../imgs/FlyingShip.jpg" alt="Image"/>
    </div>
    <div class="item">
      <img src="../imgs/FlyingCommunity.jpg" alt="Image"/>
    </div>
    <div class="item">
      <img src="../imgs/FutureWorld4.jpg" alt="Image"/>
    </div>
    <div class="item">
      <img src="../imgs/FutureWorld3.jpg" alt="Image"/>
    </div>

    <!-- <div class="ml-1000 mr-1000" style="background-color: #ddd;"><h4>1</h4></div>
    <div class="ml-1000 mr-1000" style="background-color: #ddd;"><h4>2</h4></div>
    <div class="ml-1000 mr-1000" style="background-color: #ddd;"><h4>3</h4></div>
    <div class="ml-1000 mr-1000" style="background-color: #ddd;"><h4>4</h4></div>
    <div class="ml-1000 mr-1000" style="background-color: #ddd;"><h4>5</h4></div>
    <div class="ml-1000 mr-1000" style="background-color: #ddd;"><h4>6</h4></div>
    <div class="ml-1000 mr-1000" style="background-color: #ddd;"><h4>7</h4></div>
    <div class="ml-1000 mr-1000" style="background-color: #ddd;"><h4>8</h4></div>
    <div class="ml-1000 mr-1000" style="background-color: #ddd;"><h4>9</h4></div>
    <div class="ml-1000 mr-1000" style="background-color: #ddd;"><h4>10</h4></div>
    <div class="ml-1000 mr-1000" style="background-color: #ddd;"><h4>11</h4></div>
    <div class="ml-1000 mr-1000" style="background-color: #ddd;"><h4>12</h4></div> -->
  </div>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js" integrity="sha512-894YE6QWD5I59HgZOGReFYm4dnWc1Qt5NtvYSaNcOP+u1T9qYdvdihz0PPSiiqn/+/3e7Jo4EaG7TubfWGUrMQ==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/owl.carousel.min.js" 
        integrity="sha512-bPs7Ae6pVvhOSiIcyUClR7/q2OAsRiovw4vAkX+zJbw3ShAeeqezq50RIIcIURq7Oa20rW2n2q+fyXBNcU9lrw==" 
        crossorigin="anonymous" referrerpolicy="no-referrer">
  </script>

  <script type="text/javascript">$('.owl-carousel').owlCarousel({
    loop:true,
    margin:0,
    nav:true,
    autoHeight:true,
    autoplay: true, // Enable autoplay
    autoplayTimeout: 2000, // Set autoplay timeout in milliseconds (2 seconds in this example)
    responsive:{
        0:{
            items:1
        },
        600:{
            items:1
        },
        1000:{
            items:3
        }
    }
  })
  </script>


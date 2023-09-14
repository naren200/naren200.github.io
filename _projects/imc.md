---
name: International eYantra Robotics Competition
tools: [Vrep, Hardware Implementation, Sensors Integration, Actuators, Debugging, Troubleshooting, embedded C, Path Planning, Robot Communication, 3D Design, Prototyping, CNC Machining]
image: ../imgs/projects/cob-homeImage.png
description: Simulated an autonomous bot using ROS & Gazebo to solve an unknown maze in the shortest time
number: three
---

# International eYantra Robotics Competition

## Motivation
<img src="../imgs/projects/cob-introduction.png" alt="drawing" width="800"/>

Environmental conditions such as extreme rainfall, earthquakes, landslides and floods often cause natural disasters which lead to tremendous loss of life and property, causing great disruption in people’s lives and the economy. In 2018, across the world there were 315 natural disaster events recorded with 11,804 deaths, over 68 millions of people were affected, and 131.7 billion dollars in economic losses.

After a disaster strikes, governments and private organizations engage in reconstruction efforts of infrastructure, such as roads, bridges, power and railway lines, houses etc. This is a very labor and capital-intensive task. Moreover, doing this at a disaster site, with its multiple associated risks and challenging terrain, poses an additional challenge. Motivated by this scenario, in order to help the needy victims in the affected areas, this edition of e-Yantra Robotics Competition (eYRC 2019-20) presents the theme Contruct-o-Bot.

## Theme - Construct-O-Bot 
In this theme, the arena is an abstraction of a disaster site where the robot picks the construction material and traverses paths in order to deposit it at the site to be reconstructed. In order to maneuver over these paths, the Construct-O-Bot has to use intelligent line-following and path-planning algorithms to reach safely and quickly using shortest paths. After reaching the site, the Construct-O-Bot carefully has to place the material at the required positions which may include placing the material at different heights from the ground. It has to deposit all required material at multiple construction sites, navigating through various terrains.

The team that finishes the given task in the least amount of time whilst incurring the least penalties will be declared the winner.
<img src="../imgs/projects/cob-Arena.png" alt="drawing" width="850"/>

## Objective
The objective was to design an autonomous bot simulated using ROS and Gazebo to reach from the corner square to the center of an unknown maze in the shortest time.

My team consisted of <a href="https://trunc8.github.io/">Siddharth Saha</a> and Shubham Agrawal. Led by Siddharth, our team won the competition completeling the track in minimum time with no penalities!

Our implementation can be seen <a href="https://www.youtube.com/watch?v=PcbNQ-tVwQw">here</a> and the link the repository is <a href="https://github.com/trunc8/international-micromouse-techfest2020">here.</a>


1) white line sensor: 
                line following           
                node detection
                Black-White-Black following 
                zig zag line following   (time consuming & not effective)

2) proximity sensor:
                wall following 
                House/Block detection 
3) Servo motor:
                Pick blocks
                Place on different height (Low rise & High rise)
                2 Servo arm design (effective & used)
                1 servo arm design



## Hardware 
- Sensors
        - Proximity Sensor/ Sharp Sensor
        - White Line Sensor
- Actuators
        - Geared DC Motor with Encoder
        - Servo Motors
- Micro-Controllers
        - Atmega 2560 Development board
- Miscellaneous
        - LCD
        - L298N Motor Driver
        - Buzzers
        - Potentiometers

### Hardware Testing Before Assembly

<iframe width="560" height="315" src="https://www.youtube.com/embed/AbuGMjoGe7Q?si=x4FHMmbtjjgI6C3F" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>


### Hardware Testing After Assembly
<img src="../imgs/projects/cob-robotAllsideView.png" alt="drawing" width="650"/>

<iframe width="560" height="315" src="https://www.youtube.com/embed/RYoa6PcAsZs?si=F6VTSUC6STHSGCrw" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>


## Virtual Simulation - V-Rep
<iframe width="1060" height="515" src="https://www.youtube.com/embed/UqZlvbHdpMs?si=1xlNS-8Qw6fTCUFS" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

## <u> Solidworks Design and CNC Machining</u>
<img src="../imgs/projects/cob-DesignSolidWorks.png" alt="drawing" width="650"/>


## Final Task - Project Submission Video

<iframe width="1060" height="515" src="https://www.youtube.com/embed/V-e3XbXu6AY?si=2X5BBffCpzHD_z1v" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>


## Retrofitting Problems Faced

### Challenge 1: Misorientation of Gripper

**Problem:** Due to increased vibration and shivering of the robot during fast movement, misorientation of the gripper before picking the material (M) is possible, leading to the gripper not picking up the material during simulation in reality.

**Solution:** Increase the contact-surface area of the gripper. (See Fig. 4 )

### Challenge 2: Height of Material (M)

**Problem:** Our robot is 15cm in height, and it needs to pick up material (M) from a 3cm height.

**Solution:** Implement an L-shaped arm or 2 movable links consisting of 2 servos for the arm and 1 servo for the gripper. This solution is chosen for cost-effectiveness and better problem-solving with limited time. (See Fig. 5 & 6)

<img src="../imgs/projects/cob-RoboticArm.png" alt="drawing" width="850"/>

### Challenge 3: Placing Material (M) at Different Heights (HHP)

**Problem:** When placing the material (M) in high-height places (HHP), it's challenging to differentiate the elevation of the placement location.

**Solution:** Assume a fixed map of the industrial place. Save the elevation of the house or structure near that NODE in the map of the algorithm.

### Challenge 4: Sensor Data Display

**Problem:** Initially, an LCD display was used to display all sensor readings to calibrate the robot's algorithm. The LCD display introduced lag, making it impossible to extract maximum sensor data for smooth simulation.

**Solution:** Exclude the LCD display and establish serial communication using Tera-Term to log data via the serial port. This eliminates lag issues and allows for the extraction of maximum sensor data.

### Challenge 5: Sharp Line Sensor Calibration

**Problem:** The Sharp line sensor had issues when detecting black-colored lines. Sensor data extracted depended on the battery charge, leading to calibration problems.

**Solution:** Implement three sets of calibrated values dependent on the battery level of the robot. This calibration approach was determined through trial-and-error methods after various simulations.
 



## Achievements 

---
name: Kinova Gen 3 Robotic Arm - Singularity analysis
tools: [Matlab, Robotic arm, Singularity Space, 6-DoF, Trajectory Planner, Inverse Kinematics]
image: ../imgs/projects/roboticarm.png
description: Gain understanding of 6 DoF robotic arm's behavior in complex manipulation scenarios.
---

## Singularity Analysis of a Robotic Arm
<br>

#### **Problem Statement**
Singularity introduces a challenge for manipulation tasks. This project gives an insight into how the manipulator behaves and what causes the abnormal behaviour when the singularity is approached during a task. The objective of this project is to observe the behavior of the 6 DoF robotic arm in singularity space. 

<img src="../imgs/projects/gen3.png" alt="drawing" width="250"/>

#### **Results**

<img src="../imgs/projects/gen3Results1.png" alt="drawing" width="850"/> <br>

*End effector moving into the singularity space v/s determinant graph*
<img src="../imgs/projects/gen3Results2.png" alt="drawing" width="850"/> <br>
*Normal Trajectory versus Singular Trajectory*
<img src="../imgs/projects/gen3Results3.png" alt="drawing" width="850"/>

#### **Observations**
The determinant of along the trajectory, once the robot entered it’s singularity, the value of determinant can drop from 10-4 to 10-6 in 0.005 seconds. (Average joint velocity increase from 2 x 10-3 m/s to 5 x 10-1 m/s). The singularity effects all the joints of the arm, although the amplitude of the effect may vary from joint to joint. In simulation, singularity can cause million times larger in maximum angular velocity which a  real world robot’s motor could hardly take.


#### **Presentation Slides**

<iframe src="https://docs.google.com/presentation/d/e/2PACX-1vQUG5BrX3jkEhYHvdh9zgoVh0zZMvpNCyeUpb35rtPfwb5Z0DI4L3ykOVooMImgxZ5AdRgPIX-sHgW1/embed?start=true&loop=true&delayms=3000" frameborder="0" width="960" height="569" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>
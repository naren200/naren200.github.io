---
name: SeDriCa, Unmesh Mashruwala Innovation Cell
tools: [Decision Making Subsystem]
image:
description: Working in a 20+ member team aiming to develop a self-driving car capable of transversing on Indian roads
external_url: 
---

# SeDriCa, Unmesh Mashruwaala Innovation Cell

We are a team of 20+ students working on building a self-driving car. We are presently aiming at <a href="http://www.igvc.org/index.htm">Intelligent Ground Vehicle Challenge(IGVC) 2022</a> particularly the Self Drive Challenge, held at Oakland University, Michigan. Our SedriCa comprises five subsystems: Perception (CV), Localisation, Path Planning, Decision Making, and Controls!

* Computer vision module defines the understanding of the world in which our car is driving. This allows identifying cars, pedestrians, lanes, traffic signs, etc.

* The localisation pipeline uses odometry, Kalman filter and Lidar slam to help ego vehicle localise itself. It also perform sensor fusion and merge data from other sensors such as Lidar to complement those obtained by the camera, making it possible to estimate the object's position identified by the camera.

* We use an integrated motion Planning & Decision-Making pipeline to implement the brain of the autonomous vehicle. It uses the knowledge of the environment and its position to plan trajectories. A finite state machine is used as a decision-making method to define possible states of the car according to the situation. The motion planning system uses Hybrid A* to find a path. Further, with decision making, it performs velocity planning on the trajectory.

* The control module is responsible for moving the vehicle by generating an angle for the steering wheel and acceleration. 
The reference path plan received by the planning subsystem and the current state obtained from the Localisation is fed into our control algorithm -- NMPC,  which then solves an optimal control problem constrained by the vehicle dynamics model along with other mechanical constraints.
The optimisation solver has three requirements-
1. constraints such as road conditions, wheel slip and trajectory generated.
2. Next, a model which is a dynamic bicycle model 
3. Finally, a cost function.

The NMPC algorithm looks at N-steps ahead using the vehicle model provided and calculates the best possible inputs for the system by optimising the cost function. The control outputs thus generated are then applied to the vehicle using drive by wire via the CAN module, and feedback is received for the next step, where this process is repeated to complete the closed-loop control.

We also implement a CAN module to communicate data between the calculated control input and the actuators. Further, we also use it to get feedback on the odometer and the status of the battery.

We have <a href="https://youtu.be/8lNKjX0-RKY">demonstration video</a> for the work that was done with SeDriCa.
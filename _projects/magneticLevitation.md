---
name: Control Of Magnetic Levitation Using PID and LQR Controllers
tools: [Matlab, SISO, LQR Controller, PID, Pre-compensator]
image: ../imgs/projects/pidLqr.png
description: Achieved stable closed-loop dynamics, demonstrating precise control and eliminating steady-state errors.
---

## Control Of Magnetic Levitation Using PID and LQR Controllers​
<br>

#### **Problem Statement**
Characterize a Single Input Single Output (SISO) system by identifying the input (applied current, I) and output (system's position, x). Utilize the dynamic equation of motion, incorporating gravitational (Fg) and magnetic forces (Fm), followed by linearization around an operational point (xe, Ie) to simplify equations for control theory applications.

<img src="../imgs/projects/pidLqr_ps.jpg" alt="drawing" width="350"/>

#### **PID - Block Diagram & Results**

<img src="../imgs/projects/pidResults2.png" alt="drawing" width="850"/> <br>

*Figure 1: Block Diagram for closed Loop System* 

<img src="../imgs/projects/pidResults.png" alt="drawing" width="850"/> <br>

*Figure 2:  Amplitude response plot of Tuned and Blocked PID controllers*


#### **LQR - Block Diagram & Results**

<img src="../imgs/projects/lqr_results2.png" alt="drawing" width="850"/> <br>

*Figure 3: Block Diagram for State Feedback Controller with pre-compensator*

<img src="../imgs/projects/lqr_results1.png" alt="drawing" width="850"/>

*Figure 4: Step response with LQR and pre-compensator (for each states)*


#### **Conclusion of Observations**
The project successfully achieves stable closed-loop system dynamics through the designed LQR state feedback controller and precompensator. The simulation results demonstrate impressive metrics such as swift rise time, settling time, and absence of overshoot. The incorporation of a precompensator significantly eliminates steady-state errors, highlighting its pivotal role in achieving precise control. Challenges related to inherent nonlinearities are acknowledged, and ongoing efforts towards refining the model for robustness and real-world applicability are emphasized. The project underscores the importance of linearization in controller design and sets the stage for further improvements and experimental validation.



#### **Presentation Slides**

<iframe src="https://docs.google.com/presentation/d/e/2PACX-1vQOPmrw99LojSj1vn1lqA9D9t3CDSyMnwWv-j59ZS4JJp3nwmKeWRWIORwgPBjfrIlLO0OWt7BFIQ9Y/embed?start=false&loop=true&delayms=3000" frameborder="0" width="960" height="569" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>


#### **Report**
<div style="text-align: center;">
    <iframe class="pdfiframe" src="../pdfs/MAE506_Advanced_modeling.pdf" width="80%" height="900px" frameborder="0"></iframe>
</div>

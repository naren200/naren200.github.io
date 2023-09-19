---
name: Visual Tracking Unmanned Vehicle - Mambo Drone 
tools: [Sensor Fusion, Control Systems, Kalman Filter, Computer Vision, Matlab]
image: ../imgs/projects/uav-HomeImage.jpeg
description: Developing a low-cost mini drone line-tracking algorithm using vision-based control and model-based software design, with rigorous testing and MATLAB-based implementation.

---


# Mambo Drone - Line Following Algorithm through Image Processing

## Project Overview
The Mambo Drone Line Following Algorithm project showcases an innovative application of robotics and computer vision technology. This project's primary objective is to enable a Parrot Mambo Fly mini-drone to autonomously follow a designated path using image processing techniques. By harnessing the power of control systems, sensor fusion, localization, mapping, and a sophisticated navigation module, this project aims to demonstrate the mini-drone's ability to track and follow a predefined line accurately.

## Control Systems for Drone
In this project, the control system is at the heart of ensuring precise and stable flight for the Mambo drone. The control system consists of several components, including altitude control, orientation control (roll, pitch, and yaw), and line following control. Each of these components plays a crucial role in maintaining the drone's stability and alignment with the desired path.

## Sensor Fusion and Kalman Filter
To achieve accurate and reliable flight control, sensor fusion is implemented. The drone relies on various sensors, such as accelerometers, gyroscope, barometer, and an optical flow sensor from its downward-facing camera. The Kalman filter algorithm is utilized to combine data from these sensors, providing an accurate estimation of the drone's state, including position, orientation, and velocity. Sensor fusion ensures that the drone can maintain stable flight even in the presence of external disturbances.

## Localization and Mapping
Accurate localization and mapping are essential for the drone to understand its position relative to the predefined path. Through the fusion of sensor data and advanced algorithms, the drone builds a map of its environment and continuously updates its position within that map. This mapping and localization information are used to ensure the drone remains on the desired path, adjusting its trajectory as needed.

## Navigation Module
The navigation module is the brain behind the Mambo drone's ability to follow the line accurately. It takes the processed image data from the downward-facing camera, detects the line's position, and calculates the necessary control inputs to keep the drone on track. The navigation module is equipped with image processing techniques, including edge detection, color thresholding, and contour analysis, to precisely follow the line's path.

## Conclusion
The Mambo Drone Line Following Algorithm project demonstrates the integration of control systems, sensor fusion, localization, mapping, and advanced image processing for autonomous navigation. By successfully implementing these components, the mini-drone can autonomously follow a designated line, showcasing the potential of robotics and computer vision in real-world applications. This project serves as a testament to the capabilities of modern drones and their potential in various industries, from logistics to agriculture and beyond.
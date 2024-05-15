---
name: Deep Convolutional Generative Adversial Network (DcGANs)
tools: [Python, Tensorflow, Large Dataset, Keras, Numpy]
image: ../imgs/projects/gan-homeImage_out.webp
description: Worked in a team of 4 on a project involving DCGANs for realistic image generation.
is_project_page: true

---

### **Deep Convolutional Generative Adversarial Networks (DCGAN)**

Implemented a Deep Convolutional Generative Adversarial Network (DCGAN) using Python, TensorFlow, and Keras in a team of 4 for realistic image generation from the Fashion MNIST dataset. Achieved visually similar fashion item images after 50 epochs of training, with a comprehensive overview of the architecture, training process, and outcomes. Demonstrated applications of GANs in computer vision, serving as a foundational project for further exploration. Technologies include Python, TensorFlow, Keras, and Numpy.

----

##### Training
- **Training Parameters**:
  - Trained for 50 epochs.
  - Batch size of 128.
  - Learning rate set to 2e-4.
  - Generator input: Random noise vectors of 100 numbers, sampled from a uniform distribution between -1 to 1.
  - Generator uses deconvolution layers for upsampling.

- **Evaluation Metrics**
  - **Metric**: Accuracy.
  - **Use**: Binary classification accuracy for generated images.
  - **Note**: Both classes (real and generated) are equally important.
  - **Loss Function**: Binary Cross-Entropy (Log Loss).
    <img src="../imgs/projects/gan-logloss.png" alt="drawing" width="850"/>
  - **Game of Minimax**: 
    <img src="../imgs/projects/gan-equation.jpg" alt="drawing" width="650"/>

----


### **Outcomes**

<img src="../imgs/projects/gan-resultsepoch1and50.png" alt="drawing" width="950"/>

<div style="text-align: center;">
    <iframe width="560" height="560" src="https://www.youtube.com/embed/cyXw7y1FSA0?si=uLTzm8v80Qx5R5La" title="YouTube video player" frameborder="0" allow="accelerometer;   clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>


##### Graph of the DCGAN loss vs. epoch
<img src="../imgs/projects/gan-graph.png" alt="drawing" width="550"/>


<br>

<div style="text-align: center;">
    <i>Wanna know more about this project? Blogged <a href="/blog/dcganblog">here</a></i>
</div>

<br>
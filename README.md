# Ecogaia

This project was built using MongoDB, Express, Angular, and Node.js, and provides a solid foundation for creating scalable and performant web applications.

Our application is a modern web application built using Angular for the frontend and Express for the backend. We have implemented lazy loading techniques for efficient loading of components, ensuring fast and smooth user experience.

The application is securely authenticated with JSON Web Tokens (JWT) for user authentication and authorization, ensuring that sensitive data is protected. We have built services to connect the frontend to the backend, which allow for efficient data transfer and handling.

The architecture of the project consists of two parts, the frontend and the backend, both hosted on AWS.
# Architecture
 The frontend is comprised of a static web page hosted on S3 and served through a Content Delivery Network to ensure fast loading times for users, protected with SSL certificate.
![Frontend Architecture](https://disgrafic-product-bucket-sand.s3.us-east-2.amazonaws.com/varios/frontend-architecture-ecogaia.png)

 The backend is hosted in a Virtual Private Cloud (VPC) and utilizes AWS Fargate for running computational tasks. The Fargate containers are orchestrated by AWS Elastic Container Service (ECS) and are behind a Load Balancer to ensure high availability and scalability. This architecture allows for a highly performant and resilient application while also providing the ability to scale resources up and down as needed.
 
![Backend Architecture](https://disgrafic-product-bucket-sand.s3.us-east-2.amazonaws.com/varios/backend-architecture-ecogaia.png)


## Getting Started (Running locally)

The project comes with a pre-configured docker-compose.yml file, making it easy to set up and run the project with a single command. Additionally, the project requires a few environment variables to be set, including `MONGO_URI, JWT_SECRET`, `ACCESS_TOKEN_MERCADOPAGO`, and `ACCESS_TOKEN_MERCADOPAGO_DEVELOPMENT` which are used to configure various aspects of the application.

To get started with this project, you will need to have Docker and Docker Compose installed on your machine. If you don't have these tools installed, you can download them from the Docker website.

Once you have Docker and Docker Compose installed, follow these steps to run the project:

1. Clone or download the project from its repository.

2. Open a terminal window and navigate to the project directory.

3. Set the required environment variables.

``` bash
export MONGO_URI=mongodb://mongodb:27017/database_name
export JWT_SECRET=secret_key
export ACCESS_TOKEN_MERCADOPAGO=your_access_token
export ACCESS_TOKEN_MERCADOPAGO_DEVELOPMENT=your_access_token_development
```
- Start the project using the docker-compose up command:

``` docker
docker-compose up
```
This will start the MongoDB, Express, Angular, and Node.js containers, and you should be able to access the application by navigating to http://localhost:4200 in your web browser.

## Creating an Administrator User
In order to manage the CRUD products API, you will need to create a user with the role of "ADMINISTRATOR".  If we use the endpoint for create user it is going to create a user of role "CLIENT" by default so you should modify this in the db.

# Conclusion

This MEAN stack project provides a solid foundation for building modern web applications using MongoDB, Express, Angular, and Node.js. With the pre-configured docker-compose.yml file and the required environment variables, you should be able to get up and running with the project quickly and easily.

If you encounter any issues or have any questions, feel free to reach out to the project's community or open an issue in the project's repository.# ecogaia-project

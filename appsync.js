Step 1: Set Up MongoDB
Create a MongoDB Atlas account or use an existing one.
Set up a new cluster and a database in MongoDB Atlas.
Create a collection within your database, representing your vehicle-related data.
Step 2: Create an AppSync API
Open the AWS Management Console and navigate to the AppSync service.

Click on "Create API."

Choose "Build from scratch."

Enter a name for your API (e.g., VehicleDataAPI).

Click on "Create."

In the "Schema" section, define a GraphQL schema (schema.graphql). For example:

graphql
Copy code
type Vehicle {
  id: ID!
  make: String!
  model: String!
  year: Int!
}

type Query {
  getVehicle(id: ID!): Vehicle
  listVehicles: [Vehicle]
}
Click on "Save Schema" and then "Deploy."

Step 3: Set Up a MongoDB Data Source
In the AppSync console, go to the "Data" section.
Click on "Create" to add a new data source.
Choose "Create a new data source."
Enter a name for the data source (e.g., VehicleMongoDB).
Select the data source type as "AWS Lambda function."
Step 4: Set Up a Lambda Function Resolver
In the "Resolvers" section of the AppSync console, click on "Create Resolver" for the getVehicle query.

For the data source, select the data source you created in Step 3 (VehicleMongoDB).

Choose "Create a new Lambda function."

Enter a name for the function (e.g., GetVehicleFunction).

In the "Function code" section, use the following example code:

javascript
Copy code
const { MongoClient } = require("mongodb");

exports.handler = async (event) => {
    const uri = "YOUR_MONGODB_CONNECTION_STRING";
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();

        const database = client.db("YOUR_MONGODB_DATABASE");
        const collection = database.collection("YOUR_MONGODB_COLLECTION");

        const result = await collection.findOne({ _id: event.arguments.id });

        return result;
    } finally {
        await client.close();
    }
};
Replace YOUR_MONGODB_CONNECTION_STRING, YOUR_MONGODB_DATABASE, and YOUR_MONGODB_COLLECTION with your MongoDB connection string, database name, and collection name.

Click on "Create Resolver."

Step 5: Create a Resolver for listVehicles
Similarly, create a resolver for the listVehicles query using a Lambda function:

javascript
Copy code
const { MongoClient } = require("mongodb");

exports.handler = async () => {
    const uri = "YOUR_MONGODB_CONNECTION_STRING";
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();

        const database = client.db("YOUR_MONGODB_DATABASE");
        const collection = database.collection("YOUR_MONGODB_COLLECTION");

        const result = await collection.find({}).toArray();

        return result;
    } finally {
        await client.close();
    }
};
Replace YOUR_MONGODB_CONNECTION_STRING, YOUR_MONGODB_DATABASE, and YOUR_MONGODB_COLLECTION with your MongoDB connection string, database name, and collection name.

Click on "Create Resolver."

Step 6: Test the Queries
In the AppSync console, go to the "Queries" section.

Create new queries:

graphql
Copy code
query GetSingleVehicle {
  getVehicle(id: "your-vehicle-id") {
    id
    make
    model
    year
  }
}

query ListAllVehicles {
  listVehicles {
    id
    make
    model
    year
  }
}
Click on "Run" to execute the queries.

You should see responses with the vehicle data from your MongoDB collection.

These steps outline a basic setup for reading vehicle-related data from MongoDB using AWS AppSync. Customize the schema, resolver code, and queries based on your specific use case and data model.

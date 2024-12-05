const database = 'WORKFLOW_MANAGER';
const collection = 'workflows';

// Create a new database.
use(database);

// Create a new collection.
db.createCollection(collection);


// Create a new document in the collection.
db.getCollection(collection).insertOne({
    name: "Example Workflow",
    steps: [
        { task: "collectData", onFailure: "handleFailure" },
        { task: "createContent" }
    ]
});

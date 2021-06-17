const server = require("./app");

try {
    server.listen(3000, () => {
        console.log("Server started on port 3000")
    })
} catch (error) {
    console.log("Error ->", error);
}
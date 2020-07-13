module.exports = ({ env }) => (
  {
    "defaultConnection": "default",
    "connections": {
      "default": {
        "connector": "mongoose",
        "settings": {
          "uri": "mongodb+srv://admin:admin@cluster0.v6j6i.mongodb.net/alislam?retryWrites=true&w=majority"
        },
        "options": {
          "ssl": true
        }
      }
    }
  }
);

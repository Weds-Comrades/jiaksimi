<?php
class Tag {
    // database connection and table name
    private $conn;

    // object properties
    private $id;
    private $name;
    private $uid;

    // constructor with $db as database connection
    public function __construct($db) {
        $this->conn = $db;
    }

    // get all tags
    public function getAll() {
        // select all
        $query = "SELECT * FROM Tag";

        // prepare query and execute
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    // get one tag - no use case for it yet
    
}
?>
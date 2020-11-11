<?php 
class User {
    // database connection and table name
    private $conn;

    // object properties
    private $id;
    private $email;
    private $name;
    private $photo_location = null;
    private $password;

    private $filter_distance;
    private $filter_tags = array();
    
    // constructor
    public function __construct($db) {
        $this->conn = $db;
    }

    // get user by email
    public function getUserByEmail($email) {
        // query to read single record
        $query = "
            SELECT * FROM User
            WHERE email = ?
            LIMIT 0,1
        ";

        // prepare query and execute
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $email);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        // set values to object properties
        if ($row) {
            // echo($row['id']);
            $this->id = $row['id'];
            $this->email = $row['email'];
            $this->password = $row['password'];
            $this->name = $row['name'];
            $this->photo_location = $row['photo'];

            $this->getTags();
            $this->getPreferredDistance();
        }

        return $row ? true : false;
    }

    // get user by id
    public function getUserById($id) {
        // query to read single record
        $query = "
            SELECT * FROM User
            WHERE id = ?
            LIMIT 0,1
        ";

        // prepare query and execute
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $id);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row) {
            // set values to object properties
            $this->id = $row['id'];
            $this->email = $row['email'];
            $this->password = $row['password'];
            $this->name = $row['name'];
            $this->photo_location = $row['photo'];

            $this->getTags();
            $this->getPreferredDistance();
        }

        return $row ? true : false;
    }

    // get user information
    public function getUserInformation() {
        return array(
            "email" => $this->email,
            "name" => $this->name,
        );
    }

    // get user_distance by id
    public function getPreferredDistance() {
        // query to read single record
        $query = "
            SELECT * FROM User_Distance
            WHERE user_id = ?
            LIMIT 0,1
        ";

        // prepare query and execute
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        $this->filter_distance = isset($row['distance']) ? $row['distance'] : 0;
    }

    // get all preferred user_tags by id
    public function getTags() {
        // query to read single record
        $query = "
            SELECT * FROM User_Tag
            WHERE user_id = $this->id
        ";

        // prepare query and execute
        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            // extract row
            // this will make $row['tag_uid'] to just $tag_uid only
            extract($row);

            array_push($this->filter_tags, $this->getTagUID($tag_id));
        }
    }

    // get all user_favourite locations
    public function getFavouriteLocations() {
        // query to read single record
        $query = "
            SELECT * FROM User_Favourite
            WHERE user_id = $this->id
        ";

        // prepare query and execute
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $locations = array();

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            // extract row
            // this will make $row['tag_uid'] to just $tag_uid only
            extract($row);
            array_push($locations, $places_id);
        }

        return $locations;
    }

    // check if location is favourited, return true or false
    public function isLocationFavourite($place_id) {
        // query check if $place_id exist
        $query =  "SELECT * FROM User_Favourite
            WHERE user_id = :id AND places_id = :uid
            LIMIT 0,1
        ";

        $data = [
            'id' => $this->id,
            'uid' => $place_id,
        ];

        // prepare query and execute
        $stmt = $this->conn->prepare($query);
        $stmt->execute($data);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row ? true : false;
    }

    // add user favourite record to database
    public function addFavouriteLocation($place_id) {
        $query = " INSERT INTO User_Favourite (user_id, places_id) VALUES (:id, :uid)";
        $data = [
            "id" => $this->id,
            "uid" => $place_id,
        ];

        $stmt = $this->conn->prepare($query);
        return $stmt->execute($data);
    }

    // remove user favourite record to database
    public function removeFavouriteLocation($place_id) {
        $query = "DELETE FROM User_Favourite 
            WHERE user_id = :id AND places_id = :uid
        ";
        $data = [
            "id" => $this->id,
            "uid" => $place_id,
        ];

        $stmt = $this->conn->prepare($query);
        return $stmt->execute($data);
    }

    // return user details
    public function getUserDetails() {
        return array(
            "user_id" => $this->id,
            "email" => $this->email,
            "name" => $this->name,
            "photo" => $this->photo_location,
        );
    }

    // return user filter settings()
    public function getUserFilterSettings() {
        return array(
            "user_id" => $this->id,
            "distance" => $this->filter_distance,
            "tags" => $this->filter_tags,
        );
    }

    /* 
     * verify password input with hash
     * assume that password is saved in Object already
     * return Boolean
    */
    public function isPasswordMatch($password_input) {
        return password_verify($password_input, $this->password);
    }

    /**
     * Get id of tags
     * Pass uid, return id in database
     */
    public function getTagId($tag_uid) {
        $find_tag_id = $this->conn->prepare("SELECT * FROM Tag WHERE tag_uid = '$tag_uid' LIMIT 1");
        $find_tag_id->execute();
        $tag_id = $find_tag_id->fetch(PDO::FETCH_ASSOC);
        return $tag_id ? $tag_id['id'] : false;
    }

    /**
     * Get tag_id of tags
     * Pass id, return tag_uid in database
     */
    public function getTagUID($id) {
        $find_tag_id = $this->conn->prepare("SELECT * FROM Tag WHERE id = $id");
        $find_tag_id->execute();
        $tag_id = $find_tag_id->fetch(PDO::FETCH_ASSOC);
        return $tag_id ? $tag_id['tag_uid'] : false;
    }


    // ---- Set Functions ----------- //
    // assume you did validation on your side and is hashed
    public function setUserDetails($new_email = null, $new_name = null, $new_password_hash = null, $new_photo = null) {
        // assume you did validation on your side and is hashed
        $this->email = $new_email == null ?  $this->email : $new_email;
        $this->password = $new_password_hash == null ?  $this->password : $new_password_hash;
        $this->name = $new_name == null ?  $this->name : $new_name;
        $this->photo_location = $new_photo == null ?  $this->photo_location : $new_photo;
    }

    // override everything in filter
    public function setFilter($new_dist, $new_tags = array()) {
        $this->filter_distance = $new_dist;
        $this->filter_tags = $new_tags;
    }

    // update database
    public function saveUser() {
        // if id is not set INSERT else UPDATE
        $data = array(
            ':email' => $this->email,
            ':password' => $this->password,
            ':name' => $this->name,
        );

        if ($this->photo_location != null) {
            // if photo_location is NULL, dont include in $data
            $data[':photo'] = $this->photo_location;
            $query = isset($this->id) ? 
                "UPDATE User SET email=:email, password=:password, name=:name, photo=:photo WHERE id = $this->id"
                    : 
                "INSERT INTO User (email, password, name, photo) VALUES (:email, :password, :name, :photo)";
        }
        else {
            $query = isset($this->id) ? 
                "UPDATE User SET email=:email, password=:password, name=:name WHERE = $this->id"
                    : 
                "INSERT INTO User (email, password, name) VALUES (:email, :password, :name)";
        }
        
        $stmt = $this->conn->prepare($query);
        return $stmt->execute($data);
    }

    public function saveFilters() {
        // search if records exists
        // We will need to check to insert or update
        $saveFilters = array();
            
        // distance records exists
        $stmt_dist_exist = $this->conn->prepare("SELECT * FROM User_Distance WHERE user_id = $this->id");
        $stmt_dist_exist->execute();

        // if exists UPDATE records of DISTANCE, otherwise INSERT because new
        $stmt_dist = $stmt_dist_exist->rowCount() > 0 ? 
        $this->conn->prepare("UPDATE User_Distance SET distance = $this->filter_distance WHERE user_id = $this->id") :
            $this->conn->prepare("INSERT INTO User_Distance (user_id, distance) VALUES ($this->id, $this->filter_distance)");
        $saveFilters['distance'] = $stmt_dist->execute();

        // tags records exists
        $stmt_tags_exist = $this->conn->prepare("SELECT * FROM User_Tag WHERE user_id = $this->id");
        $stmt_tags_exist->execute();

        // if exists DELETE records of TAGS
        if ($stmt_tags_exist->rowCount() > 0) {
            $stmt_delete_tags = $this->conn->prepare("DELETE FROM User_Tags WHERE user_id = $this->id");
            $stmt_delete_tags->execute();
        }

        // Loop through all the tags and create a statement
        if (!empty($this->filter_tags)) {
            $isTagValid = true;

            foreach ($this->filter_tags as $tag){
                // find $tag with its id in the database
                $tag_id = $this->getTagId($tag);
                $sql = "INSERT INTO User_Tag (user_id, tag_id) VALUES ($this->id, $tag_id)";
                $stmt_insert_tags = $this->conn->prepare($sql);
                $isTagValid = $stmt_insert_tags->execute() && $isTagValid;
                $stmt_insert_tags->closeCursor();
            }
            $saveFilters['tag'] = $tag_id;
        }
        
        return $saveFilters;
    }
}  
?>

<?php 
class User {
    // database connection and table name
    private $conn;

    // object properties
    private $id;
    private $email;
    private $name;
    private $photo_bin = null;
    private $password;

    private $filter_distance;
    private $filter_tags = array();
    
    // constructor
    public function __construct($db) {
        $this->conn = $db;
    }

    // do not create a JSON due to potential security issue
    // logins should never be revealed in a public JSON

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
        $this->id = $row['id'];
        $this->email = $row['email'];
        $this->password = $row['password'];
        $this->name = $row['name'];
        $this->photo_bin = $row['photo'];

        $this->getTags();
        $this->getPreferredDistance();
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

        // set values to object properties
        $this->id = $row['id'];
        $this->email = $row['email'];
        $this->password = $row['password'];
        $this->name = $row['name'];
        $this->photo_bin = $row['photo'];

        $this->getTags();
        $this->getPreferredDistance();
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
            WHERE user_id = ?
        ";

        // prepare query and execute
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        $stmt->execute();
        $stmt->getAll();

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            // extract row
            // this will make $row['tag_uid'] to just $tag_uid only
            extract($row);
            array_push($this->filter_tags, $tag_id);
        }
    }

    // get all user_favourite locations by id
    public function getFavouriteLocations() {
        // query to read single record
        $query = "
            SELECT * FROM User_Favourite
            WHERE user_id = ?
        ";

        // prepare query and execute
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        $stmt->execute();
        $stmt->getAll();
        $locations = array();

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            // extract row
            // this will make $row['tag_uid'] to just $tag_uid only
            extract($row);
            array_push($locations, $places_id);
        }

        return $locations;
    }

    // return user details
    public function getUserDetails() {
        return array(
            "user_id" => $this->id,
            "email" => $this->email,
            "name" => $this->name,
            "photo" => $this->photo_bin,
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

    // update user details
    public function updateDetails($id, $email, $password, $name, $photo) {
        // STEP 1
        $connMgr = new ConnectionManager();
        $conn = $connMgr->connect();

        // STEP 2
        $sql = "UPDATE
                    user
                SET
                    'email' = ':email',
                    'password' = ':password',
                    'name' = ':name',
                    'photo' = ':photo'
                WHERE 
                    id = :id";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->bindParam(':email', $email, PDO::PARAM_STR);
        $stmt->bindParam(':password', $password, PDO::PARAM_STR);
        $stmt->bindParam(':name', $name, PDO::PARAM_STR);
        $stmt->bindParam(':photo', $photo, PDO::PARAM_STR);


        // STEP 3
        if( $stmt->execute() ) {
            // STEP 4
            $stmt = null;
            $conn = null;
            return true;
        }

        // STEP 4
        return false;
        }

    /* 
     * verify password input with hash
     * assume that password is saved in Object already
     * return Boolean
    */
    public function isPasswordMatch($password_input) {
        return password_verify($password_input, $this->password);
    }


    // ---- Set Functions ----------- //
    // assume you did validation on your side and is hashed
    public function setUserDetails($new_email = null, $new_name = null, $new_password_hash = null, $new_photo = null) {
        // assume you did validation on your side and is hashed
        $this->email = $new_email == null ?  $this->email : $new_email;
        $this->password = $new_password_hash == null ?  $this->password : $new_password_hash;
        $this->name = $new_name == null ?  $this->name : $new_name;
        $this->photo_bin = $new_photo == null ?  $this->photo_bin : $new_photo;
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

        if ($this->photo_bin != null) {
            // if photo_bin is NULL, dont include in $data
            $data[':photo'] = $this->photo_bin;
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
        $stmt_dist_exist->getAll();
        $isFilterDistanceExist = $stmt_dist_exist->rowCount() > 0;

        // tags records exists
        $stmt_tags_exist = $this->conn->prepare("SELECT * FROM User_Tag WHERE user_id = $this->id");
        $stmt_tags_exist->execute();
        $stmt_tags_exist->getAll();
        $isFilterTagsExist = $stmt_tags_exist->rowCount() > 0;

        // if exists UPDATE records of DISTANCE, otherwise INSERT because new
        $stmt_dist = $isFilterDistanceExist ? 
            $this->conn->prepare("UPDATE User_Distance SET distance = :distance WHERE user_id = $this->id") :
            $this->conn->prepare("INSERT INTO User_Distance (user_id, distance) VALUES ($this->id, $this->filter_distance)");
        $saveFilters['distance'] = $stmt_dist->execute();

        // if exists DELETE records of TAGS
        if ($isFilterTagsExist) {
            $stmt_delete_tags = $this->conn->prepare("DELETE FROM User_Tags WHERE user_id = $this->id");
            $stmt_delete_tags->execute();
        }

        // Loop through all the tags and create a statement
        if ($this->filter_tags > 0) {
            $tags_array = array();
            foreach ($tag as $this->filter_tags){
                array_push($tags_array, "($this->id, $tags)");
            }
            $insert_tags = implode(', ' , $tags_array);
            $stmt_insert_tags = $this->conn->prepare(
                "INSERT INTO User_Tag (user_id, tag_id) VALUES $insert_tags"
            );
            $saveFilters['tags'] = $stmt_insert_tags->execute();
        }    
        
        return $saveFilters;
    }

}  
?>
    var vm = new Vue({
        el: '#nav',
        data: {
            is_user_login: false,

            links: {
                'home': '../',
                'favourites': './favourites.html',
                'settings': './profile.html',
                'logout': '../../server/test/logout.php',
                'split': './bill_splitter.html',
                'login': './login.php',
            },
        },
        mounted: async function(){
            await this.getUserInfo();
        },

        methods: {
            getUserInfo: async function() {
                await axios.get('../../server/api/get-user-details.php')
                    .then((res => {
                        var user = res.data; 
                        this.is_user_login = true;
                    }))
                    .catch(err => { console.log(err); });
            }
        }
    })
    
    //add event listeners
    document.getElementById("split_pls").addEventListener("click", doSplit);
    document.getElementById("split_pls").addEventListener("click", showOutput);
    document.getElementById("return").addEventListener("click", showInput);
    document.getElementById("add_item").addEventListener("click", add_item);
    document.getElementById("add_item").addEventListener("click", function(event){
        event.preventDefault(); 
    });
    document.getElementById("split_pls").addEventListener("click", function(event){
        event.preventDefault(); 
    });
    document.getElementById("return").addEventListener("click", function(event){
        event.preventDefault(); 
    });

    //declare important information which needs to be used for all the other functions
    impt_info = new Object();
    //specify an array which should contain information about who owes what and the items they bought
    impt_info["each_person_owes"] = [];

    //do split hides the first part of the page and shows the second part
    function doSplit(){
        //reveal the second part of the page
        document.getElementById("output_section").setAttribute("class", "d-inline");

        //clear the Each Person Owes part
        var display_owe = document.getElementById("display_owe");
        display_owe.innerHTML = "";

        //Get relevant information from the first form
        var form1 = document.forms["form1"];
        var num_people = parseFloat(form1[0].value);

        //if the form does not specify the svc and gst, assume they are 0
        var svc =0;
        var gst =0;

        //if there is input in the form for svc
        if(!(form1[1].value == "")){
            svc = parseFloat(form1[1].value);
            if(isNaN(svc)){
                //to recover from errors where alphabets are entered
                svc =0;
            }
        }

        //if there is input in the form for gst
        if(!(form1[2].value == "")){
            gst = parseFloat(form1[2].value);

            //to recover from errors where alphabets are entered
            if(isNaN(gst)){
                gst =0;
            }
        }

        // console.log(svc);
        // console.log(gst);

        //store the important information in the global object impt_info
        impt_info["num_people"] = num_people;
        impt_info["svc"] = svc;
        impt_info["gst"] = gst;

        // console.log(num_people);
        // console.log(svc);
        // console.log(gst);


        var who_share_form = document.createElement("form");

        //Creating checkboxes corresponding to the number of people indicated by the user in the previous part
        for(let i = 0;i<num_people; i++){
            var who_share = document.getElementById("who_share");
            //create form
            who_share_form.setAttribute("id", "who_share_form");
            //create input
            var input = document.createElement("input");
            input.setAttribute("type", "checkbox");
            input.setAttribute("class", "form-check-input");
            input.setAttribute("id", "Person "+(i+1));
            input.checked = true;

            //create label
            var label = document.createElement("label");
            label.setAttribute("class", "form-check-label");
            var textNode = document.createTextNode("Person " + (i+1));
            label.appendChild(textNode);

            //create break
            var br = document.createElement("br");

            //insert everything
            who_share_form.appendChild(input);
            who_share_form.appendChild(label)
            who_share_form.appendChild(br);
            who_share.appendChild(who_share_form);

            
        }
    }


    //shows the first section
    function showInput(){
        document.getElementById("input_section").setAttribute("class", "d-flex justify-content-center");

        //hides the second section
        document.getElementById("output_section").setAttribute("class", "d-none");
        document.getElementById("who_share").innerHTML = "";
        // console.log(impt_info);

        //reset the fields
        impt_info.num_people = 0;
        impt_info.gst = 0;
        impt_info.svc = 0;
        impt_info.each_person_owes = [];
        var cost_details = document.forms["form2"];
        cost_details[0].value = "";
        cost_details[1].value = "";
    }

    
    //hides the first part again
    function showOutput(){
        document.getElementById("input_section").setAttribute("class", "d-none");
    }


    function add_item(){

        //get the form details for personXs
        var who_share_form = document.forms["who_share_form"];

        //get cost of the dish, name of dish
        var cost_details = document.forms["form2"];
        var dish_name = cost_details[0].value
        var dish_cost = cost_details[1].value;


        if(dish_cost == "" || dish_name==""){
            // if person doesn't enter any details, have to give them error message
            alert("Please enter both the name of the dish and the cost.")
        }
        else if(isNaN(dish_cost)){
            alert("Please enter a numerical value for the cost of the dish.")
        }
        else{
            
            dish_cost = parseFloat(dish_cost);
            console.log(dish_cost);

            var display_owe = document.getElementById("display_owe");
            display_owe.innerHTML = "<h4>Each person owes</h4>";
            console.log(impt_info.each_person_owes);

            //calculate the total cost of the dish inclusing the gst and svc
            var total_cost = dish_cost;
            console.log(total_cost);

            console.log(impt_info.svc);
            if(!(impt_info.svc==0 && impt_info.gst==0)){
                total_cost += dish_cost * (impt_info.svc/100);
                total_cost += total_cost * (impt_info.gst/100);
            }
            else if(!(impt_info.svc==0) && (impt_info.gst==0)) {
                total_cost += dish_cost * (impt_info.svc/100);
            }
            else if((impt_info.svc==0) && !(impt_info.gst==0)){
                total_cost += dish_cost * (impt_info.gst/100);
            }

            //count number of checked people
            num = 0;
            for(obj of who_share_form){
                    if(obj.checked){
                        num+=1;
                    }
            }
            // console.log(num);


            for(obj of who_share_form){
                    if(obj.checked){
                        var present = false;
                        for(each of impt_info.each_person_owes){
                            if(obj.id === each.who){
                                present = true;
                                if(isNaN(total_cost)){
                                    total_cost = 0;
                                }
                                each.owes+=total_cost/num;
                                console.log(each.owes);
                                each.dishes.push(dish_name);
                            }
                        }
                        if(!present){
                            var person = new Object();
                            if(isNaN(total_cost)){
                                    total_cost = 0;
                            }
                            person = {who: obj.id, owes:total_cost/num, dishes:[dish_name]};
                            impt_info.each_person_owes.push(person);
                            console.log(impt_info.each_person_owes);
                        }
                    }

        
            }

            // console.log(impt_info.each_person_owes);
            //appending the stuff to the right
            for(item of impt_info.each_person_owes){
                console.log(item);
                var div = document.createElement("div"); 
                div.setAttribute("id", item.who);
                div.setAttribute("style", "background-color:white; border-radius: 15px; padding:15px; margin:10px; border:rgb(236, 236, 236) solid 1.5px;")
                var h6 = document.createElement("h6");
                var who_text = document.createTextNode(item.who);
                h6.appendChild(who_text);
                div.appendChild(h6);

                var div1 = document.createElement("div");
                div1.setAttribute("id", item.who);
                var ul = document.createElement("ul");

                for(each of item.dishes){
                    console.log(each);
                    var li = document.createElement("li");
                    var dish_name_text = document.createTextNode(each);
                    li.appendChild(dish_name_text);
                    ul.appendChild(li);
                }

                var label = document.createElement("label");
                var lable_text = document.createTextNode("Total owed: $"+item.owes.toFixed(2));
                label.appendChild(lable_text);
                div1.appendChild(ul);
                div1.appendChild(label);
                div.appendChild(div1)
                display_owe.appendChild(div);


            }
        }

        

}

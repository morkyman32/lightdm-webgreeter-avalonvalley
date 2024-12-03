var show_hidden_users=false;
var hidden_users=["admin","clarkk"];
var use_bing_image_of_the_day=false;
var default_pfp_path=document.querySelector(".login-input-pfp img").getAttribute("src");

/*********************************************************/
	/*               Callbacks for the greeter               */
	/*********************************************************/

  window.show_loading_image = function() {
    document.querySelector(".loading-icon-cont img").style="opacity:1; transform:scale(1)"
  }

  window.hide_loading_image = function() {
    document.querySelector(".loading-icon-cont img").style=""
  }

  window.hide_caps_indicator = function() {
    document.querySelector(".icon-capslock").style=""
  }

  window.show_caps_indicator = function() {
    document.querySelector(".icon-capslock").style="opacity:1;"
  }
  
	/**
	 * show_message callback.
	 */
	window.show_message = function(text, type) {
		if (0 === text.length) {
			return;
		}
		//console.log(type, text);
    document.querySelector(".message span").innerHTML=text;
    document.querySelector(".message").style="top:35px; opacity:1;"
    setTimeout(() => {
      document.querySelector(".message").style=""
    }, "4000");
	};

	/**
	 * authentication_complete callback.
	 */
	window.authentication_complete = function() {
		if (window.lightdm.is_authenticated) {
			// Start default session
			// let body = document.getElementById('body');
      document.querySelector(".black-fade").style.transition="opacity 0.15s";
      document.querySelector(".black-fade").style.opacity="1";
      setTimeout(() => {
        let session = window.lightdm.default_session
			  window.lightdm.start_session(session)
      }, "150");
		} else {
      hide_loading_image();
			show_message("Authentication failed!", "error");
      document.querySelector(".userlist-item-selected").click();
		}
	};

	/**
	 * autologin_timer_expired callback.
	 */
	function autologin_timer_expired(username) {
		/* Stub.  Does nothing. */
	}

	/*******************************************************************/
	/*                Functions local to this theme                    */
	/*******************************************************************/

	/**
	 * clear_messages
	 */
	function clear_messages() {
		//clear
	}

	/**
	 * Kickoff the authentication process
	 */
	window.start_authentication = function(username) {
		clear_messages();
		window.lightdm.authenticate(username);
	};

	/**
	 * handle the input from the entry field.
	 */
	window.handle_input = function() {
		let entry = document.getElementById("password_entry");
		window.lightdm.respond(entry.value);
	};

	window.addEventListener("GreeterReady", () => {
		window.lightdm.show_message.connect(show_message)
		window.lightdm.authentication_complete.connect(authentication_complete)
		window.lightdm.autologin_timer_expired.connect(autologin_timer_expired)
	});

  var capslock=false;

  document.addEventListener( 'keydown', function( event ) {
    if(event.key=="CapsLock") {
      capslock= (!capslock);
    }
    var caps = (capslock);
    if(caps) {
      show_caps_indicator();
    }
    else {
      hide_caps_indicator();
    }
  });

function initialize_sessions() {
  const template = document.querySelector("#session_template");
  const container = session_template.parentElement;

  container.removeChild(template);

  for (let session of lightdm.sessions) {
    const label = s.querySelector(".session_label");

    let s = template.cloneNode(true);

    s.id = "session_" + session.key;

    let radio = s.querySelector("input");

    label.innerHTML = session.name;
    radio.value = session.key;

    if (session.key === lightdm.default_session.key) {
      radio.checked = true;
    }

    session_container.appendChild(s);
  }
}

function user_clicked(event) {
  
  if (selected_user !== null) {
    selected_user = null;
    lightdm.cancel_authentication();
  }
  torem=document.querySelector(".userlist-item-selected");
  if(torem != undefined) torem.classList.remove("userlist-item-selected");
  //console.log(event.currentTarget)
  event.currentTarget.classList.add("userlist-item-selected")
  selected_user = event.currentTarget.id;
  start_authentication(event.currentTarget.id);
  console.log(event.currentTarget)
  document.querySelector("#password_entry").value="";
  document.querySelector("#password_entry").focus()
  document.querySelector(".input-username").innerHTML=event.currentTarget.dataset.displayname;
  if(event.currentTarget.dataset.pfppath) document.querySelector(".login-input-pfp img").src=event.currentTarget.dataset.pfppath;
  else document.querySelector(".login-input-pfp img").src=default_pfp_path;

  //show_message("");
  event.stopPropagation();

  return false;
}


/*
 * set default avatar for user if none is found
 * @param {any} err user to set avatar
 */
function on_image_error(err) {
  err.currentTarget.src = "img/default_avatar.png";
}

function handle_inputkeypress(obj,event) {
  if(obj.id=="password_entry" && event.key === 'Enter') {
    //console.log("Handling input...")
    show_loading_image();
    //obj.parent.submit();
    handle_input();
  }
}

/* Initialization */

function initialize() {
  initialize_users();
  initialize_clock();
  //document.addEventListener("keydown", key_press_handler);
  load_animation();

  document.addEventListener("keydown", function(event) {
    if (event.ctrlKey && event.shiftKey && event.altKey) {
      show_hidden_users=true;
      initialize_users();
    }
    if (event.key==" " && selected_user==null) {
      //console.log( document.querySelector(".userlist-item:not(#user_template)") );
      document.querySelector(".userlist-item:not(#user_template)").click();
    }
  });

  //console.log( document.querySelector(".user-select-item:not(#user_template)") );
  document.querySelector(".user-select-item:not(#user_template)").click();
}

function load_animation() {

    function unleash_background() {
      document.querySelector(".background-cont").style.transform="scale(1)";
      document.querySelector(".background-cont").style.opacity="1";
    }

    document.querySelector(".black-fade").style.opacity="0";
    if(use_bing_image_of_the_day) {
      fetch("https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=en-US")
    .then(response=>response.json())
    .then(json=>{
      document.querySelector(".background-cont img").src="https://www.bing.com/"+json.images[0].url
      unleash_background();
    })
    .catch(error => {
      unleash_background();
    } )
  }
  else {
    unleash_background();
  }
    
    //document.querySelector(".background-cont audio").play()
}

function fade_out(seconds) {
    document.querySelector(".black-fade").style=`transition: opacity ${seconds}s;`
    //document.querySelector("body").style.transform="scale(0.8) perspective(100px) translateZ(-5px) rotate3d(1, 0, 0, 5deg)";
    document.querySelector("body").style.transform="scale(0.6)";
    document.querySelector(".black-fade").style.opacity="1";
}

function initialize_users() {
  selected_user=null;
  const template = document.querySelector("#user_template");
  const parent = template.parentElement;

  //parent.removeChild(template);

  Array.from(document.querySelectorAll(".user-select-item")).forEach(item => {
    if(item.id!="user_template") item.outerHTML="";
  })

  for (let user of lightdm.users) {

    

    //console.log((user.username))
    if(hidden_users.includes(user.username) && !show_hidden_users) {
      //console.log(user.username + " has been hidden")
      //console.log(hidden_users.includes(user.username))
      continue;
    };
    userNode = template.cloneNode(true);
    const image = userNode.querySelectorAll(".user-select-item-pfp img")[0];
    const name = userNode.querySelectorAll(".user_name")[0];

    name.innerHTML = user.display_name;

    if (user.image) {
      image.src = user.image;
      image.onerror = on_image_error;
    } else {
      image.src = "img/default_avatar.png";
    }

    //console.log(user)
    userNode.id = user.username;
    userNode.dataset.displayname=user.display_name;
    if(user.image.length > 0) userNode.dataset.pfppath=user.image;
    userNode.onclick = user_clicked;
    parent.appendChild(userNode);
  }
}

function system_reboot() {
  fade_out(0.3);
  setTimeout(() => {
    lightdm.restart();
  }, "300");
}

function system_shutdown() {
  fade_out(0.3);
  setTimeout(() => {
    lightdm.shutdown();
  }, "300");
}


function system_suspend() {
  lightdm.suspend();
}

function updateTime() {
  const today = new Date();

      const day = today.toLocaleDateString("en-US", { weekday: 'long' });
      const hours = today.getHours(); // 24-hour format
      const minutes = today.getMinutes().toString().padStart(2, "0");
      const seconds = today.getSeconds();
      const month = today.toLocaleDateString("en-US", { month: 'long' });
      const date = today.getDate();
      const year = today.getFullYear();

      var ampm = hours >= 12 ? 'PM' : 'AM';

      const formattedTime1 = `${day}, ${hours}:${minutes}`
      const formattedTime2 = `${month} ${date}, ${year}`;

      document.querySelector(".widget-clock-face .sec").style.transform=`rotate(${(seconds*6)}deg)`;
      document.querySelector(".widget-clock-face .min").style.transform=`rotate(${(minutes*6)}deg)`;
      document.querySelector(".widget-clock-face .hour").style.transform=`rotate(${ ((hours%12)*30) + (minutes/60)*30 }deg)`;

      document.querySelector(".widget-clock-time .time").innerHTML=`${hours}:${minutes} ${ampm}`;
      document.querySelector(".widget-clock-time .day").innerHTML=`${day}`;
      document.querySelector(".widget-clock-time .date").innerHTML=`${month} ${date}, ${year}`;
}

function initialize_clock() {
  //const time = document.querySelector("#time");

  //time.innerHTML = theme_utils.get_current_localized_time();
  updateTime();
  setInterval(
    () => {
      updateTime()
    },
    1000
  );
}

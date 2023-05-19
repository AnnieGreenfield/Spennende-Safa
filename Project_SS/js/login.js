if ( document.cookie.split(";").some((item) => item.trim().startsWith('user'))  ) 

	{
		const cookieValue = document.cookie
  			.split("; ")
  			.find((row) => row.startsWith("user="))
  			?.split("=")[1];

		document.getElementById("data").setAttribute("data-user",cookieValue);
	}



  
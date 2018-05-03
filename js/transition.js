















function transition(name) {
    if (name === "all-donations")
    {
        snd.currentTime = 0;
        snd.play();
      	$("#initial-content").fadeIn(250);
      	$("#value-scale").fadeIn(1000);
      	$("#view-donor-type").fadeOut(250);
      	$("#view-source-type").fadeOut(250);
      	$("#view-party-type").fadeOut(250);
      	$("#view-amount-type").fadeOut(250);
      	return total();
    	//location.reload();
    }
    if (name === "group-by-party")
    {
        snd.currentTime = 0;
        snd.play();
      	$("#initial-content").fadeOut(250);
      	$("#value-scale").fadeOut(250);
      	$("#view-donor-type").fadeOut(250);
      	$("#view-source-type").fadeOut(250);
      	$("#view-party-type").fadeIn(1000);
      	$("#view-amount-type").fadeOut(250);
      	return partyGroup();
    }
    if (name === "group-by-donor-type")
    {
        snd.currentTime = 0;
        snd.play();
      	$("#initial-content").fadeOut(250);
      	$("#value-scale").fadeOut(250);
      	$("#view-party-type").fadeOut(250);
      	$("#view-source-type").fadeOut(250);
      	$("#view-donor-type").fadeIn(1000);
      	$("#view-amount-type").fadeOut(250);
      	return donorType();
    }
    if (name === "group-by-money-source")
    {
        snd.currentTime = 0;
        snd.play();
      	$("#initial-content").fadeOut(250);
      	$("#value-scale").fadeOut(250);
      	$("#view-donor-type").fadeOut(250);
      	$("#view-party-type").fadeOut(250);
      	$("#view-source-type").fadeIn(1000);
      	$("#view-amount-type").fadeOut(250);
      	return fundsType();
    }
    if (name === "group-by-the-amount-of-donors")
    {
        snd.currentTime = 0;
        snd.play();
    		$("#initial-content").fadeOut(250);
    		$("#value-scale").fadeOut(250);
    		$("#view-donor-type").fadeOut(250);
    		$("#view-party-type").fadeOut(250);
    		$("#view-source-type").fadeOut(250);
    		$("#view-amount-type").fadeIn(250);
    		return amountType();
    }


}
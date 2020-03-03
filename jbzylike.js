// check if there is a div with chest id in the post
    var check_chest = document.getElementById("chest");
    if (check_chest) {

        // countdown function
        function countchest(wait) {
            var timeleft = wait;
            var downloadTimer = setInterval(function() {
                document.getElementById("countbox").innerHTML = timeleft + " seconds";
                timeleft -= 1;
                if (timeleft < = 0) {
                    clearInterval(downloadTimer);
                    document.getElementById("countbox").innerHTML = ""

                    // hide the lock when the time is out & show the chest content
                    jQuery('#lock').fadeOut(1000);
                    jQuery('#chest').fadeIn(1000);
                }
            }, 1000);
        }

        // start the countdown - you can replace 83500 with any amount of seconds you like
        countchest(83500);

        // get the content title and show it on the locker to intrigue user to share
        var content_hint = jQuery('#chest .content-hint')[0];
        if (content_hint) {
            jQuery('.content-hint')[0].innerHTML = 'A Gift: ' + content_hint;
        }

        // move the lock and make it float above the chest
        jQuery('#lock').insertAfter(jQuery('#lock').parent().find('#chest'));
        jQuery('#lock').css('display', 'flex');

        // show the sharing counter based on real likes & shares of current link on facebook
        jQuery('.fb-like').attr('data-href', location.href);

        // when I user click on locker, open the dialog for sharing
        jQuery('#lock').on('click', function(event) {
            FB.ui({
                method: 'share',
                href: location.href
            }, function(response) {
                if (response && !response.error_code) {

                    // hide the lock when sharing is done and show the chest
                    jQuery('#lock').fadeOut(1000);
                    jQuery('#chest').fadeIn(1000);

                } else {
                    // show an alert when user cancel and don't share yoru post
                    alert('Something wrong! You can wait, or try to share again!');
                }
            });
        });
    }

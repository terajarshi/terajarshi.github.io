<!DOCTYPE html>
<html class="has-navbar-fixed-top has-searchbar-fixed-top" lang="en">
    <head profile="http://www.w3.org/2005/10/profile">
        <link rel="icon" 
              type="image/png" 
              href="favicon.ico">
    <meta charset="utf-8">
    <meta name="theme-color" content="#0f171e">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>MovieGrabber - Open Source Movie Grabber Site</title>
    <meta name=”referrer” content=”no-referrer”>
    <meta name="description" content="This site grabs downlad links from various online hosted movie downloading site, main goal is to give a simple uninterrupted user experience, now you dont have to get harrassed by undesired popup ads and click wait links. Soon We will be adding ads from those site which we are grabbing links so that they dont have to suffer from losses.">
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
    <link rel="manifest" href="manifest.json">
    <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5">
    <meta name="apple-mobile-web-app-title" content="MovieGrabber">
    <meta name="application-name" content="MovieGrabber">
    <meta name="msapplication-TileColor" content="#2b5797">
    <meta name="theme-color" content="#ffffff">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.1/css/bulma.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" integrity="sha512-iBBXm8fW90+nuLcSKlbmrPcLa0OT92xO1BIsZ+ywDWZCvqsWgccV3gFoRBv0z+8dLJgyAHIhR35VZc2oM/gI1w==" crossorigin="anonymous" />
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script src="https://unpkg.com/@gauntface/dpad-nav@3.0.1/build/browser/dpad-controller.js" async defer></script>
    <script src="https://unpkg.com/@gauntface/dpad-nav@3.0.1/build/browser/debug-controller.js" async defer></script>
    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
    <link rel="stylesheet" href="assets/custom.css">
  </head>
  <body>
      <!-- Navigation bar starts here -->
    <nav class="navbar is-dark is-fixed-top">
        <div class="navbar-brand">
            <a href="/" class="navbar-item">
                <img src="assets/logo.png" alt="">
            </a>
            <a class="navbar-burger">
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
            </a>
        </div>
        <div class="navbar-menu">
            <div class="navbar-start">
                <a href="?search=Hindi" class="navbar-item has-text-white">Hindi</a>
                <a href="?search=Bengali" class="navbar-item has-text-white">Bengali</a>
                <a href="?search=Hollywood" class="navbar-item has-text-white">Hollywood</a>
                <a href="?search=Anime" class="navbar-item has-text-white">Anime</a>
            </div>
        </div>
        <div class="navbar-item" id="searchForm">
            <form action="" class="form" id="search">
                <div class="field has-addons">
                    <div class="control has-icons-left is-expanded">
                        <input type="text" name="search" class="input is-fullwidth is-small" placeholder="Search here..." list="autocomplete">
                        <datalist id="autocomplete"></datalist>
                        <span class="icon is-left"><i class="fas fa-search"></i></span>
                    </div>
                    <div class="control is-hidden">
                        <button class="button is-small" type="button" id="mic"><i class="fas fa-microphone"></i></button>
                    </div>
                    <div class="control">
                        <button class="button is-dark is-small" type="submit">Search</button>
                    </div>
                </div>
            </form>
        </div>
    </nav>
        <!-- navigration bar ends here -->

        <!-- loading spinner modal -->
        <div class="modal" id="modal">
            <a class="button is-small is-fullwidth is-dark" href="${link.link}#Intent;action=android.intent.action.VIEW;scheme=http;type=video/mp4;end">${link.title}${link.info?`<br>${link.info}`:''}</a><br>
      <button class="button is-small is-fullwidth is-dark" onclick="shareLink('${link.link}')">Share - ${link.title}</button>
        </div>

        <!-- main section starts here -->
    <div class="mainSection" style="max-width:800px; margin:auto;">
        <ul class="searchResult has-text-centered">
        </ul>
    </div>
        <!-- main section ends here -->



        <!-- footer stars here -->
    <p class="has-text-centered container is-fluid">
        <img src="assets/logo.png" alt="" width="150"><br>
        <ul class="footerLinks has-text-centered">
            <li><a class="footerLink" href="">Terms and Privacy Notice </a></li>
            <li><a class="footerLink" href="">Send us feedback </a></li>
            <li><a class="footerLink" href="">Help</a></li>
        </ul>
        <p class="lastText has-text-centered">Whiterose by fSociety and its fans :)</p>
    </p>
        <!-- footer ends here -->
        <script src="ui.js"></script>
        <script src="backend_support.js"></script>
        <script src="extractors.js"></script>
        <script src="advanced_search.js"></script>
        <script src="app.js"></script>
  </body>
</html>
